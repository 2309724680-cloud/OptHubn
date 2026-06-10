"""Tests for Ingest API endpoints: external result ingestion."""

import uuid
import pytest


@pytest.fixture
def ingest_solution_data():
    return {
        "name": "Ingest Test Solution",
        "model_id": str(uuid.uuid4()),
        "device_id": str(uuid.uuid4()),
        "conversion": {"quantization": "fp16", "target_framework": "onnx", "model_path": "/tmp/model.onnx", "compiler_flags": {}, "custom_ops": []},
        "runtime": {"batch_size": 1, "num_threads": 4, "power_mode": "balanced"},
        "tags": [],
    }


@pytest.fixture
async def created_solution_for_ingest(client, ingest_solution_data):
    resp = await client.post("/api/v1/solutions", json=ingest_solution_data)
    assert resp.status_code == 201
    return resp.json()


@pytest.fixture
def valid_ingest_payload(created_solution_for_ingest):
    sol = created_solution_for_ingest
    return {
        "api_key": "npukey_dev_local",
        "solution_id": sol["id"],
        "device_id": str(uuid.uuid4()),
        "test_config": {
            "dataset": "imagenet",
            "num_samples": 50,
            "warm_up_rounds": 5,
            "test_rounds": 50,
        },
        "environment": {
            "os_version": "Ubuntu 22.04",
            "driver_version": "5.2.1",
        },
        "result": {
            "latency_ms": {"p50": 8.0, "p95": 12.0, "p99": 15.0},
            "throughput": 125.0,
            "memory_peak_mb": 1024.0,
            "power_mw": 25000.0,
            "ttft_ms": None,
            "tps": None,
            "accuracy": {"top1": 0.80},
            "cv": 3.2,
            "stability": "normal",
            "raw_sample_data": None,
            "is_aggregated": True,
        },
    }


# ─── Successful Ingest ──────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_ingest_result_success(client, valid_ingest_payload):
    resp = await client.post("/api/v1/ingest/result", json=valid_ingest_payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["solution_id"] == valid_ingest_payload["solution_id"]
    assert data["status"] == "completed"
    assert data["trigger"] == "auto"
    assert data["result"] is not None
    assert data["result"]["latency_p50_ms"] == 8.0
    assert data["result"]["throughput"] == 125.0
    assert data["result"]["memory_peak_mb"] == 1024.0
    assert data["result"]["accuracy"] == {"top1": 0.80}


# ─── Authentication ─────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_ingest_result_invalid_api_key(client, valid_ingest_payload):
    bad_payload = {**valid_ingest_payload, "api_key": "wrong-key"}
    resp = await client.post("/api/v1/ingest/result", json=bad_payload)
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_ingest_result_missing_api_key(client, created_solution_for_ingest):
    sol = created_solution_for_ingest
    resp = await client.post(
        "/api/v1/ingest/result",
        json={
            "api_key": "",
            "solution_id": sol["id"],
            "device_id": str(uuid.uuid4()),
            "test_config": {"dataset": "test"},
            "environment": {},
            "result": {
                "latency_ms": {"p50": 1.0, "p95": 2.0, "p99": 3.0},
                "accuracy": {},
            },
        },
    )
    assert resp.status_code == 401


# ─── Nonexistent Solution ───────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_ingest_result_nonexistent_solution(client):
    resp = await client.post(
        "/api/v1/ingest/result",
        json={
            "api_key": "npukey_dev_local",
            "solution_id": str(uuid.uuid4()),
            "device_id": str(uuid.uuid4()),
            "test_config": {"dataset": "test"},
            "environment": {},
            "result": {
                "latency_ms": {"p50": 1.0, "p95": 2.0, "p99": 3.0},
                "accuracy": {},
            },
        },
    )
    assert resp.status_code == 404


# ─── Minimal Payload ────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_ingest_result_minimal(client, created_solution_for_ingest):
    sol = created_solution_for_ingest
    resp = await client.post(
        "/api/v1/ingest/result",
        json={
            "api_key": "npukey_dev_local",
            "solution_id": sol["id"],
            "device_id": str(uuid.uuid4()),
            "test_config": {"dataset": "minimal"},
            "environment": {},
            "result": {
                "latency_ms": {"p50": 3.0, "p95": 4.0, "p99": 5.0},
                "accuracy": {},
            },
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["status"] == "completed"


# ─── Verify Run Created ─────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_ingest_creates_run_and_result(client, created_solution_for_ingest):
    sol = created_solution_for_ingest
    device_id = str(uuid.uuid4())

    # Ingest a result
    resp = await client.post(
        "/api/v1/ingest/result",
        json={
            "api_key": "npukey_dev_local",
            "solution_id": sol["id"],
            "device_id": device_id,
            "test_config": {"dataset": "verify"},
            "environment": {"os_version": "TestOS"},
            "result": {
                "latency_ms": {"p50": 4.0, "p95": 6.0, "p99": 8.0},
                "throughput": 250.0,
                "accuracy": {},
            },
        },
    )
    assert resp.status_code == 201
    run_id = resp.json()["id"]

    # Verify the run exists and is linked to the solution
    runs_resp = await client.get(f"/api/v1/solutions/{sol['id']}/runs")
    assert runs_resp.status_code == 200
    runs = runs_resp.json()
    assert len(runs) == 1
    assert runs[0]["id"] == run_id
    assert runs[0]["device_id"] == device_id

    # Verify the result is accessible via run endpoint
    run_detail = await client.get(f"/api/v1/runs/{run_id}")
    assert run_detail.json()["result"]["throughput"] == 250.0
