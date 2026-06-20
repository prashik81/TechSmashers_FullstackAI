import { NextResponse } from "next/server";

import { generateWithFallback, HF_MODELS } from "@/lib/huggingface";

const SOAP_PROMPT = (notes: string) =>
  `You are a clinical documentation assistant. Convert the following visit notes into a structured SOAP note with clear sections: Subjective, Objective, Assessment, and Plan. Use professional medical language. Do not invent findings not present in the notes.

Visit notes:
${notes}

SOAP note:`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";

    if (!notes) {
      return NextResponse.json(
        { error: "Clinical notes are required." },
        { status: 400 }
      );
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json(
        {
          error:
            "HUGGINGFACE_API_KEY is not configured. Add it to .env.local to enable AI generation.",
        },
        { status: 503 }
      );
    }

    const { text, model } = await generateWithFallback(
      HF_MODELS.medical,
      HF_MODELS.general,
      SOAP_PROMPT(notes),
      { maxNewTokens: 768, temperature: 0.25 }
    );

    return NextResponse.json({ output: text, model });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate SOAP note.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
