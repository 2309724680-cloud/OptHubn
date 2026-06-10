"""Tests for Comparisons API endpoints: CRUD, sharing, and data computation."""

import uuid
import pytest


@pytest.fixture
def solution_a_data():
    return {
        "name": "Solution A",
        "model_id": str(uuid.uuid4()),
        "device_id": str(uuid.uuid4()),
        "conversion": {"quantization": "fp16", "target_framework": "onnx", "compiler_flags": {}, "custom_ops": []},
        "runtime": {"batch_size": 1, "num_threads": 4, "power_mode": "balanced"},
        "tags": [],
    }


@pytest.fixture
def solution_b_data():
    return {
        "name": "Solution B",
        "model_id": str(uuid.uuid4()),
        "device_id": str(uuid.uuid4()),
        "conversion": {"quantization": "int8", "target_framework": "onnx", "compiler_flags": {}, "custom_ops": []},
        "runtime": {"batch_size": 1, "num_threads": 4, "power_mode": "performance"},
        "tags": [],
    }


@pytest.fixture
async def two_solutions_with_runs(client, solution_a_data, solution_b_data):
    """Create two solutions, each with a completed run. Returns (sol_a, run_a, sol_b, run_b)."""
    # Solution A
    sa = await client.post("/api/v1/solutions", json=solution_a_data)
    sol_a = sa.json()
    ra = await client.post(
        f"/api/v1/solutions/{sol_a['id']}/runs",
        json={
            "device_id": sol_a["device_id"],
            "test_config": {"dataset": "test"},
        },
    )
    run_a = ra.json()
    # Submit result for A
    await client.post(
        f"/api/v1/runs/{run_a['id']}/result",
        json={
            "latency_ms": {"p50": 10.0, "p95": 15.0, "p99": 18.0},
            "throughput": 100.0,
            "memory_peak_mb": 512.0,
            "power_mw": 15000.0,
            "ttft_ms": 2.0,
            "tps": 30.0,
            "accuracy": {},
        },
    )

    # Solution B
    sb = await client.post("/api/v1/solutions", json=solution_b_data)
    sol_b = sb.json()
    rb = await client.post(
        f"/api/v1/solutions/{sol_b['id']}/runs",
        json={
            "device_id": sol_b["device_id"],
            "test_config": {"dataset": "test"},
        },
    )
    run_b = rb.json()
    # Submit result for B (better latency, higher throughput)
    await client.post(
        f"/api/v1/runs/{run_b['id']}/result",
        json={
            "latency_ms": {"p50": 5.0, "p95": 8.0, "p99": 10.0},
            "throughput": 200.0,
            "memory_peak_mb": 256.0,
            "power_mw": 12000.0,
            "ttft_ms": 1.0,
            "tps": 60.0,
            "accuracy": {},
        },
    )

    return (sol_a, run_a, sol_b, run_b)


@pytest.fixture
def comparison_create_data(two_solutions_with_runs):
    sol_a, run_a, sol_b, run_b = two_solutions_with_runs
    return {
        "name": "Test Comparison",
        "description": "Comparing Solution A vs B",
        "solution_ids": [sol_a["id"], sol_b["id"]],
        "baseline_id": sol_a["id"],
        "metrics_selected": ["latency_p50_ms", "throughput", "memory_peak_mb"],
        "run_snapshot": {
            sol_a["id"]: run_a["id"],
            sol_b["id"]: run_b["id"],
        },
        "notes": "Initial comparison",
    }


@pytest.fixture
async def created_comparison(client, comparison_create_data):
    resp = await client.post("/api/v1/comparisons", json=comparison_create_data)
    assert resp.status_code == 201
    return resp.json()


# ─── Create Comparison ──────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_create_comparison(client, comparison_create_data):
    resp = await client.post("/api/v1/comparisons", json=comparison_create_data)
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Test Comparison"
    assert len(data["solution_ids"]) == 2
    assert data["baseline_id"] == comparison_create_data["baseline_id"]
    assert data["shared"] is False
    assert data["share_token"] is None
    assert "id" in data


@pytest.mark.asyncio
async def test_create_comparison_baseline_not_in_solutions(client, comparison_create_data):
    """baseline_id must be in solution_ids."""
    bad_data = {**comparison_create_data, "baseline_id": str(uuid.uuid4())}
    resp = await client.post("/api/v1/comparisons", json=bad_data)
    assert resp.status_code == 422  # pydantic validation error


@pytest.mark.asyncio
async def test_create_comparison_requires_at_least_two_solutions(client, comparison_create_data):
    bad_data = {
        **comparison_create_data,
        "solution_ids": [comparison_create_data["baseline_id"]],
    }
    resp = await client.post("/api/v1/comparisons", json=bad_data)
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_create_comparison_too_many_solutions(client, comparison_create_data):
    bad_data = {
        **comparison_create_data,
        "solution_ids": [str(uuid.uuid4()) for _ in range(9)],
    }
    resp = await client.post("/api/v1/comparisons", json=bad_data)
    assert resp.status_code == 422


