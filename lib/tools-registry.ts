export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  inputLabel: string;
  outputLabel: string;
  placeholder: string;
  category: string;
  tags: string[];
  rating: number;
  usage: number;
  isNew?: boolean;
}

export const toolsRegistry: Record<string, Tool> = {
  summarizer: {
    id: "summarizer",
    name: "文本摘要",
    description: "将长文本压缩为简洁摘要，保留核心信息",
    icon: "summarize",
    inputLabel: "输入文本",
    outputLabel: "摘要结果",
    placeholder: "在此粘贴或输入需要摘要的文本...",
    category: "Writing",
    tags: ["摘要", "文本", "压缩"],
    rating: 4.5,
    usage: 15200,
  },
  "ui-generator": {
    id: "ui-generator",
    name: "UI 自动生成",
    description: "描述你想要的界面，自动生成 Tailwind HTML 代码",
    icon: "auto_awesome",
    inputLabel: "生成 UI",
    outputLabel: "生成结果",
    placeholder: "描述你想要的 UI，例如：一个登录表单，包含邮箱输入框、密码输入框和提交按钮...",
    category: "Design",
    tags: ["UI", "前端", "HTML"],
    rating: 4.9,
    usage: 9870,
    isNew: true,
  },
  translator: {
    id: "translator",
    name: "智能翻译",
    description: "中英文双向智能翻译，保留语境与语气",
    icon: "translate",
    inputLabel: "开始翻译",
    outputLabel: "翻译结果",
    placeholder: "输入需要翻译的文本，支持中英双向...",
    category: "Writing",
    tags: ["翻译", "语言", "中英互译"],
    rating: 4.7,
    usage: 8320,
  },
  "code-reviewer": {
    id: "code-reviewer",
    name: "代码审查",
    description: "分析代码质量，发现 Bug 并给出优化建议",
    icon: "code_blocks",
    inputLabel: "开始审查",
    outputLabel: "审查报告",
    placeholder: "粘贴需要审查的代码...",
    category: "Code",
    tags: ["代码", "审查", "优化"],
    rating: 4.8,
    usage: 5140,
    isNew: true,
  },
  "email-writer": {
    id: "email-writer",
    name: "邮件撰写",
    description: "根据要点快速生成专业邮件草稿",
    icon: "mail",
    inputLabel: "生成邮件",
    outputLabel: "邮件草稿",
    placeholder: "描述邮件的主要内容、收件人和目的...",
    category: "Writing",
    tags: ["邮件", "写作", "商务"],
    rating: 4.6,
    usage: 12450,
  },
};

export function getTool(id: string): Tool | undefined {
  return toolsRegistry[id];
}

export function getAllTools(): Tool[] {
  return Object.values(toolsRegistry);
}
