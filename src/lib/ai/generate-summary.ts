import OpenAI from "openai";
import type { RawArticle } from "@/lib/rss/fetcher";
import type { IntensityTag, Category } from "@/lib/supabase/types";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

interface SummarizedArticle {
  headline: string;
  category: Category;
  intensityTag: IntensityTag;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  rawContent: string;
}

const SYSTEM_PROMPT = `You are an exasperated but loving partner translating complex tech/finance news for someone who doesn't follow this stuff.

Rules:
- Summarize in exactly 3 sentences
- Use ZERO jargon. If you must reference a technical concept, immediately explain it in parentheses using a relatable analogy
- Explain why people care, not the technical details
- Tone: Witty, slightly sarcastic about tech bros, but genuinely informative
- Reference "your partner" occasionally (e.g., "This is why your partner was fist-pumping at their laptop")
- Never be condescending to the reader

You must also:
- Write a punchy, clear headline (max 15 words) that a non-tech person would understand
- Assign an intensity tag: "WILD" (genuinely surprising), "HEATED" (controversial/dramatic), "MEH" (routine but noteworthy), or "BREAKING" (major development)

Respond ONLY with valid JSON in this exact format:
{
  "headline": "string",
  "intensityTag": "WILD" | "HEATED" | "MEH" | "BREAKING",
  "summary": "string (3 sentences)"
}`;

export async function generateSpouseSummary(
  article: RawArticle,
  tone: number = 3,
): Promise<SummarizedArticle> {
  const toneInstruction =
    tone <= 2
      ? "Be more factual and straightforward. Less sarcasm."
      : tone >= 4
        ? "Dial up the sarcasm and humor. Be extra witty."
        : "";

  const userPrompt = `${toneInstruction ? toneInstruction + "\n\n" : ""}Article title: ${article.title}
Source: ${article.sourceName}
Category: ${article.category}

Article content:
${article.content.slice(0, 3000)}`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as {
    headline: string;
    intensityTag: IntensityTag;
    summary: string;
  };

  return {
    headline: parsed.headline || article.title,
    category: article.category,
    intensityTag: parsed.intensityTag || "MEH",
    summary: parsed.summary || "Summary unavailable.",
    sourceUrl: article.link,
    sourceName: article.sourceName,
    rawContent: article.content.slice(0, 5000),
  };
}

const INTRO_SYSTEM_PROMPT = `You write the opening paragraph for a daily news briefing aimed at someone whose partner doom-scrolls tech/finance news.

Rules:
- 2-3 sentences max
- Warm, conversational, slightly self-aware tone
- Reference what kind of news day it was (busy, quiet, dramatic)
- Start with "Hi love" or a casual greeting
- Mention that their partner was glued to their phone if it was a big news day
- Never use jargon

Respond with ONLY the paragraph text, no quotes or formatting.`;

export async function generateIntroText(
  categories: Category[],
  articleCount: number,
): Promise<string> {
  const categoryLabels: Record<Category, string> = {
    ai: "AI/tech",
    crypto: "crypto",
    finance: "finance/markets",
    vc: "startup/VC",
  };

  const topicList = categories.map((c) => categoryLabels[c]).join(", ");

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: INTRO_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Today's briefing covers ${articleCount} stories across: ${topicList}. Generate the intro paragraph.`,
      },
    ],
    temperature: 0.9,
    max_tokens: 200,
  });

  return (
    response.choices[0]?.message?.content?.trim() ??
    "Hi love — here's what had your partner glued to their phone today."
  );
}
