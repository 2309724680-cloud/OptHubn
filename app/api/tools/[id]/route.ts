import { NextRequest, NextResponse } from "next/server";
import { getTool } from "@/lib/tools-registry";
import { summarize } from "@/lib/tools/summarizer";
import { generateUI } from "@/lib/tools/ui-generator";
import { translate } from "@/lib/tools/translator";
import { reviewCode } from "@/lib/tools/code-reviewer";
import { writeEmail } from "@/lib/tools/email-writer";

const handlers: Record<string, (input: string) => Promise<string>> = {
  summarizer: summarize,
  "ui-generator": generateUI,
  translator: translate,
  "code-reviewer": reviewCode,
  "email-writer": writeEmail,
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!getTool(id) || !handlers[id]) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }

  const { input } = await req.json();
  if (!input || typeof input !== "string") {
    return NextResponse.json({ error: "input is required" }, { status: 400 });
  }

  const output = await handlers[id](input);
  return NextResponse.json({ output, toolId: id });
}
