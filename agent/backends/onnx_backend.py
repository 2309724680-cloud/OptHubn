import time
import numpy as np
from agent.npu_backend import NPUBackend


class OnnxRuntimeNPUBackend(NPUBackend):
    """基于 ONNX Runtime 的通用 NPU Backend"""

    def __init__(self) -> None:
        self.session = None
        self.feed_names: list[str] = []
        self.precision: str = "fp16"

    def load(self, model_path: str, precision: str) -> None:
        import onnxruntime as ort

        providers = ["CPUExecutionProvider"]
        if precision == "fp16":
            try:
                providers = ["DmlExecutionProvider", "CPUExecutionProvider"]
            except Exception:
                pass

        sess_options = ort.SessionOptions()
        sess_options.graph_optimization_level = (
            ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        )

        self.session = ort.InferenceSession(model_path, sess_options, providers=providers)
        self.feed_names = [inp.name for inp in self.session.get_inputs()]
        self.precision = precision

    def warmup(self, inputs: dict, n: int) -> None:
        for _ in range(n):
            feeds = {name: inputs[name] for name in self.feed_names}
            self.session.run(None, feeds)

    def run(self, inputs: dict) -> dict:
        feeds = {name: inputs[name] for name in self.feed_names}
        start = time.perf_counter()
        outputs = self.session.run(None, feeds)
        elapsed_ms = (time.perf_counter() - start) * 1000

        return {
            "outputs": outputs,
            "latency_ms": elapsed_ms,
            "memory_peak_mb": None,
        }

    def cleanup(self) -> None:
        self.session = None