# ─── List Comparisons ───────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_list_comparisons_empty(client):
    resp = await client.get("/api/v1/comparisons")
    assert resp.status_code == 200
    assert resp.json() == []


@pytest.mark.asyncio
async def test_list_comparisons_with_data(client, created_comparison):
    resp = await client.get("/api/v1/comparisons")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Test Comparison"


# ─── Get Comparison ─────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_comparison(client, created_comparison):
    cmp_id = created_comparison["id"]
    resp = await client.get(f"/api/v1/comparisons/{cmp_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == cmp_id


@pytest.mark.asyncio
async def test_get_nonexistent_comparison(client):
    fake_id = str(uuid.uuid4())
    resp = await client.get(f"/api/v1/comparisons/{fake_id}")
    assert resp.status_code == 404


# ─── Update Comparison ──────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_update_comparison(client, created_comparison):
    cmp_id = created_comparison["id"]
    resp = await client.patch(
        f"/api/v1/comparisons/{cmp_id}",
        json={"name": "Updated Comparison", "notes": "Updated notes"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "Updated Comparison"
    assert data["notes"] == "Updated notes"


# ─── Delete Comparison ──────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_delete_comparison(client, created_comparison):
    cmp_id = created_comparison["id"]
    resp = await client.delete(f"/api/v1/comparisons/{cmp_id}")
    assert resp.status_code == 204


@pytest.mark.asyncio
async def test_delete_nonexistent_comparison(client):
    fake_id = str(uuid.uuid4())
    resp = await client.delete(f"/api/v1/comparisons/{fake_id}")
    assert resp.status_code == 404


# ─── Comparison Data ────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_get_comparison_data(client, created_comparison):
    cmp_id = created_comparison["id"]
    resp = await client.get(f"/api/v1/comparisons/{cmp_id}/data")
    assert resp.status_code == 200
    data = resp.json()
    assert data["comparison_id"] == cmp_id
    assert len(data["solutions"]) == 2

    # Each solution should have metrics
    for sm in data["solutions"]:
        assert "solution_id" in sm
        assert "solution_name" in sm
        assert "run_id" in sm
        assert "is_baseline" in sm
        assert "latency_p50_ms" in sm["metrics"]
        assert "throughput" in sm["metrics"]
        assert "memory_peak_mb" in sm["metrics"]

        # Non-baseline solutions should have delta/delta_pct/is_better
        if not sm["is_baseline"]:
            for metric in sm["metrics"].values():
                assert "delta" in metric
                assert "delta_pct" in metric
                assert "is_better" in metric

    # Radar data should exist
    assert "radar" in data
    assert all(k in data["radar"] for k in ["latency_p50_ms", "throughput", "memory_peak_mb"])

    # Rankings should exist
    assert "rankings" in data
    assert all(k in data["rankings"] for k in ["latency_p50_ms", "throughput", "memory_peak_mb"])


# ─── Sharing ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_share_comparison(client, created_comparison):
    cmp_id = created_comparison["id"]
    resp = await client.post(
        f"/api/v1/comparisons/{cmp_id}/share",
        json={"expires_in_days": 7},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["shared"] is True
    assert data["share_token"] is not None
    assert data["share_expires_at"] is not None


@pytest.mark.asyncio
async def test_share_no_expiry(client, created_comparison):
    cmp_id = created_comparison["id"]
    resp = await client.post(
        f"/api/v1/comparisons/{cmp_id}/share",
        json={},
    )
    assert resp.status_code == 200
    assert resp.json()["share_expires_at"] is None


@pytest.mark.asyncio
async def test_unshare_comparison(client, created_comparison):
    cmp_id = created_comparison["id"]
    # Share first
    await client.post(f"/api/v1/comparisons/{cmp_id}/share", json={"expires_in_days": 7})

    # Unshare
    resp = await client.delete(f"/api/v1/comparisons/{cmp_id}/share")
    assert resp.status_code == 200
    data = resp.json()
    assert data["shared"] is False
    assert data["share_token"] is None


@pytest.mark.asyncio
async def test_public_share_access(client, created_comparison):
    cmp_id = created_comparison["id"]
    share = await client.post(
        f"/api/v1/comparisons/{cmp_id}/share", json={"expires_in_days": 7}
    )
    token = share.json()["share_token"]

    resp = await client.get(f"/api/v1/share/{token}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["comparison_id"] == cmp_id


@pytest.mark.asyncio
async def test_public_share_invalid_token(client):
    resp = await client.get("/api/v1/share/nonexistent-token-123")
    assert resp.status_code == 404
