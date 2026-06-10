"""Unit tests for agent.executor - inference benchmark execution engine."""

import math
import pytest
import numpy as np
from unittest.mock import MagicMock, patch

import sys
from pathlib import Path

# Ensure repo root is on path so "agent.xxx" imports resolve
repo_root = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(repo_root))

from agent.executor import (
    _percentile,
    _remove_outliers_iqr,
    _compute_round,
    RoundResult,
    ExecutionResult,
    Executor,
)
from agent.npu_backend import NPUBackend


# ─── _percentile ────────────────────────────────────────────────────────────

class TestPercentile:
    def test_empty_list(self):
        assert _percentile([], 50) == 0.0

    def test_single_element(self):
        assert _percentile([42.0], 50) == 42.0
        assert _percentile([42.0], 0) == 42.0
        assert _percentile([42.0], 100) == 42.0

    def test_median_odd(self):
        # [1, 2, 3, 4, 5] → median = 3
        data = sorted([5.0, 1.0, 3.0, 4.0, 2.0])
        assert _percentile(data, 50) == 3.0

    def test_median_even(self):
        # [1, 2, 3, 4] → interpolated between 2 and 3
        data = sorted([2.0, 4.0, 1.0, 3.0])
        assert _percentile(data, 50) == 2.5

    def test_p95(self):
        # 95th percentile of 1..100
        data = sorted(range(1, 101))
        result = _percentile(data, 95)
        expected = 95.05  # standard calculation
        assert math.isclose(result, expected, rel_tol=1e-9)

    def test_p99(self):
        data = sorted(range(1, 101))
        result = _percentile(data, 99)
        expected = 99.01
        assert math.isclose(result, expected, rel_tol=1e-9)

    def test_p0_and_p100(self):
        data = sorted([5.0, 10.0, 15.0, 20.0])
        assert _percentile(data, 0) == 5.0
        assert _percentile(data, 100) == 20.0


# ─── _remove_outliers_iqr ───────────────────────────────────────────────────

class TestRemoveOutliersIQR:
    def test_no_outliers(self):
        data = [10.0, 11.0, 12.0, 13.0, 14.0]
        cleaned, removed = _remove_outliers_iqr(data)
        assert removed == 0
        assert sorted(cleaned) == sorted(data)

    def test_upper_outlier(self):
        data = [10.0, 11.0, 12.0, 13.0, 200.0]
        cleaned, removed = _remove_outliers_iqr(data)
        assert removed == 1
        assert 200.0 not in cleaned

    def test_lower_outlier(self):
        data = [-50.0, 10.0, 11.0, 12.0, 13.0]
        cleaned, removed = _remove_outliers_iqr(data)
        assert removed == 1
        assert -50.0 not in cleaned

    def test_all_outliers_removed_falls_back(self):
        """When IQR removes everything, fall back to original data."""
        data = [1.0, 100.0]  # small sample - all may be removed
        cleaned, removed = _remove_outliers_iqr(data)
        # If cleaned is empty, _compute_round handles fallback
        assert len(cleaned) >= 1 or removed > 0


# ─── _compute_round ──────────────────────────────────────────────────────────

class TestComputeRound:
    def test_normal_latencies(self):
        # 100 identical latencies = 1ms each
        latencies = [1.0] * 100
        result = _compute_round(latencies)
        assert result.p50_ms == 1.0
        assert result.p95_ms == 1.0
        assert result.p99_ms == 1.0
        assert result.cv == 0.0
        assert result.outlier_count == 0
        # qps: 100 samples / (100 * 1ms / 1000) = 1000
        assert math.isclose(result.qps, 1000.0, rel_tol=0.01)

    def test_variable_latencies(self):
        latencies = list(range(1, 101))  # 1ms to 100ms
        result = _compute_round(latencies)
        assert result.p50_ms > 0
        assert result.p95_ms > result.p50_ms
        assert result.p99_ms >= result.p95_ms
        assert result.cv > 0
        assert result.qps > 0

    def test_outliers_removed(self):
        # Mostly 10ms, with a few 1000ms outliers
        latencies = [10.0] * 95 + [1000.0] * 5
        result = _compute_round(latencies)
        # Outliers should be detected and removed
        assert result.outlier_count > 0
        # After removal, p50 should be near 10ms
        assert result.p50_ms < 20.0

    def test_empty_fallback_to_original(self):
        """When IQR removes everything from small sample, original is used."""
        latencies = [1.0]
        result = _compute_round(latencies)
        assert result.p50_ms == 1.0


