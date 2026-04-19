import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function writeEmail(input: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `你是一个专业邮件撰写助手。根据以下要求，生成一封专业的邮件草稿，用中文输出：\n\n${input}`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return block.text;
}
