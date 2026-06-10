"""Tests for Agent API endpoints: device registration, heartbeat, task polling."""

import uuid
import pytest


@pytest.fixture
def device_data():
    return {
        "device_id": str(uuid.uuid4()),
        "hostname": "test-npu-node",
        "agent_version": "0.1.0",
        "chip_name": "TestChip-X100",
        "agent_endpoint": "http://10.0.0.1:9000",
    }


@pytest.fixture
async def registered_device(client, device_data):
    """Register a device and return its data."""
    resp = await client.post("/api/v1/devices", json=device_data)
    assert resp.status_code == 201
    return device_data


# ─── Device Registration ────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_register_device(client, device_data):
    resp = await client.post("/api/v1/devices", json=device_data)
    assert resp.status_code == 201
    data = resp.json()
    assert data["device_id"] == device_data["device_id"]
    assert data["status"] == "online"


@pytest.mark.asyncio
async def test_register_device_missing_id(client):
    resp = await client.post("/api/v1/devices", json={"hostname": "no-id"})
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_register_device_empty_hostname(client):
    did = str(uuid.uuid4())
    resp = await client.post(
        "/api/v1/devices", json={"device_id": did}
    )
    assert resp.status_code == 201
    # hostname defaults to empty string


@pytest.mark.asyncio
async def test_register_same_device_updates(client, device_data):
    """Re-registering the same device_id should update the existing record."""
    # First registration
    await client.post("/api/v1/devices", json=device_data)

    # Second registration with different hostname
    updated = {**device_data, "hostname": "updated-host"}
    resp = await client.post("/api/v1/devices", json=updated)
    assert resp.status_code == 201
    assert resp.json()["status"] == "online"


# ─── Heartbeat ──────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_heartbeat(client, registered_device):
    resp = await client.post(
        "/api/v1/agent/heartbeat",
        json={
            "device_id": registered_device["device_id"],
            "status": "busy",
        },
    )
    assert resp.status_code == 200
    assert resp.json() == {"ok": True}


@pytest.mark.asyncio
async def test_heartbeat_default_status(client, registered_device):
    """status is optional, defaults to 'online'."""
    resp = await client.post(
        "/api/v1/agent/heartbeat",
        json={"device_id": registered_device["device_id"]},
    )
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_heartbeat_unregistered_device(client):
    fake_id = str(uuid.uuid4())
    resp = await client.post(
        "/api/v1/agent/heartbeat",
        json={"device_id": fake_id},
    )
    assert resp.status_code == 404


