export const currentUser = {
  name: "小陈",
  role: "AI Systems Engineer · NPU Optimization Specialist",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC8SCOcTAIk0OyIQB4njhh1zQ3x3N51Uc1HcdgIRlumy_UHLtROgJMwX8H9qI7uUe8qsoYBuagnPtG1i51L1TI7Pv8L6jMAN3F_g2vYL435k-TNPgtSrogkmtMaRKA1jM7gfc2Rhp3BOmSXnctCkd5esIFt8zSNddb6taWaUvmrYPZQCZoBEYCYpoh7vLqYnDoj0RyOwZRfowdkxfxy60sRYFxmb2KiyFBs5HSASpXSmWi8m9MRXa07hPFK-P1N5cvwfvQBeHLfidA",
  stats: { submitted: 18, benchmarks: 342 },
};

export const npuStats = {
  models: 486,
  solutions: 1832,
  tests: 48291,
};

export const exploreCategories = [
  {
    id: "audio",
    label: "语音",
    icon: "keyboard_voice",
    description: "端到端语音识别与合成，专注于 ASR/TTS 模型在边缘端的实时性测试。",
    modelCount: 124,
    variant: "light" as const,
  },
  {
    id: "multimodal",
    label: "多模态",
    icon: "view_in_ar",
    description: "视觉与文本的跨界融合，评估大型 Vision-Language 模型推理效率。",
    modelCount: 89,
    variant: "light" as const,
  },
  {
    id: "ai4s",
    label: "AI4S",
    icon: "science",
    description: "科学计算加速，涵盖蛋白质折叠、气象预测等前沿科研模型。",
    modelCount: 56,
    variant: "light" as const,
  },
  {
    id: "embodied",
    label: "具身智能",
    icon: "smart_toy",
    description: "机器人实时决策感知，针对复杂闭环任务下的推理延迟深度分析。",
    modelCount: 72,
    variant: "light" as const,
  },
];

export interface HardwareBenchmark {
  hardware: string;
  latencyMs: number;
  throughput: number;
  throughputUnit: string;
  speedupVsCpu: number;
  powerW: number;
  status: "PASSED" | "FAILED" | "RUNNING";
}

export interface ThroughputPoint {
  date: string;
  value: number;
}

export interface AccuracyMetric {
  name: string;
  value: string;
  delta?: string;
  positive?: boolean;
}

export interface NpuModel {
  id: string;
  name: string;
  category: string;
  quant: string;
  metric1Label: string;
  metric1Value: string;
  metric2Label: string;
  metric2Value: string;
  detail1Icon: string;
  detail1Text: string;
  detail2Icon: string;
  detail2Text: string;
  imageUrl: string;
  iconName: string;
  iconBg: string;
  tags: string[];
  // Detail page fields
  description?: string;
  framework?: string;
  topology?: string;
  submitter?: string;
  submitDate?: string;
  version?: string;
  license?: string;
  hardwareBenchmarks?: HardwareBenchmark[];
  throughputHistory?: ThroughputPoint[];
  accuracyMetrics?: AccuracyMetric[];
}

