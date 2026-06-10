"use client";

import { useState } from "react";

const docSections = [
  {
    id: "quickstart",
    icon: "rocket_launch",
    title: "快速开始",
    color: "text-primary",
    bgColor: "bg-rose-50",
    items: [
      { id: "qs-intro", title: "平台简介", badge: "新手必读" },
      { id: "qs-install", title: "环境安装与配置" },
      { id: "qs-first", title: "提交第一个基准测试" },
      { id: "qs-result", title: "解读测试报告" },
    ],
  },
  {
    id: "benchmark",
    icon: "analytics",
    title: "基准测试",
    color: "text-secondary",
    bgColor: "bg-purple-50",
    items: [
      { id: "bm-overview", title: "测试方法论" },
      { id: "bm-metrics", title: "核心指标说明", badge: "重要" },
      { id: "bm-hardware", title: "支持硬件平台" },
      { id: "bm-precision", title: "量化精度选项" },
      { id: "bm-reproduce", title: "结果可复现性" },
    ],
  },
  {
    id: "models",
    icon: "model_training",
    title: "模型接入",
    color: "text-primary",
    bgColor: "bg-rose-50",
    items: [
      { id: "m-format", title: "支持的模型格式" },
      { id: "m-onnx", title: "ONNX 模型指南" },
      { id: "m-trt", title: "TensorRT 引擎" },
      { id: "m-custom", title: "自定义算子支持" },
    ],
  },
  {
    id: "api",
    icon: "code",
    title: "API 参考",
    color: "text-secondary",
    bgColor: "bg-purple-50",
    items: [
      { id: "api-auth", title: "鉴权与密钥", badge: "必须" },
      { id: "api-submit", title: "提交测试接口" },
      { id: "api-query", title: "查询结果接口" },
      { id: "api-webhook", title: "Webhook 回调" },
    ],
  },
  {
    id: "advanced",
    icon: "tune",
    title: "高级配置",
    color: "text-primary",
    bgColor: "bg-rose-50",
    items: [
      { id: "adv-batch", title: "批量提交" },
      { id: "adv-ci", title: "CI/CD 集成" },
      { id: "adv-custom", title: "自定义测试场景" },
    ],
  },
  {
    id: "faq",
    icon: "help",
    title: "常见问题",
    color: "text-secondary",
    bgColor: "bg-purple-50",
    items: [
      { id: "faq-fail", title: "测试失败如何排查" },
      { id: "faq-diff", title: "结果差异分析" },
      { id: "faq-quota", title: "配额与限流说明" },
    ],
  },
];

