# 测试指南

## 后��测试 (FastAPI + pytest)

### 环境��备

1. 安装���试依赖:
```bash
cd hub-api
pip install -r requirements.txt
```

2. 配��测试���据库:
创建 `.env.test` 文��:
```bash
TEST_DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/hub_test
```

3. 确保 PostgreSQL 运��并创���测试数据库:
```bash
psql -U postgres -c "CREATE DATABASE hub_test;"
```

### ��行测���

```bash
# 运��所有���试
pytest

# 运��特定���试文件
pytest tests/test_solutions.py

# 运行��定测���函数
pytest tests/test_solutions.py::test_create_solution

# 显示详��输出
pytest -v

# 生成覆��率报���
pytest --cov=app --cov-report=html
# 查看��告: open htmlcov/index.html
```

### 测��结构

```
hub-api/
├─��� tests/
│   ���── __init__.py
��   ├─��� conftest.py          # pytest fixtures (client, test_db)
│   ├── test_health.py       # 健康��查测���
│   ├── test_solutions.py    # Solutions API 测试
│   └��─ test_benchmarks.py   # Benchmarks API 测试 (待添���)
├��─ pytest.ini               # pytest 配置
└── .env.test               # 测试环境��量
```

### 编写新��试

使用 `client` fixture 进行 API 测试:

```python
@pytest.mark.asyncio
async def test_my_endpoint(client):
    response = await client.get("/api/v1/my-endpoint")
    assert response.status_code == 200
    assert response.json()["key"] == "value"
```

## 前端��试 (Next.js + Vitest)

### 环���准备

1. 安���测试依赖:
```bash
cd hub-web
npm install
```

### 运行���试

```bash
# ���行所��测试
npm test

# 监听��式 (自动���新运��)
npm test -- --watch

# UI 模式 (可视化界��)
npm run test:ui

# 生成��盖率报��
npm run test:coverage
```

### 测��结构

```
hub-web/
├── components/
│   ├── TopBar.tsx
│   ├── TopBar.test.tsx              # 组件���试
│   └── TopBar.authenticated.test.tsx
├���─ lib/
│   └─��� utils.test.ts                # ���具函数测试
├── vitest.config.ts                 # Vitest 配��
└��─ vitest.setup.ts                  # 测试���境设置
```

### ��写新���试

组��测试���例:

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

## CI/CD 集成

在 GitHub Actions 中��行测试:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: cd hub-api && pip install -r requirements.txt
      - run: cd hub-api && pytest
        env:
          TEST_DATABASE_URL: postgresql+asyncpg://postgres:postgres@localhost:5432/hub_test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd hub-web && npm ci
      - run: cd hub-web && npm test
```

## 最���实践

### ��端
- 每个 API endpoint 至少��个测���
- 测试���常流��和错���情况
- 使用 fixtures 减��重复代��
- 每个测试��立,不依赖其他测��

### 前���
- 测��用户交��,不是实��细节
- Mock ��部依赖 (API, navigation)
- 使用 `screen.getByRole` 优��于 `getByTestId`
- 测试��访问��� (a11y)

## ��一步

- [ ] 添加 benchmarks API 测试
- [ ] 添加 comparisons API ���试
- [ ] 添加��多前���页面测试
- [ ] 集成 E2E 测�� (Playwright)
- [ ] 设��� CI/CD ��动化测��
