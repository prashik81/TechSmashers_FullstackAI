import { NextResponse } from "next/server";

import { generateText, HF_MODELS } from "@/lib/huggingface";

const SYSTEM_CONTEXT =
  "You are a helpful Hospital 2050 patient care assistant. Answer questions about visiting hours, medications, appointments, and general hospital care. Be empathetic and concise. Always remind users that for emergencies they should call 911. Do not provide specific medical diagnoses.";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json(
        {
          error:
            "HUGGINGFACE_API_KEY is not configured. Add it to .env.local to enable AI chat.",
        },
        { status: 503 }
      );
    }

    const prompt = `${SYSTEM_CONTEXT}

Patient question: ${message}

Assistant response:`;

    const reply = await generateText(HF_MODELS.general, prompt, {
      maxNewTokens: 256,
      temperature: 0.4,
    });

    return NextResponse.json({ reply, model: HF_MODELS.general });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate response.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
