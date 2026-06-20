import { NextResponse } from "next/server";

import { generateText, HF_MODELS } from "@/lib/huggingface";

interface AlertInput {
  id: string;
  patient: string;
  room: string;
  message: string;
  source: string;
  time: string;
}

const PRIORITY_PROMPT = (alerts: AlertInput[]) =>
  `You are a clinical alert prioritization system for hospital nurses. Analyze each alert and assign a priority level (critical, high, medium, or low) and an urgency score from 0-100.

Respond ONLY with valid JSON array, no markdown. Each object must have: id, priority, aiScore, reasoning (one short sentence).

Alerts:
${JSON.stringify(alerts, null, 2)}

JSON:`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const alerts = Array.isArray(body.alerts) ? body.alerts : [];

    if (alerts.length === 0) {
      return NextResponse.json(
        { error: "Alerts array is required." },
        { status: 400 }
      );
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json(
        {
          error:
            "HUGGINGFACE_API_KEY is not configured. Add it to .env.local to enable AI prioritization.",
        },
        { status: 503 }
      );
    }

    const raw = await generateText(
      HF_MODELS.general,
      PRIORITY_PROMPT(alerts),
      { maxNewTokens: 1024, temperature: 0.2 }
    );

    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI priority response.");
    }

    const prioritized = JSON.parse(jsonMatch[0]) as Array<{
      id: string;
      priority: string;
      aiScore: number;
      reasoning?: string;
    }>;

    return NextResponse.json({ prioritized, model: HF_MODELS.general });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to prioritize alerts.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
