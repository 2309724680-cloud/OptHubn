import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function reviewCode(input: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `你是一个资深代码审查员。请审查以下代码，指出潜在的 Bug、性能问题和改进建议，用中文回答，结构化输出：\n\n${input}`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return block.text;
}