export const recentModels: NpuModel[] = [
  {
    id: "1",
    name: "Whisper-Large-v3",
    category: "Audio Recognition",
    quant: "INT8",
    metric1Label: "Latency",
    metric1Value: "124ms",
    metric2Label: "Throughput",
    metric2Value: "84 fps",
    detail1Icon: "memory",
    detail1Text: "Target Hardware: NPU-X1 Gen2",
    detail2Icon: "verified",
    detail2Text: "Validated by Intel AI Labs",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUVoH8ciyBPsHWBmft0LMbv9LxgareT5Oltnyd_oGVhfUVj6NX128XwEcv_xPkt0I7xUjPqX8tfUrG3kWRW3_V9-eN4P7d0NsYbt31YdurFqX2kJ5fgDiy_5J9UPVEjSi2Fz6W44vmQ4KMgKiDT-nHjOnpc74hM6fC8vu_IzVYMsE-9BhasDTCQWqLdnJ7bPA77E8u_6RdPwJhEKZfFNfcG9v129UDGPJrPrioaCIb_m8w8BOurUfGKMnE1SMTxAg_ycpo7SF6BQ",
    iconName: "graphic_eq",
    iconBg: "bg-primary/10",
    tags: ["Audio", "INT8", "NPU", "ASR", "Edge"],
    description:
      "OpenAI Whisper Large v3 针对 NPU 推理深度优化，通过 INT8 量化将模型体积压缩 4x，同时保持 WER 损失低于 0.3%。支持 99 种语言实时转录，专为边缘部署场景设计。",
    framework: "ONNX Runtime 1.17",
    topology: "Transformer Encoder-Decoder",
    submitter: "Intel AI Labs",
    submitDate: "2024-03-15",
    version: "v3.1.0-npu",
    license: "Apache 2.0",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 124, throughput: 84, throughputUnit: "fps", speedupVsCpu: 14.2, powerW: 8.4, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 98, throughput: 107, throughputUnit: "fps", speedupVsCpu: 18.6, powerW: 12.1, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 210, throughput: 47, throughputUnit: "fps", speedupVsCpu: 8.1, powerW: 4.2, status: "PASSED" },
      { hardware: "R-SERIES 2024", latencyMs: 76, throughput: 138, throughputUnit: "fps", speedupVsCpu: 23.9, powerW: 18.6, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 1820, throughput: 5, throughputUnit: "fps", speedupVsCpu: 1.0, powerW: 65, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Oct", value: 61 },
      { date: "Nov", value: 68 },
      { date: "Dec", value: 72 },
      { date: "Jan", value: 78 },
      { date: "Feb", value: 81 },
      { date: "Mar", value: 84 },
    ],
    accuracyMetrics: [
      { name: "WER (LibriSpeech test-clean)", value: "2.7%", delta: "+0.3%", positive: false },
      { name: "WER (LibriSpeech test-other)", value: "5.2%", delta: "+0.4%", positive: false },
      { name: "RTF (Real-time Factor)", value: "0.08", delta: "−92%", positive: true },
      { name: "Model Size", value: "154 MB", delta: "−75%", positive: true },
    ],
  },
  {
    id: "2",
    name: "Stable Diffusion XL",
    category: "Generative Vision",
    quant: "FP16",
    metric1Label: "Iter Speed",
    metric1Value: "1.2s / it",
    metric2Label: "VRAM Usage",
    metric2Value: "7.2 GB",
    detail1Icon: "bolt",
    detail1Text: "Efficiency: 0.8 TOPS/W",
    detail2Icon: "schedule",
    detail2Text: "Test Date: Oct 24, 2023",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhmEfcIcpSsrBFnvXPNgQXNcmSNTsnn_xQ_jsYySQMZl1N4nGcMY7gw2hUkyVO4pmB_hAa6E_Xp_jWstgRjMoNANoVIrT15Usfa1lzLnxs8mL_AzLAN9ls60ExqFNqQWpUnAiVy4hqni6lF982iN93Ps_tMIRAxy8kl9JeP4SdYJw2hq_f-qYpLpM3kn5vec3WQ6b9ohO8BslK7y9be34RXrbmS8jl6OVVdWFDCw76GN_S-8MOEKM8ZyW7fFfKGUIKhrYrL6O8Xg",
    iconName: "auto_awesome",
    iconBg: "bg-secondary/10",
    tags: ["Vision", "FP16", "Diffusion", "Generative"],
    description:
      "Stable Diffusion XL 在 NPU 上通过 FP16 精度推理，结合 FlashAttention-2 加速注意力计算，实现单步去噪延迟较 CPU 降低 11x。支持 1024×1024 分辨率原生生成。",
    framework: "TensorRT 8.6",
    topology: "UNet + VAE + CLIP",
    submitter: "Stability AI",
    submitDate: "2024-01-08",
    version: "v1.0-npu-fp16",
    license: "CreativeML Open RAIL+M",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 1200, throughput: 0.83, throughputUnit: "it/s", speedupVsCpu: 7.5, powerW: 22, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 890, throughput: 1.12, throughputUnit: "it/s", speedupVsCpu: 10.1, powerW: 31, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 3400, throughput: 0.29, throughputUnit: "it/s", speedupVsCpu: 2.6, powerW: 9, status: "FAILED" },
      { hardware: "R-SERIES 2024", latencyMs: 640, throughput: 1.56, throughputUnit: "it/s", speedupVsCpu: 14.0, powerW: 45, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 8960, throughput: 0.11, throughputUnit: "it/s", speedupVsCpu: 1.0, powerW: 125, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Aug", value: 0.61 },
      { date: "Sep", value: 0.72 },
      { date: "Oct", value: 0.78 },
      { date: "Nov", value: 0.80 },
      { date: "Dec", value: 0.81 },
      { date: "Jan", value: 0.83 },
    ],
    accuracyMetrics: [
      { name: "FID Score (COCO val)", value: "23.4", delta: "+1.2", positive: false },
      { name: "CLIP Score", value: "32.1", delta: "−0.3", positive: false },
      { name: "Latency per step", value: "1.2s", delta: "−86%", positive: true },
      { name: "Peak Memory", value: "7.2 GB", delta: "−38%", positive: true },
    ],
  },
  {
    id: "3",
    name: "Llama-3-8B-Instruct",
    category: "Large Language",
    quant: "INT4",
    metric1Label: "Generation",
    metric1Value: "42 tok/s",
    metric2Label: "Accuracy Drop",
    metric2Value: "< 0.5%",
    detail1Icon: "layers",
    detail1Text: "Framework: ONNX Runtime",
    detail2Icon: "hub",
    detail2Text: "Topology: Transformer-Enc",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBScti5aZBGtb5l3xqH4_4ycIZ0TXkIg2fr7uLnLi9d-RTGr1FQufiMZWWSKxkRrEtZFuYkTfcaj93rYRpWaXOTYuYgg8TjPpKsoR0mkzs_Ny_ynt8yVNoult53ADvyp5fLkJ8m3QMIOVCkyrfMQUOZZxw2u5rEAtHj8yPzyAsTIgZaD3fWCYwpTH2OnhJy7lKbcqHyPEIczasnpKNkKXGqwt0f2F_6fGfWJ9gzZudE8CuCHfxeXCSRf33NBkk6CxXW-sxBbxYSiQ",
    iconName: "neurology",
    iconBg: "bg-primary/10",
    tags: ["LLM", "INT4", "Transformer", "Chat"],
    description:
      "Meta Llama 3 8B Instruct 经过 INT4 权重量化与 NPU KV-Cache 优化，在保持对话能力的前提下实现 22.8x CPU 加速比。支持 8K 上下文长度，适用于设备端私有化部署。",
    framework: "ONNX Runtime 1.17",
    topology: "Transformer Decoder-only",
    submitter: "Meta AI Research",
    submitDate: "2024-02-20",
    version: "v3.0-int4-npu",
    license: "Llama 3 Community License",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 24, throughput: 42, throughputUnit: "tok/s", speedupVsCpu: 22.8, powerW: 11, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 18, throughput: 55, throughputUnit: "tok/s", speedupVsCpu: 29.8, powerW: 15, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 48, throughput: 21, throughputUnit: "tok/s", speedupVsCpu: 11.4, powerW: 5.5, status: "PASSED" },
      { hardware: "R-SERIES 2024", latencyMs: 13, throughput: 78, throughputUnit: "tok/s", speedupVsCpu: 42.3, powerW: 22, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 548, throughput: 1.8, throughputUnit: "tok/s", speedupVsCpu: 1.0, powerW: 95, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Oct", value: 28 },
      { date: "Nov", value: 32 },
      { date: "Dec", value: 36 },
      { date: "Jan", value: 39 },
      { date: "Feb", value: 41 },
      { date: "Mar", value: 42 },
    ],
    accuracyMetrics: [
      { name: "MMLU (5-shot)", value: "68.2%", delta: "−0.4%", positive: false },
      { name: "HumanEval", value: "60.1%", delta: "−0.3%", positive: false },
      { name: "Generation Speed", value: "42 tok/s", delta: "+2180%", positive: true },
      { name: "Model Size", value: "4.8 GB", delta: "−70%", positive: true },
    ],
  },
];

