import statistics
import math
import time
from dataclasses import dataclass, field
import numpy as np
from agent.npu_backend import NPUBackend
from agent import config


@dataclass
class RoundResult:
    latencies_ms: list[float] = field(default_factory=list)
    p50_ms: float = 0.0
    p95_ms: float = 0.0
    p99_ms: float = 0.0
    qps: float = 0.0
    cv: float = 0.0
    memory_peak_mb: float | None = None
    outlier_count: int = 0


def _percentile(sorted_data: list[float], p: float) -> float:
    if not sorted_data:
        return 0.0
    k = (len(sorted_data) - 1) * p / 100
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return sorted_data[int(k)]
    return sorted_data[f] * (c - k) + sorted_data[c] * (k - f)


def _remove_outliers_iqr(data: list[float]) -> tuple[list[float], int]:
    """IQR 异常值检测，返回 (清洗后数据, 剔除数量)"""
    sorted_data = sorted(data)
    q1 = _percentile(sorted_data, 25)
    q3 = _percentile(sorted_data, 75)
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    cleaned = [x for x in data if lower <= x <= upper]
    return cleaned, len(data) - len(cleaned)


def _compute_round(latencies: list[float]) -> RoundResult:
    cleaned, removed = _remove_outliers_iqr(latencies)
    if not cleaned:
        cleaned = latencies
        removed = 0

    s = sorted(cleaned)
    total_time_s = sum(cleaned) / 1000
    n = len(cleaned)

    return RoundResult(
        latencies_ms=cleaned,
        p50_ms=round(_percentile(s, 50), 3),
        p95_ms=round(_percentile(s, 95), 3),
        p99_ms=round(_percentile(s, 99), 3),
        qps=round(n / total_time_s, 3) if total_time_s > 0 else 0.0,
        cv=round(statistics.stdev(cleaned) / statistics.mean(cleaned) * 100, 2) if len(cleaned) > 1 else 0.0,
        outlier_count=removed,
    )


@dataclass
class ExecutionResult:
    """多轮执行的最终聚合结果"""
    p50_ms: float = 0.0
    p95_ms: float = 0.0
    p99_ms: float = 0.0
    qps: float = 0.0
    cv: float = 0.0
    memory_peak_mb: float | None = None
    rounds: list[RoundResult] = field(default_factory=list)
    unstable: bool = False


class Executor:
    """推理执行器：预热 → 采样 → 指标计算 → 多轮聚合"""

    def __init__(self, backend: NPUBackend) -> None:
        self.backend = backend

    @staticmethod
    def _prepare_inputs(inputs: dict) -> dict:
        """若 inputs 值为 shape (list[int])，则转为随机 numpy 数组"""
        prepared = {}
        for name, val in inputs.items():
            if isinstance(val, list) and all(isinstance(x, int) for x in val):
                prepared[name] = np.random.randn(*val).astype(np.float32)
            else:
                prepared[name] = val
        return prepared

    def run(
        self,
        model_path: str,
        precision: str,
        inputs: dict,
        warmup_n: int = config.DEFAULT_WARMUP_ITERATIONS,
        sample_n: int = config.DEFAULT_SAMPLE_ITERATIONS,
        rounds: int = config.DEFAULT_REPEAT_ROUNDS,
    ) -> ExecutionResult:
        self.backend.load(model_path, precision)

        inputs = self._prepare_inputs(inputs)

        try:
            round_results: list[RoundResult] = []
            for _ in range(rounds):
                rr = self._run_single_round(inputs, warmup_n, sample_n)
                round_results.append(rr)
        finally:
            self.backend.cleanup()

        return self._aggregate(round_results)

    def _run_single_round(
        self, inputs: dict, warmup_n: int, sample_n: int
    ) -> RoundResult:
        self.backend.warmup(inputs, warmup_n)

        latencies: list[float] = []
        peak_mem: float | None = None

        for _ in range(sample_n):
            out = self.backend.run(inputs)
            latencies.append(out["latency_ms"])
            if out.get("memory_peak_mb") is not None:
                mem = out["memory_peak_mb"]
                if peak_mem is None or mem > peak_mem:
                    peak_mem = mem

        rr = _compute_round(latencies)
        rr.memory_peak_mb = peak_mem
        return rr

    @staticmethod
    def _aggregate(round_results: list[RoundResult]) -> ExecutionResult:
        if not round_results:
            return ExecutionResult()

        p50s = sorted(r.p50_ms for r in round_results)
        p95s = sorted(r.p95_ms for r in round_results)
        p99s = sorted(r.p99_ms for r in round_results)
        qpss = sorted(r.qps for r in round_results)
        cvs = [r.cv for r in round_results]
        mems = [r.memory_peak_mb for r in round_results if r.memory_peak_mb is not None]

        median_idx = len(round_results) // 2

        result = ExecutionResult(
            p50_ms=round(p50s[median_idx], 3),
            p95_ms=round(p95s[median_idx], 3),
            p99_ms=round(p99s[median_idx], 3),
            qps=round(qpss[median_idx], 3),
            cv=round(statistics.median(cvs), 2) if cvs else 0.0,
            memory_peak_mb=round(max(mems), 2) if mems else None,
            rounds=round_results,
        )

        result.unstable = result.cv > 5.0
        return result
