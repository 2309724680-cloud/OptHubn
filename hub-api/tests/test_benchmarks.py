"""Tests for Benchmark Runs API endpoints."""

import uuid
import pytest


@pytest.fixture
def sample_solution_data():
    return {
        "name": "Bench Test Solution",
        "description": "Solution for benchmark testing",
        "model_id": str(uuid.uuid4()),
        "device_id": str(uuid.uuid4()),
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
        "tags": ["benchmark"],
    }


@pytest.fixture
def run_create_data():
    return {
        "device_id": str(uuid.uuid4()),
        "trigger": "manual",
        "test_config": {
            "dataset": "imagenet-val",
            "num_samples": 100,
            "warm_up_rounds": 10,
            "test_rounds": 100,
        },
        "environment": {
            "os_version": "Windows 11",
            "driver_version": "1.2.3",
            "temperature_celsius": 45.0,
            "battery_level": 80,
        },
    }


@pytest.fixture
def result_submit_data():
    return {
        "latency_ms": {"p50": 5.0, "p95": 10.0, "p99": 12.0},
        "throughput": 200.0,
        "memory_peak_mb": 512.0,
        "power_mw": 15000.0,
        "ttft_ms": 1.5,
        "tps": 50.0,
        "accuracy": {"top1": 0.76, "top5": 0.92},
        "cv": 2.5,
        "stability": "normal",
        "raw_sample_data": None,
        "is_aggregated": True,
    }


@pytest.fixture
async def created_solution(client, sample_solution_data):
    """Create a solution and return it."""
    resp = await client.post("/api/v1/solutions", json=sample_solution_data)
    assert resp.status_code == 201
    return resp.json()


@pytest.fixture
async def created_run(client, created_solution, run_create_data):
    """Create a run and return it."""
    sol_id = created_solution["id"]
    resp = await client.post(
        f"/api/v1/solutions/{sol_id}/runs", json=run_create_data
    )
    assert resp.status_code == 201
    return resp.json()


# ─── Create Run ─────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_create_run(client, created_solution, run_create_data):
    sol_id = created_solution["id"]
    resp = await client.post(
        f"/api/v1/solutions/{sol_id}/runs", json=run_create_data
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["solution_id"] == sol_id
    assert data["device_id"] == run_create_data["device_id"]
    assert data["status"] == "pending"
    assert data["trigger"] == "manual"
    assert data["test_config"]["dataset"] == "imagenet-val"
    assert data["environment"]["os_version"] == "Windows 11"
    assert data["result"] is None
    assert "id" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_create_run_nonexistent_solution(client, run_create_data):
    fake_id = str(uuid.uuid4())
    resp = await client.post(
        f"/api/v1/solutions/{fake_id}/runs", json=run_create_data
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_create_run_auto_trigger(client, created_solution, run_create_data):
    sol_id = created_solution["id"]
    data = {**run_create_data, "trigger": "auto"}
    resp = await client.post(f"/api/v1/solutions/{sol_id}/runs", json=data)
    assert resp.status_code == 201
    assert resp.json()["trigger"] == "auto"


# ─── List Runs ──────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_list_runs_empty(client, created_solution):
    sol_id = created_solution["id"]
    resp = await client.get(f"/api/v1/solutions/{sol_id}/runs")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) == 0


@pytest.mark.asyncio
async def test_list_runs_with_data(client, created_solution, run_create_data):
    sol_id = created_solution["id"]
    # Create two runs
    await client.post(f"/api/v1/solutions/{sol_id}/runs", json=run_create_data)
    await client.post(
        f"/api/v1/solutions/{sol_id}/runs",
        json={**run_create_data, "device_id": str(uuid.uuid4())},
    )

    resp = await client.get(f"/api/v1/solutions/{sol_id}/runs")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    # Most recent first
    assert data[0]["created_at"] >= data[1]["created_at"]


# ─── Get Run ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_run(client, created_run):
    run_id = created_run["id"]
    resp = await client.get(f"/api/v1/runs/{run_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == run_id
    assert data["status"] == "pending"


@pytest.mark.asyncio
async def test_get_nonexistent_run(client):
    fake_id = str(uuid.uuid4())
    resp = await client.get(f"/api/v1/runs/{fake_id}")
    assert resp.status_code == 404


# ─── Submit Result ──────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_submit_result(client, created_run, result_submit_data):
    run_id = created_run["id"]
    resp = await client.post(
        f"/api/v1/runs/{run_id}/result", json=result_submit_data
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["latency_p50_ms"] == 5.0
    assert data["latency_p95_ms"] == 10.0
    assert data["latency_p99_ms"] == 12.0
    assert data["throughput"] == 200.0
    assert data["memory_peak_mb"] == 512.0
    assert data["power_mw"] == 15000.0
    assert data["ttft_ms"] == 1.5
    assert data["tps"] == 50.0
    assert data["accuracy"] == {"top1": 0.76, "top5": 0.92}


@pytest.mark.asyncio
async def test_submit_result_updates_run_status(client, created_run, result_submit_data):
    run_id = created_run["id"]
    await client.post(f"/api/v1/runs/{run_id}/result", json=result_submit_data)

    # Check run status changed to completed
    resp = await client.get(f"/api/v1/runs/{run_id}")
    assert resp.status_code == 200
    assert resp.json()["status"] == "completed"
    assert resp.json()["finished_at"] is not None
    assert resp.json()["result"] is not None


@pytest.mark.asyncio
async def test_submit_result_nonexistent_run(client, result_submit_data):
    fake_id = str(uuid.uuid4())
    resp = await client.post(
        f"/api/v1/runs/{fake_id}/result", json=result_submit_data
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_submit_duplicate_result_fails(client, created_run, result_submit_data):
    run_id = created_run["id"]
    await client.post(f"/api/v1/runs/{run_id}/result", json=result_submit_data)

    # Second submission should fail
    resp = await client.post(
        f"/api/v1/runs/{run_id}/result", json=result_submit_data
    )
    assert resp.status_code == 409


@pytest.mark.asyncio
async def test_get_run_includes_result(client, created_run, result_submit_data):
    run_id = created_run["id"]
    await client.post(f"/api/v1/runs/{run_id}/result", json=result_submit_data)

    resp = await client.get(f"/api/v1/runs/{run_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["result"] is not None
    assert data["result"]["latency_p50_ms"] == 5.0


# ─── Update Run Status ─────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_update_status_to_running(client, created_run):
    run_id = created_run["id"]
    resp = await client.patch(
        f"/api/v1/runs/{run_id}/status?status=running"
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "running"
    assert data["started_at"] is not None


@pytest.mark.asyncio
async def test_update_status_to_failed(client, created_run):
    run_id = created_run["id"]
    resp = await client.patch(
        f"/api/v1/runs/{run_id}/status?status=failed&error_message=Out of memory"
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "failed"
    assert data["error_message"] == "Out of memory"
    assert data["finished_at"] is not None


@pytest.mark.asyncio
async def test_update_status_invalid(client, created_run):
    run_id = created_run["id"]
    resp = await client.patch(
        f"/api/v1/runs/{run_id}/status?status=invalid_status"
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_update_status_nonexistent_run(client):
    fake_id = str(uuid.uuid4())
    resp = await client.patch(
        f"/api/v1/runs/{fake_id}/status?status=running"
    )
    assert resp.status_code == 404


# ─── Run with Minimal Config ────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_create_run_minimal_config(client, created_solution):
    """Test creating a run with minimal required fields."""
    sol_id = created_solution["id"]
    minimal = {
        "device_id": str(uuid.uuid4()),
        "test_config": {
            "dataset": "test",
        },
    }
    resp = await client.post(f"/api/v1/solutions/{sol_id}/runs", json=minimal)
    assert resp.status_code == 201
    data = resp.json()
    assert data["status"] == "pending"
    # Defaults should be applied
    assert data["trigger"] == "manual"
    assert data["environment"] == {
        "os_version": "",
        "driver_version": "",
        "temperature_celsius": None,
        "battery_level": None,
    }
