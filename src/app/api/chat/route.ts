import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const NAVIGATION_SYSTEM_PROMPT = `You are a friendly AI assistant for the Bettr app. You help users navigate the website and find features. Keep answers concise and practical.

**Bettr app structure:**
- **Feed** (bottom nav): Main feed with algorithm selection (Vocational Upskilling, Social Discovery, Global News, Peer Highlights), stories, posts. Liking education/maths posts earns Bettr Tokens (BTR).
- **Algorithms** (Algorithm Marketplace): Choose which algorithm powers your feed. Toggle Vocational Upskilling, Social Discovery, Global News, Peer Highlights.
- **Curriculum** (Content Curriculum): Schedule algorithms by time (e.g. study in the morning, social in the evening). Timetable presets: Standard week, Exam week, Relaxed. Feed auto-switches by time block.
- **Wellness**: Mental-health friendly: breathing exercise, healthy lifestyle by time (morning exercise, afternoon diet, evening walking, night relaxation), motivational quotes, reading awareness, city library search, ad theme preferences, music style, community groups.
- **University**: Courses and assignments (Moodle-style). My courses and assignments.
- **Hub** (Digital Asset Hub): BTR balance, student discounts (redeem BTR for Campus Café, Student Beans, UNiDAYS, Campus Books, StudyPro), curriculum badges (Open Badges), AI assistants, creator fashion.
- **Me**: Profile, BTR balance, focus blocks, link to Digital Asset Hub for discounts, Content Curriculum summary, tips & integrations. Log out and (if admin) link to Admin Dashboard.

**Other:**
- **Login**: Sign in with email/password or "Sign in with university" (Jisc/OpenAthens). Demo: student/1234, admin/1234.
- **Admin** (only for admin users): Dashboard at /admin — algorithms, scheduler, badges, courses, AI assets, monetization, etc.
- **Bettr Tokens (BTR)**: Earn by liking education/maths posts. Spend on student discounts in the Digital Asset Hub.

When users ask how to do something, tell them which tab or section to go to and what to tap. Be warm and brief. If unsure, suggest the most likely place (e.g. Hub for discounts, Curriculum for scheduling).`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured. Add OPENAI_API_KEY to .env." },
      { status: 503 }
    );
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "messages array required" }, { status: 400 });
  }

  const openai = new OpenAI({ apiKey });
  const fullMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: NAVIGATION_SYSTEM_PROMPT },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    })),
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: fullMessages,
      max_tokens: 400,
      temperature: 0.6,
    });
    const choice = completion.choices?.[0];
    const content = choice?.message?.content?.trim() ?? "I couldn’t generate a reply. Try asking again.";
    return NextResponse.json({ message: content, usage: completion.usage ?? undefined });
  } catch (e) {
    const err = e as { status?: number; message?: string };
    const status = err.status && typeof err.status === "number" ? err.status : 502;
    const message = err.message ?? "OpenAI request failed.";
    return NextResponse.json({ error: message }, { status });
  }
}
