import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are a study and wellbeing coach inside the Bettr app (Content Curriculum). You help students manage their time and their relationship with social media algorithms.

Given their current timetable preset and optional goals, suggest a concrete weekly schedule: which algorithm (Vocational Upskilling, Social Discovery, Global News, Peer Highlights) to use in which time blocks. Be brief and actionable.

Presets:
- Normal schedule: balanced week, mix of study and social.
- Standard week: Vocational Upskilling mornings, Social Discovery evening.
- Exam week: more focus blocks, less social; extended study slots.
- Relaxed: more Social Discovery and Peer Highlights; lighter study.
- Intensive study: maximum Vocational Upskilling; minimal social.
- Balance: 50/50 study and social across the week.

Output format: list day + time range + algorithm name. Example: "Mon 9–12: Vocational Upskilling. Mon 18–22: Social Discovery." Keep under 150 words.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured." },
      { status: 503 }
    );
  }

  let body: { preset?: string; goals?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const preset = body.preset ?? "Standard week";
  const goals = body.goals ?? "";

  const openai = new OpenAI({ apiKey });
  const userPrompt = goals
    ? `Preset: ${preset}. My goals: ${goals}. Suggest a weekly timetable (day + time + algorithm).`
    : `Preset: ${preset}. Suggest a weekly timetable (day + time + algorithm).`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 300,
      temperature: 0.5,
    });
    const content = completion.choices?.[0]?.message?.content?.trim() ?? "Could not generate suggestion.";
    return NextResponse.json({ suggestion: content });
  } catch (e) {
    const err = e as { message?: string };
    return NextResponse.json({ error: err.message ?? "OpenAI request failed." }, { status: 502 });
  }
}
