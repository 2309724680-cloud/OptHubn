import asyncio
import json
import os
import sys
import uuid
import socket
import signal
from datetime import datetime, timezone
from pathlib import Path

import httpx

from agent import config
from agent.executor import Executor
from agent.backends.onnx_backend import OnnxRuntimeNPUBackend

DEVICE_ID_FILE = Path(__file__).resolve().parent / ".device_id"


def _get_or_create_device_id() -> str:
    if device_id_env := os.getenv("DEVICE_ID"):
        return device_id_env
    if DEVICE_ID_FILE.exists():
        return DEVICE_ID_FILE.read_text().strip()
    new_id = str(uuid.uuid4())
    DEVICE_ID_FILE.write_text(new_id)
    return new_id


DEVICE_ID = _get_or_create_device_id()
HOSTNAME = socket.gethostname()


class Agent:
    def __init__(self) -> None:
        self.device_id = DEVICE_ID
        self.hostname = HOSTNAME
        self.status = "idle"
        self.client = httpx.AsyncClient(
            base_url=config.HUB_API_URL,
            timeout=httpx.Timeout(30.0),
        )

    async def register_device(self) -> None:
        try:
            resp = await self.client.post(
                "/api/v1/devices",
                json={
                    "device_id": self.device_id,
                    "hostname": self.hostname,
                    "agent_version": "0.1.0",
                },
            )
            if resp.status_code < 400:
                print(f"[agent] 设备已注册: {self.device_id}")
            else:
                print(f"[agent] 设备注册响应 {resp.status_code}: {resp.text}")
        except httpx.RequestError as e:
            print(f"[agent] 设备注册失败: {e}")

    async def heartbeat(self) -> None:
        while True:
            try:
                await self.client.post(
                    "/api/v1/agent/heartbeat",
                    json={
                        "device_id": self.device_id,
                        "status": self.status,
                        "hostname": self.hostname,
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                    },
                )
            except httpx.RequestError as e:
                print(f"[heartbeat] 发送失败: {e}")
            await asyncio.sleep(config.HEARTBEAT_INTERVAL_SECONDS)

    async def run_loop(self) -> None:
        heartbeat_task = asyncio.create_task(self.heartbeat())

        try:
            while True:
                task = await self._poll_task()
                if task is None:
                    await asyncio.sleep(config.POLL_INTERVAL_SECONDS)
                    continue

                run_id = task["run_id"]
                solution_id = task["solution_id"]
                model_path = task["model_path"]
                precision = task.get("precision", "fp16")
                inputs = task.get("inputs", {})
                test_cfg = task.get("test_config", {})

                print(f"[agent] 拉取到任务 run={run_id}")
                self.status = "busy"

                try:
                    await self._update_status(run_id, "running")
                    result = await asyncio.to_thread(
                        self._execute,
                        model_path=model_path,
                        precision=precision,
                        inputs=inputs,
                        warmup_n=test_cfg.get("warm_up_rounds", config.DEFAULT_WARMUP_ITERATIONS),
                        sample_n=test_cfg.get("test_rounds", config.DEFAULT_SAMPLE_ITERATIONS),
                        rounds=config.DEFAULT_REPEAT_ROUNDS,
                    )

                    result_payload = {
                        "latency_ms": {
                            "p50": result.p50_ms,
                            "p95": result.p95_ms,
                            "p99": result.p99_ms,
                        },
                        "throughput": result.qps,
                        "memory_peak_mb": result.memory_peak_mb,
                        "power_mw": None,
                        "ttft_ms": None,
                        "tps": None,
                        "accuracy": {},
                        "cv": result.cv,
                        "stability": "unstable" if getattr(result, "unstable", False) else "normal",
                        "raw_sample_data": None,
                        "is_aggregated": True,
                    }

                    resp = await self.client.post(
                        f"/api/v1/runs/{run_id}/result", json=result_payload
                    )
                    if resp.status_code < 400:
                        print(f"[agent] 结果上报成功 run={run_id}")
                    else:
                        print(f"[agent] 上报失败 {resp.status_code}: {resp.text}")
                        await self._update_status(run_id, "failed", str(resp.text))

                except Exception as e:
                    print(f"[agent] 任务执行异常 run={run_id}: {e}")
                    await self._update_status(run_id, "failed", str(e))
                finally:
                    self.status = "idle"

        finally:
            heartbeat_task.cancel()
            await self.client.aclose()

    async def _poll_task(self) -> dict | None:
        try:
            resp = await self.client.get(
                "/api/v1/agent/tasks/next",
                params={"device_id": self.device_id},
            )
            if resp.status_code == 404:
                return None
            if resp.status_code < 400:
                return resp.json()
            print(f"[agent] 拉取任务异常 {resp.status_code}")
            return None
        except httpx.RequestError as e:
            print(f"[agent] 拉取任务失败: {e}")
            return None

    async def _update_status(self, run_id: str, status: str, error: str = "") -> None:
        try:
            params = {"status": status}
            if error:
                params["error_message"] = error
            await self.client.patch(
                f"/api/v1/runs/{run_id}/status",
                params=params,
            )
        except httpx.RequestError as e:
            print(f"[agent] 状态更新失败: {e}")

    @staticmethod
    def _execute(
        model_path: str,
        precision: str,
        inputs: dict,
        warmup_n: int,
        sample_n: int,
        rounds: int,
    ):
        backend = OnnxRuntimeNPUBackend()
        executor = Executor(backend)
        return executor.run(model_path, precision, inputs, warmup_n, sample_n, rounds)


def main() -> None:
    async def _run():
        agent = Agent()
        await agent.register_device()
        await agent.run_loop()

    asyncio.run(_run())


if __name__ == "__main__":
    main()
