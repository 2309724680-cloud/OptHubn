export const currentUser = {
  name: "小陈",
  role: "AI Systems Engineer · NPU Optimization Specialist",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC8SCOcTAIk0OyIQB4njhh1zQ3x3N51Uc1HcdgIRlumy_UHLtROgJMwX8H9qI7uUe8qsoYBuagnPtG1i51L1TI7Pv8L6jMAN3F_g2vYL435k-TNPgtSrogkmtMaRKA1jM7gfc2Rhp3BOmSXnctCkd5esIFt8zSNddb6taWaUvmrYPZQCZoBEYCYpoh7vLqYnDoj0RyOwZRfowdkxfxy60sRYFxmb2KiyFBs5HSASpXSmWi8m9MRXa07hPFK-P1N5cvwfvQBeHLfidA",
  stats: { submitted: 18, benchmarks: 342 },
};

export const npuStats = {
  models: 246,
  solutions: 1832,
  tests: 48291,
};

export const exploreCategories = [
  {
    id: "audio",
    label: "Audio",
    icon: "surround_sound",
    description: "STT, TTS, Noise Suppression",
    variant: "light" as const,
  },
  {
    id: "multimodal",
    label: "Multimodal",
    icon: "view_quilt",
    description: "Vision-Language, RAG",
    variant: "dark" as const,
  },
  {
    id: "ai4s",
    label: "AI4S",
    icon: "science",
    description: "Scientific Computing",
    variant: "light" as const,
  },
  {
    id: "embodied",
    label: "Embodied AI",
    icon: "precision_manufacturing",
    description: "Robotics & Sensing",
    variant: "light" as const,
  },
];

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
  tags: string[];
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
    tags: ["Audio", "INT8", "NPU"],
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
    tags: ["Vision", "FP16", "Diffusion"],
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
    tags: ["LLM", "INT4", "Transformer"],
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
    tags: ["Detection", "INT8", "Edge"],
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
    tags: ["LLM", "Chinese", "INT4"],
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
    tags: ["Multimodal", "FP16", "SAM"],
  },
];

export const profileSettingsGrid = [
  { id: "1", icon: "manage_accounts", label: "Account", description: "Profile, security, details" },
  { id: "2", icon: "shield_person", label: "Privacy", description: "Data sharing, visibility" },
  { id: "3", icon: "notifications", label: "Notifications", description: "Push, email, alerts" },
  { id: "4", icon: "help_center", label: "Help", description: "FAQ, contact, guides" },
];
