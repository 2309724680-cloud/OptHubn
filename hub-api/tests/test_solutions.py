import uuid
import pytest


@pytest.fixture
def sample_solution_data():
    return {
        "name": "Test Solution",
        "description": "A test inference solution",
        "model_id": str(uuid.uuid4()),
        "device_id": str(uuid.uuid4()),
        "precision": "fp16",
        "conversion": {
            "quantization": "fp16",
            "target_framework": "onnx",
            "compiler_flags": {},
            "custom_ops": []
        },
        "runtime": {
            "batch_size": 1,
            "num_threads": 4,
            "power_mode": "balanced"
        },
        "input_config": {},
        "tags": ["test", "demo"]
    }


@pytest.mark.asyncio
async def test_create_solution(client, sample_solution_data):
    response = await client.post("/api/v1/solutions", json=sample_solution_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == sample_solution_data["name"]
    assert data["status"] == "draft"
    assert "id" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_get_solution(client, sample_solution_data):
    create_response = await client.post("/api/v1/solutions", json=sample_solution_data)
    solution_id = create_response.json()["id"]

    response = await client.get(f"/api/v1/solutions/{solution_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == solution_id
    assert data["name"] == sample_solution_data["name"]


@pytest.mark.asyncio
async def test_get_nonexistent_solution(client):
    fake_id = str(uuid.uuid4())
    response = await client.get(f"/api/v1/solutions/{fake_id}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_solutions_empty(client):
    response = await client.get("/api/v1/solutions")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["items"] == []


@pytest.mark.asyncio
async def test_list_solutions_with_data(client, sample_solution_data):
    await client.post("/api/v1/solutions", json=sample_solution_data)
    await client.post("/api/v1/solutions", json={**sample_solution_data, "name": "Solution 2"})

    response = await client.get("/api/v1/solutions")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2


@pytest.mark.asyncio
async def test_list_solutions_pagination(client, sample_solution_data):
    for i in range(5):
        await client.post("/api/v1/solutions", json={**sample_solution_data, "name": f"Solution {i}"})

    response = await client.get("/api/v1/solutions?page=1&page_size=2")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 5
    assert len(data["items"]) == 2
    assert data["page"] == 1
    assert data["total_pages"] == 3


@pytest.mark.asyncio
async def test_list_solutions_filter_by_status(client, sample_solution_data):
    create_response = await client.post("/api/v1/solutions", json=sample_solution_data)
    solution_id = create_response.json()["id"]
    await client.post(f"/api/v1/solutions/{solution_id}/publish")

    response = await client.get("/api/v1/solutions?status=published")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["status"] == "published"


@pytest.mark.asyncio
async def test_list_solutions_search(client, sample_solution_data):
    await client.post("/api/v1/solutions", json={**sample_solution_data, "name": "Unique Name"})
    await client.post("/api/v1/solutions", json={**sample_solution_data, "name": "Other Name"})

    response = await client.get("/api/v1/solutions?search=Unique")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert "Unique" in data["items"][0]["name"]


@pytest.mark.asyncio
async def test_update_solution(client, sample_solution_data):
    create_response = await client.post("/api/v1/solutions", json=sample_solution_data)
    solution_id = create_response.json()["id"]

    update_data = {"name": "Updated Name", "description": "Updated description"}
    response = await client.patch(f"/api/v1/solutions/{solution_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["description"] == "Updated description"


@pytest.mark.asyncio
async def test_update_archived_solution_fails(client, sample_solution_data):
    create_response = await client.post("/api/v1/solutions", json=sample_solution_data)
    solution_id = create_response.json()["id"]

    await client.delete(f"/api/v1/solutions/{solution_id}")

    update_data = {"name": "Should Fail"}
    response = await client.patch(f"/api/v1/solutions/{solution_id}", json=update_data)
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_archive_solution(client, sample_solution_data):
    create_response = await client.post("/api/v1/solutions", json=sample_solution_data)
    solution_id = create_response.json()["id"]

    response = await client.delete(f"/api/v1/solutions/{solution_id}")
    assert response.status_code == 204

    get_response = await client.get(f"/api/v1/solutions/{solution_id}")
    assert get_response.json()["status"] == "archived"


@pytest.mark.asyncio
async def test_publish_solution(client, sample_solution_data):
    create_response = await client.post("/api/v1/solutions", json=sample_solution_data)
    solution_id = create_response.json()["id"]

    response = await client.post(f"/api/v1/solutions/{solution_id}/publish")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "published"


@pytest.mark.asyncio
async def test_publish_non_draft_solution_fails(client, sample_solution_data):
    create_response = await client.post("/api/v1/solutions", json=sample_solution_data)
    solution_id = create_response.json()["id"]

    await client.post(f"/api/v1/solutions/{solution_id}/publish")
    response = await client.post(f"/api/v1/solutions/{solution_id}/publish")
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_clone_solution(client, sample_solution_data):
    create_response = await client.post("/api/v1/solutions", json=sample_solution_data)
    solution_id = create_response.json()["id"]

    response = await client.post(f"/api/v1/solutions/{solution_id}/clone")
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Solution (副本)"
    assert data["id"] != solution_id
    assert data["status"] == "draft"
