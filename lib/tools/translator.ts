import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function translate(input: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `你是一个专业翻译。判断以下文本的语言，如果是中文则翻译成英文，如果是英文则翻译成中文。只输出翻译结果，不要解释。\n\n${input}`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return block.text;
}