export const allModels: NpuModel[] = [
  ...recentModels,
  {
    id: "4",
    name: "YOLOv9-E",
    category: "Object Detection",
    quant: "INT8",
    metric1Label: "mAP",
    metric1Value: "55.6%",
    metric2Label: "FPS",
    metric2Value: "120 fps",
    detail1Icon: "visibility",
    detail1Text: "Target: NPU-V2 Edge",
    detail2Icon: "verified",
    detail2Text: "Validated by ARM AI Lab",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUVoH8ciyBPsHWBmft0LMbv9LxgareT5Oltnyd_oGVhfUVj6NX128XwEcv_xPkt0I7xUjPqX8tfUrG3kWRW3_V9-eN4P7d0NsYbt31YdurFqX2kJ5fgDiy_5J9UPVEjSi2Fz6W44vmQ4KMgKiDT-nHjOnpc74hM6fC8vu_IzVYMsE-9BhasDTCQWqLdnJ7bPA77E8u_6RdPwJhEKZfFNfcG9v129UDGPJrPrioaCIb_m8w8BOurUfGKMnE1SMTxAg_ycpo7SF6BQ",
    iconName: "frame_inspect",
    iconBg: "bg-secondary/10",
    tags: ["Detection", "INT8", "Edge", "Vision"],
    description:
      "YOLOv9-E 经 INT8 量化后在 NPU 上实现实时目标检测，mAP 损失控制在 0.8% 以内。采用 PGI 可编程梯度信息架构，显著提升小目标检测精度。",
    framework: "TensorRT 8.6",
    topology: "CSP + PAN + Detection Head",
    submitter: "ARM AI Lab",
    submitDate: "2024-02-28",
    version: "v9-e-int8",
    license: "GPL-3.0",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 8, throughput: 120, throughputUnit: "fps", speedupVsCpu: 18.4, powerW: 7, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 6, throughput: 162, throughputUnit: "fps", speedupVsCpu: 24.9, powerW: 10, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 15, throughput: 67, throughputUnit: "fps", speedupVsCpu: 10.3, powerW: 3.8, status: "PASSED" },
      { hardware: "R-SERIES 2024", latencyMs: 4, throughput: 240, throughputUnit: "fps", speedupVsCpu: 36.9, powerW: 16, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 148, throughput: 6.5, throughputUnit: "fps", speedupVsCpu: 1.0, powerW: 85, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Oct", value: 88 },
      { date: "Nov", value: 98 },
      { date: "Dec", value: 106 },
      { date: "Jan", value: 112 },
      { date: "Feb", value: 118 },
      { date: "Mar", value: 120 },
    ],
    accuracyMetrics: [
      { name: "mAP@0.5 (COCO)", value: "55.6%", delta: "−0.8%", positive: false },
      { name: "mAP@0.5:0.95", value: "38.2%", delta: "−0.6%", positive: false },
      { name: "Inference FPS", value: "120", delta: "+1746%", positive: true },
      { name: "Model Size", value: "58 MB", delta: "−75%", positive: true },
    ],
  },
  {
    id: "5",
    name: "ChatGLM3-6B",
    category: "Large Language",
    quant: "INT4",
    metric1Label: "Generation",
    metric1Value: "38 tok/s",
    metric2Label: "Memory",
    metric2Value: "4.2 GB",
    detail1Icon: "translate",
    detail1Text: "Bilingual: CN/EN",
    detail2Icon: "hub",
    detail2Text: "Framework: TensorRT",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhmEfcIcpSsrBFnvXPNgQXNcmSNTsnn_xQ_jsYySQMZl1N4nGcMY7gw2hUkyVO4pmB_hAa6E_Xp_jWstgRjMoNANoVIrT15Usfa1lzLnxs8mL_AzLAN9ls60ExqFNqQWpUnAiVy4hqni6lF982iN93Ps_tMIRAxy8kl9JeP4SdYJw2hq_f-qYpLpM3kn5vec3WQ6b9ohO8BslK7y9be34RXrbmS8jl6OVVdWFDCw76GN_S-8MOEKM8ZyW7fFfKGUIKhrYrL6O8Xg",
    iconName: "forum",
    iconBg: "bg-primary/10",
    tags: ["LLM", "Chinese", "INT4", "Bilingual"],
    description:
      "清华智谱 ChatGLM3-6B 双语大模型，专为中英混合场景优化。INT4 量化后在 NPU 上实现高效推理，适合端侧私有知识库问答与代码辅助。",
    framework: "TensorRT 8.6",
    topology: "GLM Transformer",
    submitter: "Tsinghua THUDM",
    submitDate: "2024-01-22",
    version: "v3-int4-npu",
    license: "ChatGLM3 License",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 26, throughput: 38, throughputUnit: "tok/s", speedupVsCpu: 18.1, powerW: 10, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 20, throughput: 49, throughputUnit: "tok/s", speedupVsCpu: 23.3, powerW: 14, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 55, throughput: 18, throughputUnit: "tok/s", speedupVsCpu: 8.6, powerW: 5.1, status: "PASSED" },
      { hardware: "R-SERIES 2024", latencyMs: 15, throughput: 68, throughputUnit: "tok/s", speedupVsCpu: 32.4, powerW: 20, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 472, throughput: 2.1, throughputUnit: "tok/s", speedupVsCpu: 1.0, powerW: 95, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Oct", value: 25 },
      { date: "Nov", value: 29 },
      { date: "Dec", value: 33 },
      { date: "Jan", value: 36 },
      { date: "Feb", value: 37 },
      { date: "Mar", value: 38 },
    ],
    accuracyMetrics: [
      { name: "C-Eval (中文)", value: "58.1%", delta: "−0.6%", positive: false },
      { name: "MMLU (英文)", value: "61.4%", delta: "−0.5%", positive: false },
      { name: "Generation Speed", value: "38 tok/s", delta: "+1710%", positive: true },
      { name: "Model Size", value: "4.2 GB", delta: "−72%", positive: true },
    ],
  },
  {
    id: "6",
    name: "Segment Anything v2",
    category: "Multimodal",
    quant: "FP16",
    metric1Label: "IoU",
    metric1Value: "91.2%",
    metric2Label: "Latency",
    metric2Value: "48ms",
    detail1Icon: "content_cut",
    detail1Text: "Zero-shot segmentation",
    detail2Icon: "verified",
    detail2Text: "Validated by Meta AI",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBScti5aZBGtb5l3xqH4_4ycIZ0TXkIg2fr7uLnLi9d-RTGr1FQufiMZWWSKxkRrEtZFuYkTfcaj93rYRpWaXOTYuYgg8TjPpKsoR0mkzs_Ny_ynt8yVNoult53ADvyp5fLkJ8m3QMIOVCkyrfMQUOZZxw2u5rEAtHj8yPzyAsTIgZaD3fWCYwpTH2OnhJy7lKbcqHyPEIczasnpKNkKXGqwt0f2F_6fGfWJ9gzZudE8CuCHfxeXCSRf33NBkk6CxXW-sxBbxYSiQ",
    iconName: "layers",
    iconBg: "bg-secondary/10",
    tags: ["Multimodal", "FP16", "SAM", "Segmentation"],
    description:
      "Meta SAM 2 在 NPU 上通过 FP16 推理实现视频实时分割，支持零样本提示（点、框、掩码）。在 SA-V 数据集上达到 91.2% IoU，同时延迟降至 48ms。",
    framework: "ONNX Runtime 1.17",
    topology: "Image Encoder + Mask Decoder",
    submitter: "Meta AI Research",
    submitDate: "2024-03-01",
    version: "v2.0-fp16-npu",
    license: "Apache 2.0",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 48, throughput: 21, throughputUnit: "fps", speedupVsCpu: 12.6, powerW: 14, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 36, throughput: 28, throughputUnit: "fps", speedupVsCpu: 16.8, powerW: 19, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 112, throughput: 9, throughputUnit: "fps", speedupVsCpu: 5.4, powerW: 6.2, status: "PASSED" },
      { hardware: "R-SERIES 2024", latencyMs: 24, throughput: 42, throughputUnit: "fps", speedupVsCpu: 25.2, powerW: 28, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 605, throughput: 1.7, throughputUnit: "fps", speedupVsCpu: 1.0, powerW: 110, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Oct", value: 14 },
      { date: "Nov", value: 16 },
      { date: "Dec", value: 18 },
      { date: "Jan", value: 19 },
      { date: "Feb", value: 20 },
      { date: "Mar", value: 21 },
    ],
    accuracyMetrics: [
      { name: "IoU (SA-V val)", value: "91.2%", delta: "−0.5%", positive: false },
      { name: "J&F Score", value: "88.4%", delta: "−0.3%", positive: false },
      { name: "Inference FPS", value: "21", delta: "+1135%", positive: true },
      { name: "Peak Memory", value: "2.8 GB", delta: "−44%", positive: true },
    ],
  },
  {
    id: "7",
    name: "Qwen2.5-7B-Instruct",
    category: "Large Language",
    quant: "INT4",
    metric1Label: "Generation",
    metric1Value: "51 tok/s",
    metric2Label: "Memory",
    metric2Value: "3.8 GB",
    detail1Icon: "translate",
    detail1Text: "Bilingual: CN/EN",
    detail2Icon: "hub",
    detail2Text: "Framework: ONNX Runtime",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBScti5aZBGtb5l3xqH4_4ycIZ0TXkIg2fr7uLnLi9d-RTGr1FQufiMZWWSKxkRrEtZFuYkTfcaj93rYRpWaXOTYuYgg8TjPpKsoR0mkzs_Ny_ynt8yVNoult53ADvyp5fLkJ8m3QMIOVCkyrfMQUOZZxw2u5rEAtHj8yPzyAsTIgZaD3fWCYwpTH2OnhJy7lKbcqHyPEIczasnpKNkKXGqwt0f2F_6fGfWJ9gzZudE8CuCHfxeXCSRf33NBkw6CxXW-sxBbxYSiQ",
    iconName: "chat_bubble",
    iconBg: "bg-primary/10",
    tags: ["LLM", "Chinese", "INT4", "Qwen", "Instruct"],
    description:
      "阿里通义千问 Qwen2.5-7B 指令模型，INT4 量化后在 NPU 上实现高效中英双语推理。数学、代码、长上下文三项能力显著提升，支持 128K 上下文窗口，适合复杂任务的端侧部署。",
    framework: "ONNX Runtime 1.17",
    topology: "Transformer Decoder-only",
    submitter: "Alibaba DAMO Academy",
    submitDate: "2024-04-10",
    version: "v2.5-int4-npu",
    license: "Qwen License",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 20, throughput: 51, throughputUnit: "tok/s", speedupVsCpu: 27.1, powerW: 10, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 15, throughput: 66, throughputUnit: "tok/s", speedupVsCpu: 35.1, powerW: 14, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 44, throughput: 23, throughputUnit: "tok/s", speedupVsCpu: 12.2, powerW: 5.2, status: "PASSED" },
      { hardware: "R-SERIES 2024", latencyMs: 11, throughput: 91, throughputUnit: "tok/s", speedupVsCpu: 48.4, powerW: 21, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 542, throughput: 1.88, throughputUnit: "tok/s", speedupVsCpu: 1.0, powerW: 95, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Oct", value: 32 },
      { date: "Nov", value: 38 },
      { date: "Dec", value: 43 },
      { date: "Jan", value: 47 },
      { date: "Feb", value: 49 },
      { date: "Mar", value: 51 },
    ],
    accuracyMetrics: [
      { name: "MMLU (5-shot)", value: "74.2%", delta: "−0.3%", positive: false },
      { name: "GSM8K (数学)", value: "85.4%", delta: "−0.2%", positive: false },
      { name: "Generation Speed", value: "51 tok/s", delta: "+2615%", positive: true },
      { name: "Model Size", value: "3.8 GB", delta: "−76%", positive: true },
    ],
  },
  {
    id: "8",
    name: "MobileNetV4-Large",
    category: "Object Detection",
    quant: "INT8",
    metric1Label: "Top-1 Acc",
    metric1Value: "87.1%",
    metric2Label: "FPS",
    metric2Value: "892 fps",
    detail1Icon: "visibility",
    detail1Text: "ImageNet Top-1: 87.1%",
    detail2Icon: "bolt",
    detail2Text: "Efficiency: 12.4 TOPS/W",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUVoH8ciyBPsHWBmft0LMbv9LxgareT5Oltnyd_oGVhfUVj6NX128XwEcv_xPkt0I7xUjPqX8tfUrG3kWRW3_V9-eN4P7d0NsYbt31YdurFqX2kJ5fgDiy_5J9UPVEjSi2Fz6W44vmQ4KMgKiDT-nHjOnpc74hM6fC8vu_IzVYMsE-9BhasDTCQWqLdnJ7bPA77E8u_6RdPwJhEKZfFNfcG9v129UDGPJrPrioaCIb_m8w8BOurUfGKMnE1SMTxAg_ycpo7SF6BQ",
    iconName: "devices",
    iconBg: "bg-secondary/10",
    tags: ["Classification", "INT8", "Edge", "Mobile", "Efficient"],
    description:
      "Google MobileNetV4-Large 采用全新 Universal Inverted Bottleneck 架构，在 ImageNet Top-1 达到 87.1% 精度同时保持超低延迟。INT8 量化后在 NPU 上可达 892 FPS，是移动端视觉应用的首选骨干网络。",
    framework: "TensorRT 8.6",
    topology: "MobileNet + UIB Blocks",
    submitter: "Google Brain",
    submitDate: "2024-03-20",
    version: "v4-large-int8",
    license: "Apache 2.0",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 1, throughput: 892, throughputUnit: "fps", speedupVsCpu: 41.3, powerW: 5.2, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 1, throughput: 1180, throughputUnit: "fps", speedupVsCpu: 54.6, powerW: 7.1, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 3, throughput: 380, throughputUnit: "fps", speedupVsCpu: 17.6, powerW: 2.4, status: "PASSED" },
      { hardware: "R-SERIES 2024", latencyMs: 1, throughput: 1640, throughputUnit: "fps", speedupVsCpu: 75.9, powerW: 11, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 44, throughput: 21.6, throughputUnit: "fps", speedupVsCpu: 1.0, powerW: 65, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Oct", value: 620 },
      { date: "Nov", value: 700 },
      { date: "Dec", value: 760 },
      { date: "Jan", value: 820 },
      { date: "Feb", value: 860 },
      { date: "Mar", value: 892 },
    ],
    accuracyMetrics: [
      { name: "Top-1 (ImageNet)", value: "87.1%", delta: "−0.4%", positive: false },
      { name: "Top-5 (ImageNet)", value: "98.1%", delta: "−0.1%", positive: false },
      { name: "Inference FPS", value: "892", delta: "+4030%", positive: true },
      { name: "Model Size", value: "22 MB", delta: "−74%", positive: true },
    ],
  },
  {
    id: "9",
    name: "Whisper-Medium-v3",
    category: "Audio Recognition",
    quant: "FP16",
    metric1Label: "Latency",
    metric1Value: "68ms",
    metric2Label: "WER",
    metric2Value: "2.1%",
    detail1Icon: "keyboard_voice",
    detail1Text: "99-language ASR",
    detail2Icon: "verified",
    detail2Text: "Validated by OpenAI",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUVoH8ciyBPsHWBmft0LMbv9LxgareT5Oltnyd_oGVhfUVj6NX128XwEcv_xPkt0I7xUjPqX8tfUrG3kWRW3_V9-eN4P7d0NsYbt31YdurFqX2kJ5fgDiy_5J9UPVEjSi2Fz6W44vmQ4KMgKiDT-nHjOnpc74hM6fC8vu_IzVYMsE-9BhasDTCQWqLdnJ7bPA77E8u_6RdPwJhEKZfFNfcG9v129UDGPJrPrioaCIb_m8w8BOurUfGKMnE1SMTxAg_ycpo7SF6BQ",
    iconName: "mic_external_on",
    iconBg: "bg-primary/10",
    tags: ["Audio", "FP16", "ASR", "NPU", "Multilingual"],
    description:
      "OpenAI Whisper Medium v3 FP16 精度版本，在保留完整模型精度的前提下通过 Flash Attention 加速，延迟降至 68ms。相比 Large-v3 体积缩小 60%，适合对精度要求较高的在线语音转录场景。",
    framework: "ONNX Runtime 1.17",
    topology: "Transformer Encoder-Decoder",
    submitter: "OpenAI",
    submitDate: "2024-02-14",
    version: "v3-medium-fp16",
    license: "MIT",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 68, throughput: 148, throughputUnit: "fps", speedupVsCpu: 11.4, powerW: 7.2, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 52, throughput: 193, throughputUnit: "fps", speedupVsCpu: 14.9, powerW: 10.5, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 130, throughput: 77, throughputUnit: "fps", speedupVsCpu: 5.9, powerW: 3.8, status: "PASSED" },
      { hardware: "R-SERIES 2024", latencyMs: 38, throughput: 264, throughputUnit: "fps", speedupVsCpu: 20.3, powerW: 15, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 776, throughput: 13, throughputUnit: "fps", speedupVsCpu: 1.0, powerW: 65, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Oct", value: 110 },
      { date: "Nov", value: 122 },
      { date: "Dec", value: 132 },
      { date: "Jan", value: 140 },
      { date: "Feb", value: 145 },
      { date: "Mar", value: 148 },
    ],
    accuracyMetrics: [
      { name: "WER (LibriSpeech test-clean)", value: "2.1%", delta: "+0.1%", positive: false },
      { name: "WER (LibriSpeech test-other)", value: "4.6%", delta: "+0.2%", positive: false },
      { name: "RTF (Real-time Factor)", value: "0.046", delta: "−95%", positive: true },
      { name: "Model Size", value: "290 MB", delta: "−0%", positive: true },
    ],
  },
  {
    id: "10",
    name: "InternVL2-8B",
    category: "Multimodal",
    quant: "INT8",
    metric1Label: "MMBench",
    metric1Value: "81.7%",
    metric2Label: "Latency",
    metric2Value: "210ms",
    detail1Icon: "image_search",
    detail1Text: "Vision-Language Model",
    detail2Icon: "verified",
    detail2Text: "Validated by Shanghai AI Lab",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhmEfcIcpSsrBFnvXPNgQXNcmSNTsnn_xQ_jsYySQMZl1N4nGcMY7gw2hUkyVO4pmB_hAa6E_Xp_jWstgRjMoNANoVIrT15Usfa1lzLnxs8mL_AzLAN9ls60ExqFNqQWpUnAiVy4hqni6lF982iN93Ps_tMIRAxy8kl9JeP4SdYJw2hq_f-qYpLpM3kn5vec3WQ6b9ohO8BslK7y9be34RXrbmS8jl6OVVdWFDCw76GN_S-8MOEKM8ZyW7fFfKGUIKhrYrL6O8Xg",
    iconName: "image_search",
    iconBg: "bg-secondary/10",
    tags: ["Multimodal", "INT8", "VLM", "Vision", "Chinese"],
    description:
      "上海人工智能实验室 InternVL2-8B 多模态大模型，支持图文理解、图表分析、OCR 及视频问答。INT8 量化后在 NPU 实现 210ms 端到端响应，MMBench 得分 81.7% 超越同尺寸开源模型。",
    framework: "TensorRT 8.6",
    topology: "InternViT-300M + InternLM2-7B",
    submitter: "Shanghai AI Lab",
    submitDate: "2024-04-02",
    version: "v2-8b-int8-npu",
    license: "Apache 2.0",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 210, throughput: 4.8, throughputUnit: "req/s", speedupVsCpu: 9.2, powerW: 18, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 158, throughput: 6.3, throughputUnit: "req/s", speedupVsCpu: 12.1, powerW: 25, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 480, throughput: 2.1, throughputUnit: "req/s", speedupVsCpu: 4.0, powerW: 8, status: "PASSED" },
      { hardware: "R-SERIES 2024", latencyMs: 112, throughput: 8.9, throughputUnit: "req/s", speedupVsCpu: 17.1, powerW: 38, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 1932, throughput: 0.52, throughputUnit: "req/s", speedupVsCpu: 1.0, powerW: 125, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Oct", value: 2.8 },
      { date: "Nov", value: 3.4 },
      { date: "Dec", value: 3.9 },
      { date: "Jan", value: 4.3 },
      { date: "Feb", value: 4.6 },
      { date: "Mar", value: 4.8 },
    ],
    accuracyMetrics: [
      { name: "MMBench (EN)", value: "81.7%", delta: "−0.6%", positive: false },
      { name: "MMStar", value: "54.2%", delta: "−0.4%", positive: false },
      { name: "Latency", value: "210ms", delta: "−81%", positive: true },
      { name: "Model Size", value: "8.1 GB", delta: "−50%", positive: true },
    ],
  },
  {
    id: "11",
    name: "BERT-Large-Chinese",
    category: "Audio Recognition",
    quant: "INT8",
    metric1Label: "F1 Score",
    metric1Value: "95.4%",
    metric2Label: "Latency",
    metric2Value: "12ms",
    detail1Icon: "spellcheck",
    detail1Text: "NLP: NER / Classification",
    detail2Icon: "translate",
    detail2Text: "Chinese NLP Tasks",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBScti5aZBGtb5l3xqH4_4ycIZ0TXkIg2fr7uLnLi9d-RTGr1FQufiMZWWSKxkRrEtZFuYkTfcaj93rYRpWaXOTYuYgg8TjPpKsoR0mkzs_Ny_ynt8yVNoult53ADvyp5fLkJ8m3QMIOVCkyrfMQUOZZxw2u5rEAtHj8yPzyAsTIgZaD3fWCYwpTH2OnhJy7lKbcqHyPEIczasnpKNkKXGqwt0f2F_6fGfWJ9gzZudE8CuCHfxeXCSRf33NBkw6CxXW-sxBbxYSiQ",
    iconName: "translate",
    iconBg: "bg-primary/10",
    tags: ["NLP", "INT8", "BERT", "Chinese", "Classification"],
    description:
      "Google BERT-Large 中文版经 INT8 量化优化，专为命名实体识别、文本分类、情感分析等中文 NLP 任务设计。在 NPU 上实现 12ms 低延迟推理，CMRC 阅读理解 F1 达 95.4%，是工业级中文 NLP 流水线的高性价比选择。",
    framework: "ONNX Runtime 1.17",
    topology: "BERT Transformer Encoder",
    submitter: "Google Research",
    submitDate: "2024-01-30",
    version: "large-chinese-int8",
    license: "Apache 2.0",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 12, throughput: 820, throughputUnit: "req/s", speedupVsCpu: 22.7, powerW: 6.5, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 9, throughput: 1090, throughputUnit: "req/s", speedupVsCpu: 30.2, powerW: 9, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 28, throughput: 356, throughputUnit: "req/s", speedupVsCpu: 9.9, powerW: 3.2, status: "PASSED" },
      { hardware: "R-SERIES 2024", latencyMs: 6, throughput: 1680, throughputUnit: "req/s", speedupVsCpu: 46.5, powerW: 14, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 272, throughput: 36.1, throughputUnit: "req/s", speedupVsCpu: 1.0, powerW: 85, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Oct", value: 640 },
      { date: "Nov", value: 700 },
      { date: "Dec", value: 740 },
      { date: "Jan", value: 778 },
      { date: "Feb", value: 800 },
      { date: "Mar", value: 820 },
    ],
    accuracyMetrics: [
      { name: "CMRC F1", value: "95.4%", delta: "−0.3%", positive: false },
      { name: "CLUENER NER F1", value: "80.1%", delta: "−0.5%", positive: false },
      { name: "Inference Speed", value: "820 req/s", delta: "+2170%", positive: true },
      { name: "Model Size", value: "96 MB", delta: "−75%", positive: true },
    ],
  },
  {
    id: "12",
    name: "DepthAnything-V2-Large",
    category: "Multimodal",
    quant: "FP16",
    metric1Label: "AbsRel",
    metric1Value: "0.064",
    metric2Label: "FPS",
    metric2Value: "58 fps",
    detail1Icon: "panorama_horizontal",
    detail1Text: "Monocular Depth Estimation",
    detail2Icon: "verified",
    detail2Text: "Validated by HKU",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhmEfcIcpSsrBFnvXPNgQXNcmSNTsnn_xQ_jsYySQMZl1N4nGcMY7gw2hUkyVO4pmB_hAa6E_Xp_jWstgRjMoNANoVIrT15Usfa1lzLnxs8mL_AzLAN9ls60ExqFNqQWpUnAiVy4hqni6lF982iN93Ps_tMIRAxy8kl9JeP4SdYJw2hq_f-qYpLpM3kn5vec3WQ6b9ohO8BslK7y9be34RXrbmS8jl6OVVdWFDCw76GN_S-8MOEKM8ZyW7fFfKGUIKhrYrL6O8Xg",
    iconName: "landscape",
    iconBg: "bg-secondary/10",
    tags: ["Depth", "FP16", "Vision", "3D", "ViT"],
    description:
      "香港大学 DepthAnything V2 Large 单目深度估计模型，基于 ViT-L 骨干网络，在合成数据蒸馏下实现业界最优的零样本深度估计精度。FP16 量化后 NPU 上达 58 FPS，适用于自动驾驶、机器人导航及 AR 场景的实时深度感知。",
    framework: "ONNX Runtime 1.17",
    topology: "ViT-L + DPT Decoder",
    submitter: "HKU & TikTok",
    submitDate: "2024-03-28",
    version: "v2-large-fp16-npu",
    license: "Apache 2.0",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 17, throughput: 58, throughputUnit: "fps", speedupVsCpu: 15.4, powerW: 16, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 13, throughput: 76, throughputUnit: "fps", speedupVsCpu: 20.1, powerW: 22, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 42, throughput: 24, throughputUnit: "fps", speedupVsCpu: 6.3, powerW: 7, status: "PASSED" },
      { hardware: "R-SERIES 2024", latencyMs: 8, throughput: 124, throughputUnit: "fps", speedupVsCpu: 32.8, powerW: 31, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 262, throughput: 3.8, throughputUnit: "fps", speedupVsCpu: 1.0, powerW: 110, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Oct", value: 38 },
      { date: "Nov", value: 44 },
      { date: "Dec", value: 50 },
      { date: "Jan", value: 54 },
      { date: "Feb", value: 56 },
      { date: "Mar", value: 58 },
    ],
    accuracyMetrics: [
      { name: "AbsRel (NYUv2)", value: "0.064", delta: "+0.002", positive: false },
      { name: "δ1 (NYUv2)", value: "93.8%", delta: "−0.4%", positive: false },
      { name: "Inference FPS", value: "58", delta: "+1426%", positive: true },
      { name: "Model Size", value: "1.3 GB", delta: "−0%", positive: true },
    ],
  },
  {
    id: "14",
    name: "RT-DETR-X",
    category: "Object Detection",
    quant: "FP16",
    metric1Label: "mAP",
    metric1Value: "54.8%",
    metric2Label: "FPS",
    metric2Value: "74 fps",
    detail1Icon: "frame_inspect",
    detail1Text: "Real-Time Detection Transformer",
    detail2Icon: "verified",
    detail2Text: "Validated by Baidu",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUVoH8ciyBPsHWBmft0LMbv9LxgareT5Oltnyd_oGVhfUVj6NX128XwEcv_xPkt0I7xUjPqX8tfUrG3kWRW3_V9-eN4P7d0NsYbt31YdurFqX2kJ5fgDiy_5J9UPVEjSi2Fz6W44vmQ4KMgKiDT-nHjOnpc74hM6fC8vu_IzVYMsE-9BhasDTCQWqLdnJ7bPA77E8u_6RdPwJhEKZfFNfcG9v129UDGPJrPrioaCIb_m8w8BOurUfGKMnE1SMTxAg_ycpo7SF6BQ",
    iconName: "filter_center_focus",
    iconBg: "bg-secondary/10",
    tags: ["Detection", "FP16", "Transformer", "DETR", "Real-Time"],
    description:
      "百度 RT-DETR-X 实时检测变换器，首个打破 YOLO 系列垄断的 Transformer 实时目标检测模型。FP16 精度下 COCO mAP 达 54.8%，在 NPU-V2 Gen-4 上实现 74 FPS，无需 NMS 后处理，端到端推理更简洁。",
    framework: "TensorRT 8.6",
    topology: "HGNetV2 + Hybrid Encoder + RT Decoder",
    submitter: "Baidu PaddlePaddle",
    submitDate: "2024-03-05",
    version: "rtdetr-x-fp16-npu",
    license: "Apache 2.0",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 14, throughput: 74, throughputUnit: "fps", speedupVsCpu: 13.5, powerW: 19, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 10, throughput: 102, throughputUnit: "fps", speedupVsCpu: 18.5, powerW: 27, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 38, throughput: 26, throughputUnit: "fps", speedupVsCpu: 4.7, powerW: 8.5, status: "PASSED" },
      { hardware: "R-SERIES 2024", latencyMs: 6, throughput: 168, throughputUnit: "fps", speedupVsCpu: 30.5, powerW: 42, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 190, throughput: 5.5, throughputUnit: "fps", speedupVsCpu: 1.0, powerW: 125, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Oct", value: 52 },
      { date: "Nov", value: 58 },
      { date: "Dec", value: 63 },
      { date: "Jan", value: 68 },
      { date: "Feb", value: 72 },
      { date: "Mar", value: 74 },
    ],
    accuracyMetrics: [
      { name: "mAP@0.5:0.95 (COCO)", value: "54.8%", delta: "−0.3%", positive: false },
      { name: "mAP@0.5 (COCO)", value: "73.0%", delta: "−0.2%", positive: false },
      { name: "Inference FPS", value: "74", delta: "+1245%", positive: true },
      { name: "Model Size", value: "136 MB", delta: "−50%", positive: true },
    ],
  },
  {
    id: "15",
    name: "GR00T-N1 Robot Policy",
    category: "Embodied AI",
    quant: "FP16",
    metric1Label: "Task Success",
    metric1Value: "87.3%",
    metric2Label: "Latency",
    metric2Value: "24ms",
    detail1Icon: "precision_manufacturing",
    detail1Text: "Robot Manipulation Policy",
    detail2Icon: "smart_toy",
    detail2Text: "Real-time Control at 40Hz",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBScti5aZBGtb5l3xqH4_4ycIZ0TXkIg2fr7uLnLi9d-RTGr1FQufiMZWWSKxkRrEtZFuYkTfcaj93rYRpWaXOTYuYgg8TjPpKsoR0mkzs_Ny_ynt8yVNoult53ADvyp5fLkJ8m3QMIOVCkyrfMQUOZZxw2u5rEAtHj8yPzyAsTIgZaD3fWCYwpTH2OnhJy7lKbcqHyPEIczasnpKNkKXGqwt0f2F_6fGfWJ9gzZudE8CuCHfxeXCSRf33NBkw6CxXW-sxBbxYSiQ",
    iconName: "precision_manufacturing",
    iconBg: "bg-tertiary/10",
    tags: ["Embodied", "FP16", "Robot", "Policy", "Real-Time"],
    description:
      "NVIDIA GR00T-N1 通用机器人基础策略模型，基于 Diffusion Transformer 架构，支持多任务机械臂操控。FP16 推理延迟 24ms 满足 40Hz 控制频率要求，任务成功率 87.3%，跨场景泛化能力业界领先。",
    framework: "TensorRT 8.6",
    topology: "Diffusion Transformer + Action Head",
    submitter: "NVIDIA Research",
    submitDate: "2024-04-18",
    version: "n1-fp16-npu",
    license: "NVIDIA Open Model License",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 24, throughput: 41, throughputUnit: "Hz", speedupVsCpu: 19.6, powerW: 14, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 18, throughput: 55, throughputUnit: "Hz", speedupVsCpu: 26.2, powerW: 19, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 56, throughput: 18, throughputUnit: "Hz", speedupVsCpu: 8.6, powerW: 6, status: "PASSED" },
      { hardware: "R-SERIES 2024", latencyMs: 12, throughput: 82, throughputUnit: "Hz", speedupVsCpu: 39.0, powerW: 28, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 469, throughput: 2.1, throughputUnit: "Hz", speedupVsCpu: 1.0, powerW: 95, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Oct", value: 28 },
      { date: "Nov", value: 32 },
      { date: "Dec", value: 36 },
      { date: "Jan", value: 38 },
      { date: "Feb", value: 40 },
      { date: "Mar", value: 41 },
    ],
    accuracyMetrics: [
      { name: "Task Success Rate", value: "87.3%", delta: "−1.2%", positive: false },
      { name: "Grasp Success", value: "92.1%", delta: "−0.8%", positive: false },
      { name: "Control Frequency", value: "41 Hz", delta: "+1852%", positive: true },
      { name: "Model Size", value: "3.2 GB", delta: "−50%", positive: true },
    ],
  },
  {
    id: "16",
    name: "CosyVoice2-TTS",
    category: "Audio Recognition",
    quant: "INT8",
    metric1Label: "MOS Score",
    metric1Value: "4.31",
    metric2Label: "RTF",
    metric2Value: "0.032",
    detail1Icon: "record_voice_over",
    detail1Text: "Zero-shot TTS Synthesis",
    detail2Icon: "verified",
    detail2Text: "Validated by Alibaba DAMO",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUVoH8ciyBPsHWBmft0LMbv9LxgareT5Oltnyd_oGVhfUVj6NX128XwEcv_xPkt0I7xUjPqX8tfUrG3kWRW3_V9-eN4P7d0NsYbt31YdurFqX2kJ5fgDiy_5J9UPVEjSi2Fz6W44vmQ4KMgKiDT-nHjOnpc74hM6fC8vu_IzVYMsE-9BhasDTCQWqLdnJ7bPA77E8u_6RdPwJhEKZfFNfcG9v129UDGPJrPrioaCIb_m8w8BOurUfGKMnE1SMTxAg_ycpo7SF6BQ",
    iconName: "record_voice_over",
    iconBg: "bg-primary/10",
    tags: ["TTS", "INT8", "Audio", "Zero-shot", "Chinese"],
    description:
      "阿里达摩院 CosyVoice2 零样本语音合成模型，支持 3 秒参考音频克隆任意说话人音色，中英双语自然度 MOS 达 4.31。INT8 量化后实时率 RTF=0.032，单 NPU 可同时处理 30+ 路并发语音合成流。",
    framework: "ONNX Runtime 1.17",
    topology: "Flow Matching + Vocoder",
    submitter: "Alibaba DAMO Academy",
    submitDate: "2024-04-08",
    version: "v2-int8-npu",
    license: "Apache 2.0",
    hardwareBenchmarks: [
      { hardware: "NPU-X1 Gen2", latencyMs: 32, throughput: 31, throughputUnit: "streams", speedupVsCpu: 16.8, powerW: 9, status: "PASSED" },
      { hardware: "NPU-V2 Gen-4", latencyMs: 24, throughput: 41, throughputUnit: "streams", speedupVsCpu: 22.2, powerW: 13, status: "PASSED" },
      { hardware: "EDGE-NPU X1", latencyMs: 78, throughput: 13, throughputUnit: "streams", speedupVsCpu: 7.0, powerW: 4.5, status: "PASSED" },
      { hardware: "R-SERIES 2024", latencyMs: 16, throughput: 63, throughputUnit: "streams", speedupVsCpu: 34.1, powerW: 20, status: "PASSED" },
      { hardware: "CPU Baseline", latencyMs: 538, throughput: 1.86, throughputUnit: "streams", speedupVsCpu: 1.0, powerW: 85, status: "PASSED" },
    ],
    throughputHistory: [
      { date: "Oct", value: 20 },
      { date: "Nov", value: 24 },
      { date: "Dec", value: 27 },
      { date: "Jan", value: 29 },
      { date: "Feb", value: 30 },
      { date: "Mar", value: 31 },
    ],
    accuracyMetrics: [
      { name: "MOS (中文自然度)", value: "4.31", delta: "−0.04", positive: false },
      { name: "Speaker Similarity", value: "0.891", delta: "−0.012", positive: false },
      { name: "Real-Time Factor", value: "0.032", delta: "−97%", positive: true },
      { name: "Model Size", value: "312 MB", delta: "−75%", positive: true },
    ],
  },
];