const docContents: Record<string, { title: string; content: React.ReactNode }> = {
  "qs-intro": {
    title: "平台简介",
    content: (
      <div className="space-y-6">
        <p className="text-lg text-on-surface-variant leading-relaxed">
          NPU Benchmark Hub 是面向 AI 推理工程师的开放基准测试平台，提供跨硬件架构的标准化推理性能评测与精度验证能力。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "speed", title: "性能对比", desc: "延迟、吞吐、功耗三维度对比，横跨 NPU / GPU / CPU 架构" },
            { icon: "verified", title: "精度验证", desc: "量化前后精度对比，支持 INT4/INT8/FP16 多精度自动校验" },
            { icon: "hub", title: "生态接入", desc: "兼容 ONNX Runtime / TensorRT / MindSpore 等主流推理框架" },
          ].map((card) => (
            <div key={card.title} className="bg-surface-container-low rounded-2xl p-5 space-y-2">
              <span className="material-symbols-outlined text-primary text-2xl">{card.icon}</span>
              <h3 className="font-headline font-bold text-on-surface">{card.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-4">
          <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0">info</span>
          <div>
            <p className="font-headline font-semibold text-on-surface mb-1">当前平台版本</p>
            <p className="text-sm text-on-surface-variant">
              v2.4.1 — 新增 R-SERIES 2024 硬件支持，优化多模态模型评测流水线。
              <a href="#" className="text-primary font-semibold ml-1 hover:underline">查看更新日志 →</a>
            </p>
          </div>
        </div>
      </div>
    ),
  },
  "bm-metrics": {
    title: "核心指标说明",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          平台统一定义以下核心推理指标，所有结果均在控制环境（温度、负载、Batch Size）下测量，确保可对比性。
        </p>
        <div className="space-y-4">
          {[
            {
              name: "延迟 (Latency)",
              unit: "ms",
              icon: "timer",
              desc: "单次推理的端到端时间，含预处理与后处理。取连续 1000 次推理的 P50 / P95 / P99 统计值。",
              formula: "Latency = T_end − T_start (单请求，Batch=1)",
            },
            {
              name: "吞吐量 (Throughput)",
              unit: "tokens/s | FPS | it/s",
              icon: "speed",
              desc: "单位时间内的有效推理输出量。视任务类型采用不同单位：LLM 用 tok/s，视觉模型用 FPS，生成模型用 it/s。",
              formula: "Throughput = N_output / T_total",
            },
            {
              name: "加速比 (Speedup)",
              unit: "×",
              icon: "bolt",
              desc: "相对 CPU 基线的吞吐量提升倍数。CPU 基线使用 Intel Xeon Platinum 8480+ @ TDP 350W。",
              formula: "Speedup = Throughput_NPU / Throughput_CPU",
            },
            {
              name: "能效比 (TOPS/W)",
              unit: "TOPS/W",
              icon: "eco",
              desc: "每瓦功耗可完成的推理操作数量，综合衡量性能与能效。平台通过硬件级功耗计量仪实时采样。",
              formula: "Efficiency = Throughput / Power_avg",
            },
          ].map((metric) => (
            <div key={metric.name} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 space-y-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">{metric.icon}</span>
                <div>
                  <h3 className="font-headline font-bold text-on-surface">{metric.name}</h3>
                  <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{metric.unit}</span>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">{metric.desc}</p>
              <div className="bg-surface-container rounded-xl px-4 py-2">
                <code className="text-xs font-mono text-secondary">{metric.formula}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  "api-auth": {
    title: "鉴权与密钥",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          所有 API 请求均需携带 Bearer Token。在账号管理页面生成 API Key，有效期 90 天，支持按权限级别（只读 / 读写）创建。
        </p>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="flex items-center justify-between px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">HTTP Header</span>
            <button className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              复制
            </button>
          </div>
          <pre className="p-5 text-sm font-mono text-secondary overflow-x-auto">{`Authorization: Bearer npubench_xxxxxxxxxxxxxxxxxxxxxxxx

Content-Type: application/json`}</pre>
        </div>
        <div className="space-y-3">
          <h3 className="font-headline font-bold text-on-surface">获取 API Key</h3>
          <ol className="space-y-2 text-sm text-on-surface-variant">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">1</span>
              登录平台，进入 <span className="font-semibold text-on-surface">账号管理 → API 密钥</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">2</span>
              点击 <span className="font-semibold text-on-surface">生成新密钥</span>，选择权限范围
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">3</span>
              复制密钥并妥善保管，创建后仅显示一次
            </li>
          </ol>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
          <span className="material-symbols-outlined text-amber-600 text-xl flex-shrink-0">warning</span>
          <p className="text-sm text-amber-800">
            API Key 与账号权限绑定。请勿将密钥提交到代码仓库或公开渠道。如发现泄露，请立即在账号管理页面吊销。
          </p>
        </div>
      </div>
    ),
  },
  "api-submit": {
    title: "提交测试接口",
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-mono font-bold text-sm rounded-lg">POST</span>
          <code className="font-mono text-sm text-on-surface">/v1/benchmarks</code>
        </div>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          提交推理测试任务。支持 ONNX、TensorRT Engine、TFLite 格式。测试任务进入队列后异步执行，通过 Webhook 或轮询获取结果。
        </p>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-on-surface-variant">Request Body (JSON)</span>
          </div>
          <pre className="p-5 text-xs font-mono text-secondary overflow-x-auto leading-relaxed">{`{
  "model_name": "Whisper-Large-v3",
  "model_url": "https://your-storage/model.onnx",
  "hardware": ["NPU-X1 Gen2", "NPU-V2 Gen-4"],
  "precision": "INT8",
  "batch_size": 1,
  "warmup_iters": 100,
  "test_iters": 1000,
  "dataset": "librispeech-test-clean",
  "notify_url": "https://your-server/webhook"
}`}</pre>
        </div>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">Response 202 Accepted</span>
          </div>
          <pre className="p-5 text-xs font-mono text-tertiary overflow-x-auto leading-relaxed">{`{
  "task_id": "task_a8f3d2e1b4c",
  "status": "QUEUED",
  "estimated_seconds": 420,
  "created_at": "2024-03-15T08:22:11Z"
}`}</pre>
        </div>
      </div>
    ),
  },
  "qs-install": {
    title: "环境安装与配置",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">通过 NPU Benchmark CLI 工具快速完成本地环境配置并提交测试。</p>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">Terminal</span>
          </div>
          <pre className="p-5 text-sm font-mono text-secondary leading-loose">{`# 安装 CLI
pip install npubench-cli

# 配置 API Key
npubench config set-key npubench_xxxxxxxxxxxxxxxx

# 验证连接
npubench ping`}</pre>
        </div>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">系统要求</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="text-left px-5 py-3 font-bold text-on-surface-variant text-xs uppercase">组件</th>
                <th className="text-left px-5 py-3 font-bold text-on-surface-variant text-xs uppercase">最低要求</th>
                <th className="text-left px-5 py-3 font-bold text-on-surface-variant text-xs uppercase">推荐</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {[
                ["Python", "3.9+", "3.11+"],
                ["ONNX Runtime", "1.15+", "1.17+"],
                ["RAM", "8 GB", "32 GB"],
                ["Driver", "NPU Driver 5.x", "NPU Driver 6.x"],
              ].map(([comp, min, rec]) => (
                <tr key={comp} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-5 py-3 font-mono text-on-surface">{comp}</td>
                  <td className="px-5 py-3 text-on-surface-variant">{min}</td>
                  <td className="px-5 py-3 text-primary font-semibold">{rec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  "qs-first": {
    title: "提交第一个基准测试",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          完成环境配置后，按照以下步骤提交您的第一个 NPU 推理基准测试任务。整个流程通常在 5 分钟内完成。
        </p>
        <div className="space-y-4">
          {[
            { step: "1", title: "准备模型文件", desc: "将模型导出为 ONNX 格式（推荐）或 TensorRT Engine。确保模型输入输出形状已固定，避免动态轴影响测试稳定性。", code: `# PyTorch 导出示例
import torch
model = YourModel().eval()
dummy_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(model, dummy_input, "model.onnx",
    opset_version=17, input_names=["input"],
    output_names=["output"])` },
            { step: "2", title: "上传模型到存储", desc: "将模型文件上传至可访问的 URL（OSS、S3、HTTPS 均可）。平台在执行时会从该地址拉取模型。", code: `# 使用 OSS CLI 上传示例
ossutil cp model.onnx oss://your-bucket/models/model.onnx --acl public-read` },
            { step: "3", title: "提交测试任务", desc: "通过 CLI 或 API 提交测试。CLI 方式最为简便，推荐初次使用。", code: `npubench submit \\
  --model-url https://your-storage/model.onnx \\
  --hardware NPU-X1-Gen2,NPU-V2-Gen-4 \\
  --precision INT8 \\
  --dataset imagenet-val-1k` },
            { step: "4", title: "等待结果", desc: "任务进入队列后异步执行，平均耗时 3–8 分钟。可通过 CLI 轮询或等待 Webhook 推送。", code: `# 查询任务状态
npubench status task_a8f3d2e1b4c

# 实时日志流
npubench logs task_a8f3d2e1b4c --follow` },
          ].map((item) => (
            <div key={item.step} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 bg-surface-container-low">
                <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-extrabold flex-shrink-0">{item.step}</span>
                <h3 className="font-headline font-bold text-on-surface">{item.title}</h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                <div className="bg-surface-container rounded-xl overflow-hidden">
                  <pre className="p-4 text-xs font-mono text-secondary leading-relaxed overflow-x-auto">{item.code}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-4">
          <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">tips_and_updates</span>
          <p className="text-sm text-on-surface-variant">首次提交建议选择小模型（&lt; 100MB）验证流程，再逐步测试大模型。</p>
        </div>
      </div>
    ),
  },
  "qs-result": {
    title: "解读测试报告",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          测试完成后，平台生成包含延迟、吞吐、加速比、精度四个维度的标准化报告。以下是各部分的解读方法。
        </p>
        <div className="space-y-4">
          {[
            { icon: "speed", color: "text-primary", title: "性能摘要卡", desc: "报告顶部展示所有硬件平台的最优结果，包括最低延迟、最高吞吐和最大加速比。绿色箭头表示优于历史提交，红色表示退步。" },
            { icon: "bar_chart", color: "text-secondary", title: "硬件对比图表", desc: "条形图横向对比各硬件平台的吞吐量与加速比。点击具体柱子可查看该平台的完整原始数据，包括 P50/P95/P99 延迟分布。" },
            { icon: "analytics", color: "text-tertiary", title: "精度对比表", desc: "列出量化前后各精度指标的差异（如 mAP、WER、FID）。Delta 列显示相对 FP32 基线的偏差，超过阈值会以红色标注警告。" },
            { icon: "history", color: "text-primary", title: "历史趋势图", desc: "折线图展示该模型过去 6 次提交的吞吐量变化，帮助追踪优化进展。可通过下拉切换查看不同硬件平台的历史曲线。" },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
              <span className={`material-symbols-outlined text-2xl flex-shrink-0 ${item.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              <div>
                <h3 className="font-headline font-bold text-on-surface mb-1">{item.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">结果 JSON 示例</span>
          </div>
          <pre className="p-5 text-xs font-mono text-secondary leading-relaxed overflow-x-auto">{`{
  "task_id": "task_a8f3d2e1b4c",
  "status": "PASSED",
  "hardware": "NPU-X1 Gen2",
  "latency_p50_ms": 42.5,
  "latency_p95_ms": 48.2,
  "throughput": 1240,
  "throughput_unit": "tokens/s",
  "speedup_vs_cpu": 14.2,
  "power_w": 8.4,
  "accuracy": { "metric": "WER", "value": 2.7, "delta": 0.3 }
}`}</pre>
        </div>
      </div>
    ),
  },
  "bm-overview": {
    title: "测试方法论",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          NPU Benchmark Hub 采用业界标准化测试方法，确保所有结果在控制环境下采集，具备横向可比性与纵向可复现性。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: "thermostat", title: "温控环境", desc: "测试在恒温机房（20±2°C）中进行，避免热降频影响结果。每次测试前执行 5 分钟热身运行。" },
            { icon: "memory", title: "负载隔离", desc: "测试期间关闭非必要后台进程，CPU 负载保持 < 5%，确保 NPU 性能不受干扰。" },
            { icon: "repeat", title: "多次采样", desc: "每个配置执行 100 次预热 + 1000 次正式推理，取 P50/P95/P99 统计值，消除偶发抖动。" },
            { icon: "verified", title: "结果审核", desc: "所有提交结果经平台自动校验后，由认证工程师人工复核，确保数据真实可信。" },
          ].map((card) => (
            <div key={card.title} className="bg-surface-container-low rounded-2xl p-5 space-y-2">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
              <h3 className="font-headline font-bold text-on-surface">{card.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="font-headline font-bold text-on-surface">测试流程</h3>
          <div className="space-y-2">
            {[
              "模型上传 → 格式校验（ONNX opset 检查、算子兼容性扫描）",
              "编译优化 → 针对目标硬件自动应用量化、图融合、内存布局优化",
              "预热推理 → 100 次 warm-up，稳定 cache 与 pipeline 状态",
              "正式测试 → 1000 次推理，采集延迟时间序列与功耗曲线",
              "精度校验 → 在标准数据集上比对量化前后精度指标",
              "报告生成 → 汇总统计值，生成结构化 JSON 与可视化报告",
            ].map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-sm text-on-surface-variant">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  "bm-hardware": {
    title: "支持硬件平台",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          平台当前支持以下 NPU 硬件平台进行基准测试，覆盖从边缘端到数据中心的全场景部署需求。
        </p>
        <div className="space-y-4">
          {[
            { name: "NPU-X1 Gen2", tier: "主流推理", tdp: "15W", tops: "32 TOPS", mem: "8 GB LPDDR5", badge: "bg-primary/10 text-primary", desc: "面向中端边缘设备的高能效推理加速卡，支持 INT4/INT8/FP16，适合音视频实时处理场景。" },
            { name: "NPU-V2 Gen-4", tier: "高性能推理", tdp: "30W", tops: "96 TOPS", mem: "16 GB LPDDR5X", badge: "bg-secondary/10 text-secondary", desc: "高性能 NPU，支持稀疏推理加速与动态批处理，适用于云端 API 服务和大模型推理。" },
            { name: "EDGE-NPU X1", tier: "超低功耗", tdp: "5W", tops: "12 TOPS", mem: "4 GB LPDDR4X", badge: "bg-tertiary/10 text-tertiary", desc: "超低功耗边缘推理芯片，专为 IoT 和移动设备设计，支持 INT4 量化极限压缩。" },
            { name: "R-SERIES 2024", tier: "旗舰推理", tdp: "60W", tops: "256 TOPS", mem: "32 GB HBM2e", badge: "bg-primary/10 text-primary", desc: "数据中心旗舰 NPU，搭载 HBM2e 高带宽内存，专为大语言模型和多模态推理优化。" },
          ].map((hw) => (
            <div key={hw.name} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>memory</span>
                  <h3 className="font-headline font-bold text-on-surface text-lg">{hw.name}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${hw.badge}`}>{hw.tier}</span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">{hw.desc}</p>
              <div className="flex gap-6 text-sm">
                {[["TDP", hw.tdp], ["算力", hw.tops], ["内存", hw.mem]].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{k}</p>
                    <p className="font-headline font-bold text-on-surface">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
          <span className="material-symbols-outlined text-amber-600 text-xl flex-shrink-0">schedule</span>
          <p className="text-sm text-amber-800">更多硬件平台（昇腾 910B、高通 Cloud AI 100）正在接入中，预计 2024 Q3 上线。</p>
        </div>
      </div>
    ),
  },
  "bm-precision": {
    title: "量化精度选项",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          平台支持四种量化精度，不同精度在模型体积、推理速度与精度损失之间有不同的权衡。
        </p>
        <div className="space-y-4">
          {[
            { quant: "FP32", color: "text-on-surface", bg: "bg-surface-container", speed: "基准", size: "100%", loss: "无损失", desc: "全精度浮点，仅用于精度基线对比，不参与 NPU 加速评分。CPU 基线测试使用此精度。" },
            { quant: "FP16", color: "text-secondary", bg: "bg-secondary/10", speed: "1.8×", size: "50%", loss: "< 0.1%", desc: "半精度浮点，大多数现代 NPU 原生支持。图像生成、多模态模型推荐选择，精度损失几乎可忽略。" },
            { quant: "INT8", color: "text-primary", bg: "bg-primary/10", speed: "3.2×", size: "25%", loss: "< 0.5%", desc: "8-bit 整数量化，最成熟的量化方案。目标检测、语音识别模型的主流选择，性价比最高。" },
            { quant: "INT4", color: "text-tertiary", bg: "bg-tertiary/10", speed: "5.1×", size: "12.5%", loss: "< 1.5%", desc: "4-bit 极限压缩，适合大语言模型部署。需要配合 GPTQ/AWQ 等先进量化算法以控制精度损失。" },
          ].map((p) => (
            <div key={p.quant} className={`rounded-2xl border border-outline-variant/10 p-6 ${p.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`font-mono font-extrabold text-xl ${p.color}`}>{p.quant}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-on-surface-variant">速度提升 <span className="font-bold text-on-surface">{p.speed}</span></span>
                  <span className="text-on-surface-variant">模型大小 <span className="font-bold text-on-surface">{p.size}</span></span>
                  <span className="text-on-surface-variant">精度损失 <span className="font-bold text-on-surface">{p.loss}</span></span>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  "bm-reproduce": {
    title: "结果可复现性",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          平台所有测试结果均可通过标准 CLI 工具在相同硬件上复现，确保数据透明可信。
        </p>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">复现指定任务</span>
          </div>
          <pre className="p-5 text-sm font-mono text-secondary leading-loose">{`# 下载测试配置
npubench pull task_a8f3d2e1b4c

# 在本地硬件上复现
npubench reproduce task_a8f3d2e1b4c --hardware NPU-X1-Gen2

# 对比结果
npubench diff task_a8f3d2e1b4c ./local_result.json`}</pre>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "lock", title: "环境快照", desc: "每次测试记录完整的软件栈版本（Driver、Runtime、Framework），复现时自动匹配。" },
            { icon: "fingerprint", title: "模型哈希", desc: "对模型文件计算 SHA-256，防止模型版本差异导致结果不一致。" },
            { icon: "dataset", title: "数据集固定", desc: "使用平台托管的标准数据集切片，保证验证集样本一致，精度结果可比。" },
          ].map((item) => (
            <div key={item.title} className="bg-surface-container-low rounded-2xl p-5 space-y-2">
              <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
              <h3 className="font-headline font-bold text-on-surface text-sm">{item.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  "m-format": {
    title: "支持的模型格式",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">平台当前支持以下三种模型格式，推荐优先使用 ONNX 以获得最广泛的硬件兼容性。</p>
        <div className="space-y-4">
          {[
            { fmt: "ONNX", badge: "推荐", badgeCls: "bg-primary text-on-primary", icon: "check_circle", iconCls: "text-primary", ops: "opset 11–18", desc: "开放神经网络交换格式，跨框架兼容性最佳。支持 PyTorch、TensorFlow、PaddlePaddle 导出，平台自动完成算子映射与图优化。" },
            { fmt: "TensorRT Engine", badge: "高性能", badgeCls: "bg-secondary text-on-secondary", icon: "bolt", iconCls: "text-secondary", ops: "TRT 8.x / 9.x", desc: "NVIDIA TensorRT 序列化引擎，已经过硬件级编译优化。仅支持对应 GPU/NPU 架构，迁移性受限，但推理延迟最低。" },
            { fmt: "TFLite", badge: "移动端", badgeCls: "bg-tertiary text-on-tertiary", icon: "phone_android", iconCls: "text-tertiary", ops: "Schema v3", desc: "TensorFlow Lite 格式，面向 EDGE-NPU X1 等移动端芯片优化。支持 INT8/INT4 委托加速，适合嵌入式场景。" },
          ].map((item) => (
            <div key={item.fmt} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`material-symbols-outlined text-xl ${item.iconCls}`} style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                <h3 className="font-headline font-bold text-on-surface text-lg">{item.fmt}</h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ml-auto ${item.badgeCls}`}>{item.badge}</span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-3">{item.desc}</p>
              <span className="text-xs font-mono bg-surface-container px-2 py-1 rounded text-secondary">{item.ops}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  "m-onnx": {
    title: "ONNX 模型指南",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">ONNX 是平台首推格式，以下是各主流框架的导出方法及常见问题处理。</p>
        {[
          { fw: "PyTorch", code: `import torch
model = MyModel().eval()
dummy = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    model, dummy, "model.onnx",
    opset_version=17,
    input_names=["input"], output_names=["output"],
    dynamic_axes=None  # 固定形状提升性能
)` },
          { fw: "PaddlePaddle", code: `import paddle
from paddle.static import InputSpec
model = MyPaddleModel()
input_spec = [InputSpec(shape=[1,3,224,224], dtype="float32")]
paddle.onnx.export(model, "model", input_spec=input_spec, opset_version=13)` },
        ].map((item) => (
          <div key={item.fw} className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
            <div className="px-5 py-3 bg-surface-container-high">
              <span className="text-xs font-mono font-bold text-on-surface-variant">{item.fw} 导出</span>
            </div>
            <pre className="p-5 text-xs font-mono text-secondary leading-relaxed overflow-x-auto">{item.code}</pre>
          </div>
        ))}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
          <span className="material-symbols-outlined text-amber-600 text-xl flex-shrink-0">warning</span>
          <div className="text-sm text-amber-800 space-y-1">
            <p className="font-semibold">常见问题</p>
            <p>• 避免使用动态轴（dynamic axes），固定 batch size=1 以获得最佳 NPU 调度效率</p>
            <p>• 不支持自定义算子（Custom Op），请替换为等价标准算子</p>
            <p>• opset 版本建议 ≥ 13，低版本可能缺少 NPU 加速算子映射</p>
          </div>
        </div>
      </div>
    ),
  },
  "m-trt": {
    title: "TensorRT 引擎",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">使用 TensorRT 引擎可获得最低推理延迟，但需针对目标硬件单独编译。</p>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">从 ONNX 编译 TRT Engine</span>
          </div>
          <pre className="p-5 text-sm font-mono text-secondary leading-loose">{`# 使用 trtexec 编译
trtexec --onnx=model.onnx \\
  --saveEngine=model.trt \\
  --int8 \\
  --calib=calib_data/ \\
  --workspace=4096

# 提交 TRT Engine
npubench submit \\
  --model-url https://your-storage/model.trt \\
  --format tensorrt \\
  --hardware NPU-V2-Gen-4`}</pre>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-4">
          <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">info</span>
          <p className="text-sm text-on-surface-variant">TRT Engine 与硬件架构绑定，在 NPU-X1 Gen2 上编译的 Engine 无法直接运行于 NPU-V2 Gen-4。如需多平台测试，请为每个硬件分别编译并提交。</p>
        </div>
      </div>
    ),
  },
  "m-custom": {
    title: "自定义算子支持",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          若模型包含 ONNX 标准算子集之外的自定义算子，需要提前向平台注册算子实现，方可通过编译校验。
        </p>
        <div className="space-y-3">
          <h3 className="font-headline font-bold text-on-surface">注册流程</h3>
          {["编写符合 ONNX Custom Op 规范的 C++ 实现，并编译为动态库（.so）", "通过平台 API 上传算子库，获取算子注册 ID", "在提交时附加算子库 URL，平台在编译环节自动加载"].map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-sm text-on-surface-variant">{s}</p>
            </div>
          ))}
        </div>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">提交含自定义算子的模型</span>
          </div>
          <pre className="p-5 text-sm font-mono text-secondary leading-loose">{`npubench submit \\
  --model-url https://your-storage/model.onnx \\
  --custom-op-lib https://your-storage/custom_ops.so \\
  --hardware NPU-X1-Gen2`}</pre>
        </div>
      </div>
    ),
  },
  "api-query": {
    title: "查询结果接口",
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 font-mono font-bold text-sm rounded-lg">GET</span>
          <code className="font-mono text-sm text-on-surface">/v1/benchmarks/{"{task_id}"}</code>
        </div>
        <p className="text-on-surface-variant text-sm leading-relaxed">查询指定任务的状态与结果。任务状态为 QUEUED / RUNNING / PASSED / FAILED。</p>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">Response 200 OK</span>
          </div>
          <pre className="p-5 text-xs font-mono text-secondary overflow-x-auto leading-relaxed">{`{
  "task_id": "task_a8f3d2e1b4c",
  "status": "PASSED",
  "hardware": "NPU-X1 Gen2",
  "precision": "INT8",
  "latency_p50_ms": 42.5,
  "latency_p95_ms": 48.2,
  "throughput": 1240,
  "throughput_unit": "tokens/s",
  "speedup_vs_cpu": 14.2,
  "power_w": 8.4,
  "accuracy": {
    "metric": "WER",
    "value": 2.7,
    "baseline": 2.4,
    "delta": 0.3
  },
  "completed_at": "2024-03-15T08:29:43Z"
}`}</pre>
        </div>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">列举所有任务 GET /v1/benchmarks</span>
          </div>
          <pre className="p-5 text-xs font-mono text-secondary overflow-x-auto leading-relaxed">{`# 支持分页与过滤
GET /v1/benchmarks?status=PASSED&hardware=NPU-X1+Gen2&page=1&limit=20`}</pre>
        </div>
      </div>
    ),
  },
  "api-webhook": {
    title: "Webhook 回调",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          任务完成后，平台向您提交时指定的 <code className="font-mono text-sm bg-surface-container px-1.5 py-0.5 rounded">notify_url</code> 发送 POST 请求，携带完整结果数据。
        </p>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">Webhook Payload</span>
          </div>
          <pre className="p-5 text-xs font-mono text-secondary overflow-x-auto leading-relaxed">{`{
  "event": "benchmark.completed",
  "task_id": "task_a8f3d2e1b4c",
  "status": "PASSED",
  "result": { ... },  // 同 GET /v1/benchmarks/{task_id} 响应
  "timestamp": "2024-03-15T08:29:43Z",
  "signature": "sha256=abc123..."  // HMAC-SHA256 签名
}`}</pre>
        </div>
        <div className="space-y-3">
          <h3 className="font-headline font-bold text-on-surface">签名验证</h3>
          <p className="text-sm text-on-surface-variant">使用您账户的 Webhook Secret 对请求体进行 HMAC-SHA256 签名验证，防止伪造请求。</p>
          <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
            <pre className="p-5 text-xs font-mono text-secondary overflow-x-auto leading-relaxed">{`import hmac, hashlib

def verify(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)`}</pre>
          </div>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-4">
          <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">info</span>
          <p className="text-sm text-on-surface-variant">平台在首次推送失败后会以指数退避策略重试最多 5 次（间隔 1m / 5m / 30m / 2h / 12h）。</p>
        </div>
      </div>
    ),
  },
  "adv-batch": {
    title: "批量提交",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          通过批量接口一次提交多个模型或多组配置，适合 CI 流水线中的回归测试场景。
        </p>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">batch.yaml — 批量配置文件</span>
          </div>
          <pre className="p-5 text-sm font-mono text-secondary leading-loose">{`jobs:
  - model_url: https://storage/whisper-large.onnx
    hardware: [NPU-X1-Gen2, NPU-V2-Gen-4]
    precision: [INT8, FP16]

  - model_url: https://storage/yolov9-e.onnx
    hardware: [NPU-X1-Gen2]
    precision: INT8
    dataset: coco-val-1k`}</pre>
        </div>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">Terminal</span>
          </div>
          <pre className="p-5 text-sm font-mono text-secondary leading-loose">{`# 提交批量任务
npubench batch submit batch.yaml

# 查看所有子任务状态
npubench batch status batch_20240315_001`}</pre>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-4">
          <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">info</span>
          <p className="text-sm text-on-surface-variant">单次批量提交最多支持 50 个任务，所有子任务并行调度执行，总耗时取决于队列负载。</p>
        </div>
      </div>
    ),
  },
  "adv-ci": {
    title: "CI/CD 集成",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          将 NPU Benchmark 集成到 CI 流水线，在每次模型更新后自动触发性能回归测试。
        </p>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">GitHub Actions — .github/workflows/benchmark.yml</span>
          </div>
          <pre className="p-5 text-xs font-mono text-secondary leading-relaxed overflow-x-auto">{`name: NPU Benchmark
on:
  push:
    paths: ["models/**"]

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install npubench-cli
      - run: |
          npubench config set-key \${{ secrets.NPUBENCH_KEY }}
          TASK=$(npubench submit --model-url \$MODEL_URL --hardware NPU-X1-Gen2 --precision INT8)
          npubench wait \$TASK --timeout 600
          npubench assert \$TASK --min-speedup 10 --max-latency 50`}</pre>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: "check_circle", title: "性能门禁", desc: "使用 npubench assert 设置最低加速比与最高延迟阈值，不达标时 CI 失败。" },
            { icon: "notifications", title: "结果通知", desc: "通过 Webhook 将测试结果推送到 Slack、钉钉或企业微信，及时告知团队。" },
          ].map((item) => (
            <div key={item.title} className="bg-surface-container-low rounded-2xl p-5 space-y-2">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              <h3 className="font-headline font-bold text-on-surface text-sm">{item.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  "adv-custom": {
    title: "自定义测试场景",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          除标准数据集外，您可以上传私有数据集和自定义评估脚本，满足业务特定场景的测试需求。
        </p>
        <div className="space-y-3">
          {[
            { title: "上传私有数据集", code: `npubench dataset upload ./my_dataset/ --name "prod-samples-v2" --format imagenet` },
            { title: "注册自定义评估脚本", code: `npubench eval-script upload ./eval.py --name "custom-wer" --metric wer` },
            { title: "使用自定义配置提交", code: `npubench submit \\
  --model-url https://storage/model.onnx \\
  --dataset custom:prod-samples-v2 \\
  --eval-script custom:custom-wer` },
          ].map((item) => (
            <div key={item.title} className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
              <div className="px-5 py-3 bg-surface-container-high">
                <span className="text-xs font-mono font-bold text-on-surface-variant">{item.title}</span>
              </div>
              <pre className="p-5 text-sm font-mono text-secondary leading-loose overflow-x-auto">{item.code}</pre>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  "faq-fail": {
    title: "测试失败如何排查",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          测试失败（状态 FAILED）通常由模型格式问题、算子不兼容或精度校验不通过引起。以下是排查步骤。
        </p>
        <div className="space-y-4">
          {[
            { icon: "search", title: "查看错误日志", desc: "通过 CLI 获取详细错误信息，日志包含失败阶段（编译/推理/精度校验）和具体错误码。", code: "npubench logs task_a8f3d2e1b4c --level error" },
            { icon: "rule", title: "模型格式校验", desc: "在提交前本地验证 ONNX 模型格式合规性，提前发现算子版本或形状问题。", code: "npubench validate model.onnx --hardware NPU-X1-Gen2" },
            { icon: "bug_report", title: "常见错误代码", desc: "", code: "" },
          ].map((item, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 bg-surface-container-low">
                <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                <h3 className="font-headline font-bold text-on-surface">{item.title}</h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                {item.desc && <p className="text-sm text-on-surface-variant">{item.desc}</p>}
                {item.code && (
                  <div className="bg-surface-container rounded-xl overflow-hidden">
                    <pre className="p-4 text-xs font-mono text-secondary">{item.code}</pre>
                  </div>
                )}
                {item.title === "常见错误代码" && (
                  <div className="space-y-2 text-sm">
                    {[
                      ["E1001", "不支持的 ONNX opset 版本，请升级到 opset ≥ 13"],
                      ["E1002", "包含未知自定义算子，请注册算子库后重新提交"],
                      ["E2001", "推理时内存溢出，请减小 batch size 或选择内存更大的硬件"],
                      ["E3001", "精度指标超出允许阈值（> 2%），建议检查量化校准数据质量"],
                    ].map(([code, msg]) => (
                      <div key={code} className="flex gap-3">
                        <span className="font-mono text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded flex-shrink-0">{code}</span>
                        <span className="text-on-surface-variant">{msg}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  "faq-diff": {
    title: "结果差异分析",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          同一模型在不同提交或不同硬件间出现结果差异时，可通过以下方法定位原因。
        </p>
        <div className="space-y-4">
          {[
            { title: "驱动 / Runtime 版本差异", desc: "NPU Driver 或 ONNX Runtime 版本升级可能带来性能变化。查看任务详情中的软件栈快照，对比版本变更。" },
            { title: "热降频影响", desc: "长时间连续测试后芯片温度升高可能触发降频。建议复现时在非连续测试时段执行，或查看功耗曲线中是否有骤降。" },
            { title: "量化校准数据差异", desc: "INT8 量化的校准数据集不同会导致精度结果差异。平台固定使用标准校准集，但本地复现时需确保使用相同数据。" },
            { title: "批次大小设置", desc: "不同 batch size 对 NPU 并行效率影响显著。确保对比的两次提交使用相同的 batch_size 参数。" },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
              <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0 mt-0.5">info</span>
              <div>
                <h3 className="font-headline font-bold text-on-surface mb-1 text-sm">{item.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <div className="px-5 py-3 bg-surface-container-high">
            <span className="text-xs font-mono font-bold text-on-surface-variant">对比两次任务</span>
          </div>
          <pre className="p-5 text-sm font-mono text-secondary">{`npubench diff task_abc123 task_def456`}</pre>
        </div>
      </div>
    ),
  },
  "faq-quota": {
    title: "配额与限流说明",
    content: (
      <div className="space-y-6">
        <p className="text-on-surface-variant leading-relaxed">
          平台按账号等级设置资源配额，超出限制时请求会被排队或拒绝。
        </p>
        <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container-high">
                {["配额项目", "免费版", "专业版", "企业版"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-bold text-on-surface-variant text-xs uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {[
                ["每日任务数", "10", "200", "无限制"],
                ["并发任务数", "1", "5", "20"],
                ["模型文件大小", "500 MB", "5 GB", "无限制"],
                ["API 请求/分钟", "30", "300", "3000"],
                ["结果保留时间", "7 天", "90 天", "永久"],
              ].map(([item, free, pro, ent]) => (
                <tr key={item} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-5 py-3 text-on-surface font-medium">{item}</td>
                  <td className="px-5 py-3 text-on-surface-variant">{free}</td>
                  <td className="px-5 py-3 text-primary font-semibold">{pro}</td>
                  <td className="px-5 py-3 text-secondary font-semibold">{ent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-4">
          <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">info</span>
          <p className="text-sm text-on-surface-variant">超出配额时 API 返回 <code className="font-mono bg-surface-container px-1 rounded">429 Too Many Requests</code>，响应头 <code className="font-mono bg-surface-container px-1 rounded">Retry-After</code> 中包含重试等待时间。</p>
        </div>
      </div>
    ),
  },
};

const defaultContent = (title: string) => ({
  title,
  content: (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">article</span>
      <p className="text-on-surface-variant">该文档页面正在完善中，敬请期待。</p>
    </div>
  ),
});

export default function DocsPage() {
  const [activeId, setActiveId] = useState("qs-intro");
  const [search, setSearch] = useState("");

  const filteredSections = search.trim()
    ? docSections.map((s) => ({
        ...s,
        items: s.items.filter((it) => it.title.includes(search)),
      })).filter((s) => s.items.length > 0)
    : docSections;

  const activeDoc = docContents[activeId] ?? defaultContent(
    docSections.flatMap((s) => s.items).find((it) => it.id === activeId)?.title ?? "文档"
  );

  return (
    <div className="flex gap-8 items-start">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto space-y-1 pr-2">
        {/* Search */}
        <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-3 py-2 mb-4 focus-within:ring-2 focus-within:ring-primary-container">
          <span className="material-symbols-outlined text-outline text-base">search</span>
          <input
            className="bg-transparent border-none focus:outline-none text-sm font-body text-on-surface placeholder:text-outline w-full"
            placeholder="搜索文档..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredSections.map((section) => (
          <div key={section.id} className="space-y-0.5">
            <div className={`flex items-center gap-2 px-3 py-2 text-xs font-extrabold uppercase tracking-widest ${section.color}`}>
              <span className="material-symbols-outlined text-[16px]">{section.icon}</span>
              {section.title}
            </div>
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={`w-full text-left flex items-center justify-between px-4 py-2 rounded-xl text-sm transition-all ${
                  activeId === item.id
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                <span className="truncate">{item.title}</span>
                {item.badge && (
                  <span className="text-[9px] font-extrabold bg-primary text-on-primary px-1.5 py-0.5 rounded ml-2 flex-shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-base">menu_book</span>
          <span>文档</span>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="font-semibold text-on-surface">{activeDoc.title}</span>
        </div>

        {/* Article */}
        <article className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/10 min-h-[400px]">
          <h1 className="text-3xl font-headline font-extrabold text-on-surface mb-8 pb-4 border-b border-outline-variant/10">
            {activeDoc.title}
          </h1>
          {activeDoc.content}
        </article>

        {/* Mobile nav — category pills */}
        <div className="lg:hidden space-y-4">
          {docSections.map((section) => (
            <div key={section.id} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/10">
              <div className={`flex items-center gap-2 font-headline font-bold text-sm mb-3 ${section.color}`}>
                <span className="material-symbols-outlined text-base">{section.icon}</span>
                {section.title}
              </div>
              <div className="flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveId(item.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl transition-all ${
                      activeId === item.id
                        ? "bg-primary text-on-primary font-bold"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