# ─── Task Polling ───────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_poll_task_unregistered_device(client):
    fake_id = str(uuid.uuid4())
    resp = await client.get(
        "/api/v1/agent/tasks/next", params={"device_id": fake_id}
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_poll_task_no_pending_tasks(client, registered_device):
    """With a registered device but no pending tasks, returns 404."""
    resp = await client.get(
        "/api/v1/agent/tasks/next",
        params={"device_id": registered_device["device_id"]},
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_poll_task_returns_pending(client, registered_device):
    """When a pending run exists for the device, it should be returned."""
    # First create a solution
    sol_resp = await client.post(
        "/api/v1/solutions",
        json={
            "name": "Poll Test",
            "description": "Test task polling",
            "model_id": str(uuid.uuid4()),
            "device_id": registered_device["device_id"],
            "conversion": {
                "quantization": "fp16",
                "target_framework": "onnx",
                "model_path": "/tmp/model.onnx",
                "compiler_flags": {},
                "custom_ops": [],
            },
            "runtime": {
                "batch_size": 1,
                "num_threads": 4,
                "power_mode": "balanced",
                "inputs": {"input": [1, 10]},
            },
            "tags": ["test"],
        },
    )
    assert sol_resp.status_code == 201
    sol_id = sol_resp.json()["id"]

    # Create a pending run
    run_resp = await client.post(
        f"/api/v1/solutions/{sol_id}/runs",
        json={
            "device_id": registered_device["device_id"],
            "trigger": "manual",
            "test_config": {
                "dataset": "test",
                "num_samples": 10,
                "warm_up_rounds": 2,
                "test_rounds": 10,
            },
        },
    )
    assert run_resp.status_code == 201
    run_id = run_resp.json()["id"]

    # Now poll for tasks
    resp = await client.get(
        "/api/v1/agent/tasks/next",
        params={"device_id": registered_device["device_id"]},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["run_id"] == run_id
    assert data["solution_id"] == sol_id
    assert "model_path" in data
    assert "precision" in data
    assert "inputs" in data
    assert "test_config" in data


@pytest.mark.asyncio
async def test_poll_task_skips_non_pending(client, registered_device):
    """Tasks that are not 'pending' should not be returned."""
    did = registered_device["device_id"]

    # Create solution
    sol_resp = await client.post(
        "/api/v1/solutions",
        json={
            "name": "Skip Test",
            "description": "",
            "model_id": str(uuid.uuid4()),
            "device_id": did,
            "conversion": {"quantization": "fp16", "target_framework": "onnx", "compiler_flags": {}, "custom_ops": []},
            "runtime": {"batch_size": 1, "num_threads": 4, "power_mode": "balanced"},
            "tags": [],
        },
    )
    sol_id = sol_resp.json()["id"]

    # Create a run
    run_resp = await client.post(
        f"/api/v1/solutions/{sol_id}/runs",
        json={
            "device_id": did,
            "test_config": {"dataset": "test"},
        },
    )
    run_id = run_resp.json()["id"]

    # Set status to running (not pending)
    await client.patch(f"/api/v1/runs/{run_id}/status?status=running")

    # Polling should return 404 (no pending tasks)
    resp = await client.get(
        "/api/v1/agent/tasks/next", params={"device_id": did}
    )
    assert resp.status_code == 404


# ─── Full Agent Workflow ────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_full_agent_workflow(client, registered_device):
    """Simulate the complete agent lifecycle: poll → execute → submit."""
    did = registered_device["device_id"]

    # 1. Create solution
    sol_resp = await client.post(
        "/api/v1/solutions",
        json={
            "name": "Workflow Test",
            "model_id": str(uuid.uuid4()),
            "device_id": did,
            "conversion": {
                "quantization": "fp16",
                "target_framework": "onnx",
                "model_path": "/tmp/model.onnx",
                "compiler_flags": {},
                "custom_ops": [],
            },
            "runtime": {
                "batch_size": 1,
                "num_threads": 4,
                "power_mode": "balanced",
                "inputs": {"input": [1, 10]},
            },
            "tags": [],
        },
    )
    sol_id = sol_resp.json()["id"]

    # 2. Create run
    run_resp = await client.post(
        f"/api/v1/solutions/{sol_id}/runs",
        json={
            "device_id": did,
            "test_config": {"dataset": "test", "warm_up_rounds": 10, "test_rounds": 100},
        },
    )
    run_id = run_resp.json()["id"]

    # 3. Agent polls task
    poll = await client.get("/api/v1/agent/tasks/next", params={"device_id": did})
    assert poll.status_code == 200
    assert poll.json()["run_id"] == run_id

    # 4. Agent updates status to running
    await client.patch(f"/api/v1/runs/{run_id}/status?status=running")

    # 5. Agent submits result
    result = await client.post(
        f"/api/v1/runs/{run_id}/result",
        json={
            "latency_ms": {"p50": 3.2, "p95": 5.1, "p99": 7.8},
            "throughput": 312.5,
            "memory_peak_mb": 256.0,
            "power_mw": None,
            "ttft_ms": None,
            "tps": None,
            "accuracy": {},
        },
    )
    assert result.status_code == 201

    # 6. Verify final state
    run_info = await client.get(f"/api/v1/runs/{run_id}")
    assert run_info.json()["status"] == "completed"
    assert run_info.json()["result"]["latency_p50_ms"] == 3.2
