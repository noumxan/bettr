import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPTS: Record<string, string> = {
  academic: `You are the Academic Mentor in the Bettr app (Bounty 6: AI Assistant & Digital Asset Marketplace). You are a specialized LLM agent for academic support. You understand students' university timetables and give study tips, resources, and guidance. Use LangGraph/CrewAI-style agentic workflows: be concise, practical, and step-oriented. Help with time management, note-taking, exam prep, and subject-specific questions. Mention Bettr features when relevant (e.g. Content Curriculum for scheduling study blocks, Hub for rewards). Keep replies focused and under 200 words.`,
  exam: `You are the Exam Prep Coach in the Bettr app (Bounty 6). You are a specialized LLM agent for exam revision and test preparation. Give concrete revision strategies, spaced repetition tips, past-paper advice, and stress management. Be concise and actionable. Reference study blocks and Curriculum when relevant. Keep replies under 200 words.`,
  nutrition: `You are the Nutrition Mentor in the Bettr app (Bounty 6). You are a specialized LLM agent for student wellness and nutrition. Give practical advice on healthy eating on a budget, meal prep, hydration, and energy for studying. Be supportive and non-judgmental. Mention Wellness tab and healthy lifestyle by time when relevant. Keep replies under 200 words.`,
  career: `You are the Career Advisor in the Bettr app (Bounty 6). You are a specialized LLM agent for vocational upskilling and career pathways. Help with CVs, interviews, skills mapping (e.g. ESCO), and learning paths. Be practical and encouraging. Reference Vocational Upskilling algorithm and Digital Asset Hub when relevant. Keep replies under 200 words.`,
  wellness: `You are a Wellness AI assistant in the Bettr app (Bounty 6). You support mental health, mindfulness, and balance. Give brief, calming advice and point to Bettr's Wellness tab (breathing, healthy lifestyle by time, community). Keep replies under 200 words.`,
};

const DEFAULT_SYSTEM = SYSTEM_PROMPTS.academic;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured. Add OPENAI_API_KEY to .env." },
      { status: 503 }
    );
  }

  let body: {
    assistantId?: string;
    assistantName?: string;
    skillFocus?: string;
    messages?: { role: string; content: string }[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "messages array required" }, { status: 400 });
  }

  const skillFocus = (body.skillFocus ?? "academic").toLowerCase();
  const systemPrompt = SYSTEM_PROMPTS[skillFocus] ?? DEFAULT_SYSTEM;
  const openai = new OpenAI({ apiKey });
  const fullMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    })),
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: fullMessages,
      max_tokens: 350,
      temperature: 0.6,
    });
    const choice = completion.choices?.[0];
    const content = choice?.message?.content?.trim() ?? "I couldn't generate a reply. Try again.";
    return NextResponse.json({ message: content, usage: completion.usage ?? undefined });
  } catch (e) {
    const err = e as { status?: number; message?: string };
    const status = err.status && typeof err.status === "number" ? err.status : 502;
    const message = err.message ?? "OpenAI request failed.";
    return NextResponse.json({ error: message }, { status });
  }
}
