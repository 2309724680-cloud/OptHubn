import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  return NextResponse.json({ summary: "AI Summary: " + text.slice(0, 50) });
}
