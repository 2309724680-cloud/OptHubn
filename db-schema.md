# NPU Benchmark 平台 — 数据库设计文档（V2.0）

**文档编号**：DB-DESIGN-2026-V2.0 | **日期**：2026-06-08 | **数据库**：PostgreSQL 16 | **ORM**：SQLAlchemy 2.0 异步 | **迁移**：Alembic

---

## 目录

1. [设计原则与规范](#一设计原则与规范)
2. [枚举字典表](#二枚举字典表)
3. [全量表结构](#三全量表结构)
   - P0 核心业务表（18 张）
   - P1 审计日志表（2 张）
   - P2 扩展表（1 张）
4. [索引策略](#四索引策略完整-ddl)
5. [CHECK 约束清单](#五check-约束清单)
6. [外键与级联规则](#六外键与级联规则)
7. [数据生命周期与归档](#七数据生命周期与归档策略)
8. [安全与权限模型](#八安全与权限模型)
9. [变更记录](#九变更记录)

---

## 一、设计原则与规范

### 1.1 字段规范

| 规范项 | 说明 |
|---|---|
| 主键 | 全表统一 UUID，应用层 `uuid4()`，不自增 |
| 时间 | 统一 `TIMESTAMPTZ`，`created_at` 默认 `now()`，`updated_at` 由 ORM 自动维护 |
| 字符串 | ≤200 字符用 `VARCHAR(n)`，大段文本用 `TEXT` |
| 动态字段 | 配置/指标/快照用 `JSONB` |
| 数组 | 标签、枚举多项用 `TEXT[]`，建 GIN 索引 |
| 数值 | 性能指标统一 `NUMERIC(总精度, 小数位)`，严禁 `FLOAT/DOUBLE` |

### 1.2 删除规范

| 策略 | 说明 |
|---|---|
| 软删除 | 全业务表统一 `is_deleted BOOLEAN DEFAULT false` |
| 方案归档 | `inference_solutions.status = 'archived'` 为逻辑归档 |
| 级联删除 | 生产环境关闭 DB 层 CASCADE，应用层控制 |
| 物理删除 | 仅归档清理、测试数据清理场景使用，须二次确认 |

### 1.3 命名规范

| 对象 | 规则 | 示例 |
|---|---|---|
| 表名 | 全小写、下划线分隔、名词复数 | `benchmark_runs` |
| 字段名 | 全小写、下划线分隔、语义直白 | `created_by` |
| 普通索引 | `idx_{表缩写}_{字段}` | `idx_run_status` |
| 唯一索引 | `uk_{表缩写}_{字段}` | `uk_users_username` |
| GIN 索引 | `idx_{表缩写}_{字段}_gin` | `idx_sol_tags_gin` |

---

## 二、枚举字典表

### 2.1 sys_enums — 枚举字典（替代 DB 原生 ENUM）

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `enum_group` | `VARCHAR(64)` | NOT NULL | — | 枚举分组（如 `solution_status`） |
| `enum_code` | `VARCHAR(64)` | NOT NULL | — | 枚举编码（如 `draft`） |
| `label_zh` | `VARCHAR(128)` | NULL | — | 中文标签 |
| `sort_order` | `INTEGER` | NOT NULL | `0` | 排序 |
| `is_enabled` | `BOOLEAN` | NOT NULL | `true` | 是否启用 |
| `remark` | `TEXT` | NOT NULL | `''` | 备注 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`uk_sys_enums_group_code` UNIQUE ON `(enum_group, enum_code)`

**初始枚举值**：

| enum_group | enum_code | label_zh |
|---|---|---|
| `solution_status` | `draft` / `published` / `archived` | 草稿 / 已发布 / 已归档 |
| `run_status` | `pending` / `running` / `completed` / `failed` | 等待中 / 运行中 / 已完成 / 失败 |
| `run_trigger` | `manual` / `auto` / `scheduled` | 手动 / 自动 / 定时 |
| `artifact_type` | `model_binary` / `config` / `script` / `log` / `report` | 模型 / 配置 / 脚本 / 日志 / 报告 |
| `precision_type` | `fp16` / `fp32` / `int8` / `int4` | 半精度 / 全精度 / INT8 / INT4 |
| `model_task_type` | `classification` / `detection` / `llm` / `asr` / `segmentation` | 分类 / 检测 / 大模型 / 语音 / 分割 |
| `device_status` | `online` / `offline` / `unhealthy` / `maintenance` | 在线 / 离线 / 异常 / 维护中 |
| `data_stability` | `normal` / `unstable` | 稳定 / 不稳定 |
| `visibility` | `private` / `team` / `public` | 私有 / 团队可见 / 公开 |

### 2.2 sys_configs — 系统配置表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `config_key` | `VARCHAR(128)` | NOT NULL | — | **UNIQUE**，配置键 |
| `config_value` | `TEXT` | NOT NULL | — | 配置值 |
| `value_type` | `VARCHAR(32)` | NOT NULL | `'string'` | `string` / `int` / `bool` / `json` |
| `description` | `TEXT` | NOT NULL | `''` | 说明 |
| `updated_by` | `UUID` | NULL | — | 修改人 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`uk_sys_configs_key` UNIQUE ON `(config_key)`

---

## 三、全量表结构

### ▸ P0 — 核心业务表

### 3.1 users — 用户表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `username` | `VARCHAR(50)` | NOT NULL | — | **UNIQUE**，登录账号 |
| `password_hash` | `VARCHAR(128)` | NOT NULL | — | bcrypt/argon2，**不存明文** |
| `real_name` | `VARCHAR(50)` | NULL | — | 真实姓名 |
| `email` | `VARCHAR(100)` | NULL | — | 邮箱 |
| `phone` | `VARCHAR(20)` | NULL | — | 手机号 |
| `status` | `VARCHAR(16)` | NOT NULL | `'active'` | `active` / `disabled` / `locked` |
| `is_active` | `BOOLEAN` | NOT NULL | `true` | 账号启用标记 |
| `failed_login_count` | `INTEGER` | NOT NULL | `0` | 连续登录失败次数 |
| `locked_until` | `TIMESTAMPTZ` | NULL | — | 锁定截止时间 |
| `last_login_at` | `TIMESTAMPTZ` | NULL | — | 最后登录时间 |
| `last_login_ip` | `VARCHAR(64)` | NULL | — | 最后登录 IP |
| `pwd_expire_at` | `TIMESTAMPTZ` | NULL | — | 密码过期时间 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`uk_users_username`、`idx_users_status`、`idx_users_email`

### 3.2 roles — 角色表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `role_name` | `VARCHAR(50)` | NOT NULL | — | **UNIQUE**（`admin` / `tester` / `viewer`） |
| `role_desc` | `TEXT` | NOT NULL | `''` | 描述 |
| `is_system` | `BOOLEAN` | NOT NULL | `false` | 系统内置角色不可删除 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`uk_roles_name`

### 3.3 user_roles — 用户角色关联表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `user_id` | `UUID` | NOT NULL | — | **PK**，FK → `users.id` |
| `role_id` | `UUID` | NOT NULL | — | **PK**，FK → `roles.id` |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**主键**：`(user_id, role_id)` 联合主键

### 3.4 permissions — 权限表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `perm_code` | `VARCHAR(128)` | NOT NULL | — | **UNIQUE**（如 `solution:create`） |
| `perm_name` | `VARCHAR(128)` | NOT NULL | — | 权限名称 |
| `resource_type` | `VARCHAR(64)` | NOT NULL | — | `solution` / `run` / `comparison` / `device` |
| `action` | `VARCHAR(64)` | NOT NULL | — | `create` / `read` / `update` / `delete` / `share` |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`uk_perms_code`、`idx_perms_resource`

### 3.5 role_permissions — 角色权限关联表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `role_id` | `UUID` | NOT NULL | — | **PK**，FK → `roles.id` |
| `permission_id` | `UUID` | NOT NULL | — | **PK**，FK → `permissions.id` |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**主键**：`(role_id, permission_id)` 联合主键

### 3.6 projects — 项目表（多团队隔离）

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `name` | `VARCHAR(200)` | NOT NULL | — | 项目名称 |
| `description` | `TEXT` | NOT NULL | `''` | 描述 |
| `owner_id` | `UUID` | NOT NULL | — | FK → `users.id`，项目负责人 |
| `visibility` | `VARCHAR(16)` | NOT NULL | `'private'` | `private` / `team` / `public` |
| `is_archived` | `BOOLEAN` | NOT NULL | `false` | 归档标记 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`idx_projects_owner`、`idx_projects_visibility`

### 3.7 model_registry — 模型注册表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键（即 `model_id`） |
| `model_name` | `VARCHAR(200)` | NOT NULL | — | 模型名称 |
| `model_version` | `VARCHAR(20)` | NOT NULL | `'1.0.0'` | 版本号 |
| `task_type` | `VARCHAR(32)` | NOT NULL | — | `classification` / `detection` / `llm` / `asr` / `segmentation` |
| `framework` | `VARCHAR(64)` | NULL | — | 原始框架：`pytorch` / `tensorflow` / `onnx` |
| `tags` | `TEXT[]` | NOT NULL | `{}` | 标签数组 |
| `original_file_path` | `TEXT` | NOT NULL | — | 原始模型文件路径 |
| `input_spec` | `JSONB` | NOT NULL | `{}` | 输入规格：维度、dtype、动态轴 |
| `description` | `TEXT` | NOT NULL | `''` | 模型描述 |
| `is_deleted` | `BOOLEAN` | NOT NULL | `false` | 软删除 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`idx_model_name`、`idx_model_task_type`、`idx_model_tags_gin` (GIN ON `tags`)

### 3.8 device_registry — 设备注册表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键（即 `device_id`） |
| `chip_name` | `VARCHAR(100)` | NOT NULL | — | NPU 芯片型号 |
| `device_name` | `VARCHAR(200)` | NOT NULL | — | 设备别名 |
| `vendor` | `VARCHAR(100)` | NULL | — | 厂商 |
| `npu_tflops` | `NUMERIC(12,2)` | NULL | — | 标称算力 |
| `supported_precisions` | `TEXT[]` | NOT NULL | `{}` | 支持的精度列表 |
| `agent_endpoint` | `VARCHAR(255)` | NULL | — | Agent 访问地址 |
| `status` | `VARCHAR(16)` | NOT NULL | `'offline'` | `online` / `offline` / `unhealthy` / `maintenance` |
| `cluster_group` | `VARCHAR(100)` | NULL | — | 集群 / 机房分组 |
| `description` | `TEXT` | NOT NULL | `''` | 备注 |
| `is_deleted` | `BOOLEAN` | NOT NULL | `false` | 软删除 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`idx_device_name`、`idx_device_status`、`idx_device_cluster`、`idx_device_prec_gin` (GIN ON `supported_precisions`)

### 3.9 api_keys — 设备认证密钥表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `device_id` | `UUID` | NOT NULL | — | FK → `device_registry.id` |
| `key_hash` | `VARCHAR(128)` | NOT NULL | — | API Key 哈希值 |
| `remark` | `TEXT` | NOT NULL | `''` | 备注 |
| `is_revoked` | `BOOLEAN` | NOT NULL | `false` | 是否吊销 |
| `expire_at` | `TIMESTAMPTZ` | NULL | — | 过期时间 |
| `last_used_at` | `TIMESTAMPTZ` | NULL | — | 最后使用时间 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`idx_apikey_device`、`idx_apikey_revoked`、`idx_apikey_hash` ON `(key_hash)`

### 3.10 inference_solutions — 推理方案表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `project_id` | `UUID` | NULL | — | FK → `projects.id` |
| `name` | `VARCHAR(200)` | NOT NULL | — | 方案名称 |
| `description` | `TEXT` | NOT NULL | `''` | 描述 |
| `status` | `VARCHAR(16)` | NOT NULL | `'draft'` | `draft` / `published` / `archived` |
| `version` | `VARCHAR(20)` | NOT NULL | `'1.0.0'` | 版本号 |
| `model_id` | `UUID` | NOT NULL | — | FK → `model_registry.id` |
| `device_id` | `UUID` | NOT NULL | — | FK → `device_registry.id` |
| `precision` | `VARCHAR(8)` | NOT NULL | `'fp16'` | `fp16` / `fp32` / `int8` / `int4` |
| `visibility` | `VARCHAR(16)` | NOT NULL | `'private'` | `private` / `team` / `public` |
| `created_by` | `UUID` | NOT NULL | — | FK → `users.id` |
| `conversion` | `JSONB` | NOT NULL | `{}` | 模型转换、编译、量化参数 |
| `runtime` | `JSONB` | NOT NULL | `{}` | 运行时参数（batch_size, threads, power_mode） |
| `input_config` | `JSONB` | NOT NULL | `{}` | 输入规格：分辨率、序列长度、预处理 |
| `tags` | `TEXT[]` | NOT NULL | `{}` | 标签数组 |
| `archive_reason` | `TEXT` | NULL | — | 归档原因 |
| `ref_count` | `INTEGER` | NOT NULL | `0` | 被 comparison 引用次数 |
| `is_deleted` | `BOOLEAN` | NOT NULL | `false` | 软删除 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`idx_sol_model`、`idx_sol_device`、`idx_sol_status`、`idx_sol_created_by`、`idx_sol_project`、`idx_sol_visibility`、`idx_sol_created_at`、`idx_sol_tags_gin` (GIN ON `tags`)、`idx_sol_conversion_gin` (GIN ON `conversion`)、`idx_sol_runtime_gin` (GIN ON `runtime`)

### 3.11 artifacts — 方案产物表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `solution_id` | `UUID` | NOT NULL | — | FK → `inference_solutions.id` |
| `run_id` | `UUID` | NULL | — | FK → `benchmark_runs.id`（哪个 run 生成的） |
| `type` | `VARCHAR(32)` | NOT NULL | — | `model_binary` / `config` / `script` / `log` / `report` |
| `filename` | `VARCHAR(500)` | NOT NULL | — | 文件名 |
| `storage_path` | `TEXT` | NOT NULL | — | 存储路径 |
| `size_bytes` | `INTEGER` | NOT NULL | `0` | 文件大小（**NOT NULL**） |
| `checksum` | `VARCHAR(64)` | NULL | — | SHA256 |
| `checksum_verified` | `BOOLEAN` | NOT NULL | `false` | 校验和是否已验证 |
| `status` | `VARCHAR(16)` | NOT NULL | `'normal'` | `normal` / `corrupted` / `uploading` / `expired` |
| `download_count` | `INTEGER` | NOT NULL | `0` | 下载次数 |
| `expire_at` | `TIMESTAMPTZ` | NULL | — | 过期时间 |
| `is_deleted` | `BOOLEAN` | NOT NULL | `false` | 软删除 |
| `uploaded_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`idx_art_solution`、`idx_art_type`、`idx_art_run`、`idx_art_status`

### 3.12 benchmark_runs — 测试任务表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `solution_id` | `UUID` | NOT NULL | — | FK → `inference_solutions.id` |
| `device_id` | `UUID` | NOT NULL | — | 实际执行设备 |
| `project_id` | `UUID` | NULL | — | FK → `projects.id` |
| `status` | `VARCHAR(16)` | NOT NULL | `'pending'` | `pending` / `running` / `completed` / `failed` |
| `trigger` | `VARCHAR(16)` | NOT NULL | `'manual'` | `manual` / `auto` / `scheduled` |
| `priority` | `INTEGER` | NOT NULL | `0` | 优先级（越大越高） |
| `test_config` | `JSONB` | NOT NULL | `{}` | 测试配置：并发、采样数、重试次数 |
| `environment` | `JSONB` | NOT NULL | `{}` | 环境快照：SDK 版本、驱动版本、OS 版本 |
| `timeout_minutes` | `INTEGER` | NOT NULL | `30` | 超时时间 |
| `retry_count` | `INTEGER` | NOT NULL | `0` | 当前重试次数 |
| `max_retries` | `INTEGER` | NOT NULL | `3` | 最大重试次数 |
| `cluster_node_id` | `VARCHAR(128)` | NULL | — | 分布式执行节点 ID |
| `error_message` | `TEXT` | NULL | — | 失败原因 |
| `started_at` | `TIMESTAMPTZ` | NULL | — | |
| `finished_at` | `TIMESTAMPTZ` | NULL | — | |
| `created_by` | `UUID` | NULL | — | FK → `users.id`（auto 触发时可空） |
| `is_deleted` | `BOOLEAN` | NOT NULL | `false` | 软删除 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`idx_run_solution`、`idx_run_device`、`idx_run_status`、`idx_run_created_at`、`idx_run_project`、`idx_run_priority`、`idx_run_started_at`

> **分区建议**：按月范围分区 ON `created_at`（数据量 > 500 万后启用）

### 3.13 benchmark_results — 测试结果表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `run_id` | `UUID` | NOT NULL | — | FK → `benchmark_runs.id`，**UNIQUE** |
| `task_type` | `VARCHAR(32)` | NULL | — | 任务类型标记：`cv` / `llm`（区分指标适用场景） |
| `latency_p50_ms` | `NUMERIC(10,3)` | NULL | — | P50 延迟（毫秒） |
| `latency_p95_ms` | `NUMERIC(10,3)` | NULL | — | P95 延迟（毫秒） |
| `latency_p99_ms` | `NUMERIC(10,3)` | NULL | — | P99 延迟（毫秒） |
| `throughput` | `NUMERIC(12,3)` | NULL | — | QPS |
| `memory_peak_mb` | `NUMERIC(10,2)` | NULL | — | 内存峰值（MB） |
| `power_mw` | `NUMERIC(10,2)` | NULL | — | 功耗（毫瓦） |
| `ttft_ms` | `NUMERIC(10,3)` | NULL | — | LLM 首 token 延迟 |
| `tps` | `NUMERIC(10,3)` | NULL | — | LLM token 吞吐 |
| `cv` | `NUMERIC(8,4)` | NULL | — | 变异系数，> 0.05 标记为 unstable |
| `stability` | `VARCHAR(16)` | NOT NULL | `'normal'` | `normal` / `unstable` |
| `sample_count` | `INTEGER` | NULL | — | 有效采样次数 |
| `test_duration_s` | `NUMERIC(10,2)` | NULL | — | 测试总耗时（秒） |
| `confidence` | `NUMERIC(5,4)` | NULL | — | 置信度（0-1） |
| `accuracy` | `JSONB` | NOT NULL | `{}` | 精度指标：`top1` / `top5` / `mAP50` |
| `result_status` | `VARCHAR(16)` | NOT NULL | `'valid'` | `valid` / `anomaly` / `dirty`（结果有效性标记） |
| `raw_sample_data` | `JSONB` | NULL | — | 多轮原始采样数据，用于回溯 |
| `raw_log_path` | `TEXT` | NULL | — | 原始日志路径 |
| `is_aggregated` | `BOOLEAN` | NOT NULL | `false` | 是否多轮聚合后的最终结果 |
| `is_deleted` | `BOOLEAN` | NOT NULL | `false` | 软删除 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`uk_res_run` UNIQUE ON `(run_id)`、`idx_res_stability`、`idx_res_created_at`、`idx_res_task_type`

**CHECK 约束**：
- `latency_p50_ms >= 0`、`latency_p95_ms >= 0`、`latency_p99_ms >= 0`
- `throughput >= 0`、`memory_peak_mb >= 0`、`power_mw >= 0`
- `latency_p50_ms <= latency_p95_ms AND latency_p95_ms <= latency_p99_ms`（单调递增）

### 3.14 comparisons — 对比表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `name` | `VARCHAR(200)` | NOT NULL | — | 对比名称 |
| `description` | `TEXT` | NOT NULL | `''` | 描述 |
| `project_id` | `UUID` | NULL | — | FK → `projects.id` |
| `dimension` | `VARCHAR(32)` | NULL | — | 对比维度：`precision` / `hardware` / `version` |
| `solution_ids` | `UUID[]` | NOT NULL | — | 参与对比方案 ID 数组（2~8 个） |
| `baseline_id` | `UUID` | NOT NULL | — | 基准方案 ID |
| `metrics_selected` | `TEXT[]` | NOT NULL | `{}` | 选中展示的性能指标 |
| `run_snapshot` | `JSONB` | NOT NULL | `{}` | `{solution_id: run_id}` 快照映射 |
| `snapshot_version` | `VARCHAR(20)` | NOT NULL | `'1.0.0'` | 快照版本号 |
| `snapshot_at` | `TIMESTAMPTZ` | NULL | — | 快照生成时间 |
| `notes` | `TEXT` | NOT NULL | `''` | 备注 |
| `visibility` | `VARCHAR(16)` | NOT NULL | `'private'` | `private` / `team` / `public` |
| `created_by` | `UUID` | NOT NULL | — | FK → `users.id` |
| `shared` | `BOOLEAN` | NOT NULL | `false` | 是否公开分享 |
| `share_token` | `VARCHAR(64)` | NULL | — | **UNIQUE**，分享链接 token |
| `share_expires_at` | `TIMESTAMPTZ` | NULL | — | 分享过期时间 |
| `share_view_count` | `INTEGER` | NOT NULL | `0` | 分享页面访问次数 |
| `is_deleted` | `BOOLEAN` | NOT NULL | `false` | 软删除 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`uk_comp_share_token` UNIQUE ON `(share_token) WHERE share_token IS NOT NULL`、`idx_comp_created_by`、`idx_comp_shared`、`idx_comp_project`、`idx_comp_dimension`、`idx_comp_sids_gin` (GIN ON `solution_ids`)、`idx_comp_metrics_gin` (GIN ON `metrics_selected`)

**CHECK 约束**：
- `array_length(solution_ids, 1) BETWEEN 2 AND 8`
- `baseline_id = ANY(solution_ids)`
- `share_expires_at IS NULL OR share_expires_at > created_at`

### 3.15 tags — 标签主表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `name` | `VARCHAR(64)` | NOT NULL | — | **UNIQUE**，标签名 |
| `color` | `VARCHAR(8)` | NULL | — | HEX 颜色 |
| `usage_count` | `INTEGER` | NOT NULL | `0` | 使用次数 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`uk_tags_name`

---

### ▸ P1 — 审计与日志表

### 3.16 login_logs — 登录日志表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `user_id` | `UUID` | NULL | — | 登录用户 |
| `username_input` | `VARCHAR(50)` | NOT NULL | — | 输入的账号名 |
| `login_result` | `VARCHAR(16)` | NOT NULL | — | `success` / `failed` / `locked` |
| `fail_reason` | `VARCHAR(128)` | NULL | — | 失败原因 |
| `request_ip` | `VARCHAR(64)` | NULL | — | |
| `user_agent` | `TEXT` | NULL | — | |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`idx_login_user`、`idx_login_ip`、`idx_login_created_at`

### 3.17 operation_logs — 操作审计日志表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `user_id` | `UUID` | NULL | — | 操作人 |
| `operation` | `VARCHAR(50)` | NOT NULL | — | `create` / `update` / `delete` / `publish` / `share` / `archive` |
| `resource_type` | `VARCHAR(50)` | NOT NULL | — | `solution` / `run` / `comparison` / `device` / `model` |
| `resource_id` | `UUID` | NOT NULL | — | 被操作资源 ID |
| `request_ip` | `VARCHAR(64)` | NULL | — | |
| `detail` | `JSONB` | NOT NULL | `{}` | 操作详情快照（变更前后对比） |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`idx_oplog_user`、`idx_oplog_resource`、`idx_oplog_created_at`

> **清理策略**：保留 180 天，超期归档到对象存储

---

### ▸ P2 — 扩展表

### 3.18 notifications — 站内信 / 通知表

| 列 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| `id` | `UUID` | NOT NULL | `uuid4()` | 主键 |
| `user_id` | `UUID` | NOT NULL | — | 接收人 |
| `title` | `VARCHAR(200)` | NOT NULL | — | 通知标题 |
| `content` | `TEXT` | NOT NULL | `''` | 通知内容 |
| `type` | `VARCHAR(32)` | NOT NULL | `'info'` | `info` / `warning` / `error` / `success` |
| `resource_type` | `VARCHAR(50)` | NULL | — | 关联资源类型 |
| `resource_id` | `UUID` | NULL | — | 关联资源 ID |
| `is_read` | `BOOLEAN` | NOT NULL | `false` | 已读标记 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | |

**索引**：`idx_notif_user_unread` ON `(user_id, created_at DESC) WHERE is_read = false`

---

## 四、索引策略（完整 DDL）

### 4.1 外键索引

```sql
CREATE INDEX idx_sol_model        ON inference_solutions (model_id);
CREATE INDEX idx_sol_device       ON inference_solutions (device_id);
CREATE INDEX idx_sol_created_by   ON inference_solutions (created_by);
CREATE INDEX idx_sol_project      ON inference_solutions (project_id);
CREATE INDEX idx_art_solution     ON artifacts (solution_id);
CREATE INDEX idx_art_run          ON artifacts (run_id);
CREATE INDEX idx_run_solution     ON benchmark_runs (solution_id);
CREATE INDEX idx_run_device       ON benchmark_runs (device_id);
CREATE INDEX idx_run_project      ON benchmark_runs (project_id);
CREATE INDEX idx_run_created_by   ON benchmark_runs (created_by);
CREATE INDEX idx_comp_created_by  ON comparisons (created_by);
CREATE INDEX idx_comp_project     ON comparisons (project_id);
CREATE INDEX idx_apikey_device    ON api_keys (device_id);
CREATE INDEX idx_ur_user          ON user_roles (user_id);
CREATE INDEX idx_ur_role          ON user_roles (role_id);
CREATE INDEX idx_rp_role          ON role_permissions (role_id);
CREATE INDEX idx_rp_perm          ON role_permissions (permission_id);
CREATE INDEX idx_projects_owner   ON projects (owner_id);
```

### 4.2 状态与时间索引

```sql
CREATE INDEX idx_sol_status       ON inference_solutions (status);
CREATE INDEX idx_sol_visibility   ON inference_solutions (visibility);
CREATE INDEX idx_sol_created_at   ON inference_solutions (created_at DESC);
CREATE INDEX idx_run_status       ON benchmark_runs (status);
CREATE INDEX idx_run_created_at   ON benchmark_runs (created_at DESC);
CREATE INDEX idx_run_started_at   ON benchmark_runs (started_at);
CREATE INDEX idx_run_priority     ON benchmark_runs (priority DESC);
CREATE INDEX idx_device_status    ON device_registry (status);
CREATE INDEX idx_comp_shared      ON comparisons (shared);
CREATE INDEX idx_art_status       ON artifacts (status);
CREATE INDEX idx_art_type         ON artifacts (type);
CREATE INDEX idx_users_status     ON users (status);
CREATE INDEX idx_res_stability    ON benchmark_results (stability);
CREATE INDEX idx_res_created_at   ON benchmark_results (created_at DESC);
CREATE INDEX idx_model_name       ON model_registry (model_name);
CREATE INDEX idx_model_task_type  ON model_registry (task_type);
```

### 4.3 唯一索引

```sql
CREATE UNIQUE INDEX uk_users_username     ON users (username);
CREATE UNIQUE INDEX uk_roles_name         ON roles (role_name);
CREATE UNIQUE INDEX uk_perms_code         ON permissions (perm_code);
CREATE UNIQUE INDEX uk_tags_name          ON tags (name);
CREATE UNIQUE INDEX uk_sys_configs_key    ON sys_configs (config_key);
CREATE UNIQUE INDEX uk_sys_enums_group_code ON sys_enums (enum_group, enum_code);
CREATE UNIQUE INDEX uk_res_run            ON benchmark_results (run_id);
CREATE UNIQUE INDEX uk_comp_share_token   ON comparisons (share_token)
    WHERE share_token IS NOT NULL;
```

### 4.4 GIN 索引（数组 + JSONB）

```sql
CREATE INDEX idx_sol_tags_gin        ON inference_solutions USING GIN (tags);
CREATE INDEX idx_sol_conversion_gin  ON inference_solutions USING GIN (conversion);
CREATE INDEX idx_sol_runtime_gin     ON inference_solutions USING GIN (runtime);
CREATE INDEX idx_comp_sids_gin       ON comparisons USING GIN (solution_ids);
CREATE INDEX idx_comp_metrics_gin    ON comparisons USING GIN (metrics_selected);
CREATE INDEX idx_device_prec_gin     ON device_registry USING GIN (supported_precisions);
CREATE INDEX idx_model_tags_gin      ON model_registry USING GIN (tags);
```

### 4.5 部分索引（条件索引）

```sql
CREATE INDEX idx_run_pending     ON benchmark_runs (created_at)
    WHERE status = 'pending';
CREATE INDEX idx_device_online   ON device_registry (updated_at DESC)
    WHERE status = 'online';
CREATE INDEX idx_sol_published   ON inference_solutions (created_at DESC)
    WHERE status = 'published';
CREATE INDEX idx_notif_unread    ON notifications (user_id, created_at DESC)
    WHERE is_read = false;
```

---

## 五、CHECK 约束清单

```sql
-- comparisons
ALTER TABLE comparisons
    ADD CONSTRAINT chk_comp_solution_count
    CHECK (array_length(solution_ids, 1) BETWEEN 2 AND 8);

ALTER TABLE comparisons
    ADD CONSTRAINT chk_comp_baseline_in_solutions
    CHECK (baseline_id = ANY(solution_ids));

ALTER TABLE comparisons
    ADD CONSTRAINT chk_comp_share_expiry
    CHECK (share_expires_at IS NULL OR share_expires_at > created_at);

-- benchmark_results（性能指标非负）
ALTER TABLE benchmark_results
    ADD CONSTRAINT chk_res_latency_p50_non_neg
    CHECK (latency_p50_ms IS NULL OR latency_p50_ms >= 0);

ALTER TABLE benchmark_results
    ADD CONSTRAINT chk_res_latency_p95_non_neg
    CHECK (latency_p95_ms IS NULL OR latency_p95_ms >= 0);

ALTER TABLE benchmark_results
    ADD CONSTRAINT chk_res_latency_p99_non_neg
    CHECK (latency_p99_ms IS NULL OR latency_p99_ms >= 0);

ALTER TABLE benchmark_results
    ADD CONSTRAINT chk_res_throughput_non_neg
    CHECK (throughput IS NULL OR throughput >= 0);

ALTER TABLE benchmark_results
    ADD CONSTRAINT chk_res_memory_non_neg
    CHECK (memory_peak_mb IS NULL OR memory_peak_mb >= 0);

ALTER TABLE benchmark_results
    ADD CONSTRAINT chk_res_power_non_neg
    CHECK (power_mw IS NULL OR power_mw >= 0);

ALTER TABLE benchmark_results
    ADD CONSTRAINT chk_res_latency_order
    CHECK (latency_p50_ms IS NULL OR latency_p95_ms IS NULL
           OR latency_p50_ms <= latency_p95_ms);

-- artifacts
ALTER TABLE artifacts
    ADD CONSTRAINT chk_art_size_non_neg
    CHECK (size_bytes >= 0);
```

---

## 六、外键与级联规则

| 从表 | 关联字段 | 主表 | 主表主键 | 级联策略 |
|---|---|---|---|---|
| `artifacts` | `solution_id` | `inference_solutions` | `id` | **SET NULL**（不物理删） |
| `artifacts` | `run_id` | `benchmark_runs` | `id` | **SET NULL** |
| `benchmark_runs` | `solution_id` | `inference_solutions` | `id` | **RESTRICT** |
| `benchmark_results` | `run_id` | `benchmark_runs` | `id` | **RESTRICT** |
| `api_keys` | `device_id` | `device_registry` | `id` | **CASCADE**（设备删→密钥失效） |
| `user_roles` | `user_id` | `users` | `id` | **CASCADE** |
| `user_roles` | `role_id` | `roles` | `id` | **CASCADE** |
| `role_permissions` | `role_id` | `roles` | `id` | **CASCADE** |
| `role_permissions` | `permission_id` | `permissions` | `id` | **CASCADE** |

**策略说明**：
- 业务主表（solutions / runs / results）关闭 CASCADE，防误删级联
- 关联表（user_roles / role_permissions）保留 CASCADE，主表删了关联自动清
- 设备密钥：设备物理删除时自动清理密钥记录

---

## 七、数据生命周期与归档策略

| 数据层级 | 时间范围 | 存储位置 | 操作 |
|---|---|---|---|
| 热数据 | 0 ~ 6 个月 | 主库 | 正常读写，全量索引 |
| 温数据 | 6 ~ 12 个月 | 主库（只读副本） | 可查询，限制写入 |
| 冷数据 | 12 个月以上 | 对象存储 + 归档库 | 从主库迁移，按需恢复 |
| 审计日志 | 保留 180 天 | 主库 | 超期批量归档到对象存储 |
| 过期分享 | 立即 | 主库 | share_token 置空，shared = false |
| 软删除数据 | 保留 30 天 | 主库 | 超期物理删除（定时任务） |

---

## 八、安全与权限模型

### 8.1 RBAC 角色

| 角色 | 预设权限 |
|---|---|
| `admin` | 全平台管理：用户管理、设备注册、全局配置、数据清理 |
| `tester` | 方案 CRUD + 归档、任务触发、结果查看、对比分析 |
| `viewer` | 只读：方案、结果、对比（不可修改、不可触发任务） |

### 8.2 数据可见性

| 级别 | 说明 |
|---|---|
| `private` | 仅创建者及项目成员可见 |
| `team` | 同 project 内所有成员可见 |
| `public` | 全平台可见（需登录） |

---

## 九、变更记录

| 版本 | 日期 | 变更内容 |
|---|---|---|
| V1.0 | 2026-06-08 | 初始版本，6 张核心表 |
| V1.5 | 2026-06-08 | 工程审查（ttt），识别 26 项缺失 |
| V2.0 | 2026-06-08 | 补齐 RBAC、审计日志、索引 DDL、CHECK 约束、软删除、分区策略、冷热分离 |

---

## 附录：表关系总图

```
users ────┬── 1:N ──> user_roles ── N:1 ──> roles
          │                                  │
          │                           role_permissions
          │                                  │
          │                           permissions
          │
          ├── 1:N ──> inference_solutions ──┬── 1:N ──> artifacts
          │                                 │
          │                                 └── 1:N ──> benchmark_runs
          │                                                │
          │                                         benchmark_results (1:0..1)
          │
          ├── 1:N ──> comparisons
          └── 1:N ──> projects

device_registry ── 1:N ──> api_keys
model_registry  ── 1:N ──> inference_solutions.model_id
```