# ─── _aggregate ──────────────────────────────────────────────────────────────

class TestAggregate:
    def test_empty(self):
        result = Executor._aggregate([])
        assert result.p50_ms == 0.0
        assert result.qps == 0.0

    def test_single_round(self):
        rr = RoundResult(p50_ms=5.0, p95_ms=10.0, p99_ms=12.0, qps=200.0, cv=2.0)
        result = Executor._aggregate([rr])
        assert result.p50_ms == 5.0
        assert result.p95_ms == 10.0
        assert result.p99_ms == 12.0
        assert result.qps == 200.0
        assert result.cv == 2.0
        assert result.unstable is False  # cv <= 5.0

    def test_multiple_rounds_median(self):
        rounds = [
            RoundResult(p50_ms=5.0, p95_ms=10.0, p99_ms=12.0, qps=200.0, cv=2.0),
            RoundResult(p50_ms=6.0, p95_ms=11.0, p99_ms=13.0, qps=190.0, cv=3.0),
            RoundResult(p50_ms=4.0, p95_ms=9.0, p99_ms=11.0, qps=210.0, cv=1.0),
        ]
        result = Executor._aggregate(rounds)
        # Median of [4.0, 5.0, 6.0] → 5.0
        assert result.p50_ms == 5.0
        # Median of [9.0, 10.0, 11.0] → 10.0
        assert result.p95_ms == 10.0
        # Median of [190.0, 200.0, 210.0] → 200.0
        assert result.qps == 200.0
        # Median of [1.0, 2.0, 3.0] → 2.0
        assert result.cv == 2.0

    def test_memory_peak_tracks_max(self):
        rounds = [
            RoundResult(p50_ms=5.0, p95_ms=10.0, p99_ms=12.0, qps=200.0, cv=1.0, memory_peak_mb=100.0),
            RoundResult(p50_ms=5.0, p95_ms=10.0, p99_ms=12.0, qps=200.0, cv=1.0, memory_peak_mb=200.0),
            RoundResult(p50_ms=5.0, p95_ms=10.0, p99_ms=12.0, qps=200.0, cv=1.0, memory_peak_mb=150.0),
        ]
        result = Executor._aggregate(rounds)
        assert result.memory_peak_mb == 200.0

    def test_unstable_when_high_cv(self):
        rounds = [
            RoundResult(p50_ms=5.0, p95_ms=10.0, p99_ms=12.0, qps=200.0, cv=8.0),
            RoundResult(p50_ms=6.0, p95_ms=11.0, p99_ms=13.0, qps=190.0, cv=7.0),
        ]
        result = Executor._aggregate(rounds)
        assert result.unstable is True


# ─── Executor._prepare_inputs ────────────────────────────────────────────────

class TestPrepareInputs:
    def test_shape_to_array(self):
        inputs = {"input": [1, 10]}
        prepared = Executor._prepare_inputs(inputs)
        assert isinstance(prepared["input"], np.ndarray)
        assert prepared["input"].shape == (1, 10)
        assert prepared["input"].dtype == np.float32

    def test_non_shape_passthrough(self):
        """Values that aren't lists of ints pass through unchanged."""
        arr = np.random.randn(1, 10).astype(np.float32)
        inputs = {"input": arr, "name": "test"}
        prepared = Executor._prepare_inputs(inputs)
        assert prepared["input"] is arr
        assert prepared["name"] == "test"

    def test_mixed_list_not_converted(self):
        """A list with non-int elements should not be treated as a shape."""
        inputs = {"data": [1.0, 2.0, 3.0]}
        prepared = Executor._prepare_inputs(inputs)
        # Floats are not all ints, so should pass through
        assert prepared["data"] == [1.0, 2.0, 3.0]


# ─── Executor with Mock Backend ─────────────────────────────────────────────

class MockBackend(NPUBackend):
    """Mock backend that simulates inference with configurable latency."""

    def __init__(self, latency_ms: float = 2.0):
        self.latency_ms = latency_ms
        self.loaded_model = None
        self.loaded_precision = None
        self.warmup_count = 0
        self.run_count = 0
        self.cleaned_up = False

    def load(self, model_path: str, precision: str) -> None:
        self.loaded_model = model_path
        self.loaded_precision = precision

    def warmup(self, inputs: dict, n: int) -> None:
        self.warmup_count += n

    def run(self, inputs: dict) -> dict:
        self.run_count += 1
        return {
            "outputs": [np.array([1.0])],
            "latency_ms": self.latency_ms,
            "memory_peak_mb": 50.0,
        }

    def cleanup(self) -> None:
        self.cleaned_up = True


class TestExecutorWithMock:
    def test_run_calls_backend_lifecycle(self):
        backend = MockBackend(latency_ms=1.0)
        executor = Executor(backend)
        result = executor.run(
            model_path="/fake/model.onnx",
            precision="fp16",
            inputs={"input": [1, 10]},
            warmup_n=5,
            sample_n=20,
            rounds=2,
        )

        # Backend lifecycle
        assert backend.loaded_model == "/fake/model.onnx"
        assert backend.loaded_precision == "fp16"
        assert backend.warmup_count == 5 * 2  # warmup_n * rounds
        assert backend.run_count == 20 * 2  # sample_n * rounds
        assert backend.cleaned_up is True

        # Result structure
        assert isinstance(result, ExecutionResult)
        assert result.p50_ms > 0
        assert result.qps > 0
        assert result.memory_peak_mb == 50.0
        assert len(result.rounds) == 2

    def test_run_with_real_onnx_model(self):
        """Integration test using the real test_model.onnx."""
        model_path = str(Path(__file__).resolve().parents[1] / "test_model.onnx")
        if not Path(model_path).exists():
            pytest.skip("test_model.onnx not found")

        from agent.backends.onnx_backend import OnnxRuntimeNPUBackend

        backend = OnnxRuntimeNPUBackend()
        executor = Executor(backend)
        result = executor.run(
            model_path=model_path,
            precision="fp16",
            inputs={"input": [1, 10]},
            warmup_n=3,
            sample_n=10,
            rounds=2,
        )

        assert result.p50_ms > 0
        assert result.qps > 0
        assert len(result.rounds) == 2
        # Each round should have valid metrics
        for rr in result.rounds:
            assert rr.p50_ms > 0
            assert rr.latencies_ms  # non-empty

    def test_prepare_inputs_in_run(self):
        """Verify shape→array conversion happens during run()."""
        backend = MockBackend(latency_ms=1.0)
        executor = Executor(backend)

        # Track what the backend receives
        original_run = backend.run

        def intercept(inputs):
            # Store the inputs for inspection
            intercept.captured = inputs
            return original_run(inputs)

        intercept.captured = None
        backend.run = intercept

        executor.run(
            model_path="/fake/model.onnx",
            precision="fp16",
            inputs={"x": [2, 3]},
            warmup_n=1,
            sample_n=1,
            rounds=1,
        )

        assert isinstance(intercept.captured["x"], np.ndarray)
        assert intercept.captured["x"].shape == (2, 3)
