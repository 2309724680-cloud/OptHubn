import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function summarize(input: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `请将以下文本压缩为简洁的摘要，保留核心信息，用中文回答：\n\n${input}`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return block.text;
}
