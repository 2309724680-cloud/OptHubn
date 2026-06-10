import os

HUB_API_URL = os.getenv("HUB_API_URL", "http://localhost:8000")
API_KEY = os.getenv("AGENT_API_KEY", "npukey_dev_local")

POLL_INTERVAL_SECONDS = int(os.getenv("POLL_INTERVAL", "5"))
HEARTBEAT_INTERVAL_SECONDS = int(os.getenv("HEARTBEAT_INTERVAL", "30"))

# 推理默认参数
DEFAULT_WARMUP_ITERATIONS = int(os.getenv("DEFAULT_WARMUP", "10"))
DEFAULT_SAMPLE_ITERATIONS = int(os.getenv("DEFAULT_SAMPLES", "100"))
DEFAULT_REPEAT_ROUNDS = int(os.getenv("DEFAULT_REPEAT_ROUNDS", "3"))

# 任务超时（秒）
TASK_TIMEOUT_SECONDS = int(os.getenv("TASK_TIMEOUT", "1800"))