export interface RecentRun {
  id: string;
  name: string;
  category: string;
  precision: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  latency: string;
  throughput: string;
  speedup: string;
  status: "PASSED" | "FAILED" | "RUNNING";
  hardware: string;
}

export const recentRuns: RecentRun[] = [
  {
    id: "r1",
    name: "Whisper-v3 Large",
    category: "Speech Recognition",
    precision: "FP16",
    iconName: "graphic_eq",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    latency: "42.5ms",
    throughput: "1.2k tokens/s",
    speedup: "14.2x",
    status: "PASSED",
    hardware: "NPU-V2 Gen-4",
  },
  {
    id: "r2",
    name: "LLaMA-3-8B-Instruct",
    category: "Generative AI",
    precision: "INT8",
    iconName: "neurology",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    latency: "18.2ms/tok",
    throughput: "54.9 tok/s",
    speedup: "22.8x",
    status: "PASSED",
    hardware: "EDGE-NPU X1",
  },
  {
    id: "r3",
    name: "YOLOv10-Medium",
    category: "Computer Vision",
    precision: "INT8",
    iconName: "filter_center_focus",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    latency: "3.4ms",
    throughput: "294 FPS",
    speedup: "35.1x",
    status: "PASSED",
    hardware: "R-SERIES 2024",
  },
];

export const profileSettingsGrid = [
  { id: "1", icon: "manage_accounts", label: "账号管理", description: "修改资料、密码", href: "/account" },
  { id: "2", icon: "leaderboard", label: "排行榜", description: "查看模型排名", href: "/leaderboard" },
  { id: "3", icon: "add_chart", label: "提交测试", description: "提交新的基准任务", href: "/submit" },
  { id: "4", icon: "menu_book", label: "文档", description: "使用指南与 API", href: "/docs" },
];
