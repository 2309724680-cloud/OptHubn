from abc import ABC, abstractmethod


class NPUBackend(ABC):
    """NPU 推理后端抽象基类，所有硬件适配器需实现此接口"""

    @abstractmethod
    def load(self, model_path: str, precision: str) -> None:
        """加载模型到 NPU 设备"""

    @abstractmethod
    def warmup(self, inputs: dict, n: int) -> None:
        """预热推理，执行 n 次，结果丢弃"""

    @abstractmethod
    def run(self, inputs: dict) -> dict:
        """执行单次推理，返回 {"outputs": array, "memory_peak_mb": float | None}"""

    @abstractmethod
    def cleanup(self) -> None:
        """释放 NPU 资源"""
