import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function generateUI(input: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `你是一个前端 UI 代码生成器。根据以下描述，生成一段使用 Tailwind CSS 的 HTML 代码片段。只输出 HTML 代码，不要包含任何解释或 markdown 代码块标记。\n\n需求：${input}`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return block.text;
}
