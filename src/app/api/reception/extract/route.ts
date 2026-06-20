import { NextResponse } from "next/server";
import { generateText, HF_MODELS } from "@/lib/huggingface";

const EXTRACTION_PROMPT = (text: string) =>
  `You are an AI assistant designed to extract patient intake details from unstructured text. Extract the following fields as a JSON object:
- name: Full name
- email: Email address
- dob: Date of birth (format YYYY-MM-DD or similar)
- phone: Phone number
- address: Residential address
- insuranceProvider: Health insurance provider name
- policyNumber: Insurance policy/member number
- emergencyContact: Emergency contact name and/or phone

If any field is missing, set its value to "".
Return ONLY a valid JSON object. Do not include markdown code block formatting (like \`\`\`json) or extra text.

Unstructured text:
"${text}"

JSON Output:`;

// Regex-based fallback parser in case Hugging Face is unavailable or fails
function regexFallbackParse(text: string) {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const phoneRegex = /(\d{3}-\d{3}-\d{4}|\(\d{3}\)\s*\d{3}-\d{4}|\+?\d{1,2}\s*\d{3}-\d{3}-\d{4})/i;
  const dobRegex = /(\b\d{4}-\d{2}-\d{2}\b|\b\d{2}\/\d{2}\/\d{4}\b)/i;
  const policyRegex = /(policy|member|ID|number|#)?\s*:?\s*([A-Z0-9]{5,15})/i;
  
  // Clean names
  let name = "";
  const nameMatch = text.match(/(patient|name is|registering)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
  if (nameMatch) {
    name = nameMatch[2];
  } else {
    // Fallback: look for the first two capitalized words
    const capWords = text.match(/\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/);
    if (capWords && !/patient|hospital|doctor|nurse|receptionist|monday|tuesday|wednesday|thursday|friday|saturday|sunday/i.test(capWords[0])) {
      name = capWords[0];
    }
  }

  // Insurance
  let insuranceProvider = "";
  const insurances = ["Aetna", "Blue Cross", "Cigna", "United", "UnitedHealthcare", "Kaiser", "Humana", "Medicare", "Medicaid", "MetLife"];
  for (const ins of insurances) {
    if (new RegExp(ins, "i").test(text)) {
      insuranceProvider = ins;
      break;
    }
  }

  // Address
  let address = "";
  const addrMatch = text.match(/(\d+\s+[A-Za-z0-9\s,.]+?(St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Dr|Drive|Ln|Lane|Way|Ct|Court))/i);
  if (addrMatch) {
    address = addrMatch[1];
  }

  // Emergency contact
  let emergencyContact = "";
  const emergencyMatch = text.match(/(emergency contact|contact|spouse|wife|husband|mother|father|relative|friend)\s+(is\s+)?([A-Z][a-z]+(\s+[A-Z][a-z]+)?)(\s+at\s+)?(\d{3}-\d{3}-\d{4})?/i);
  if (emergencyMatch) {
    emergencyContact = emergencyMatch[3] + (emergencyMatch[6] ? ` (${emergencyMatch[6]})` : "");
  }

  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);
  const dobMatch = text.match(dobRegex);
  const policyMatch = text.match(policyRegex);

  return {
    name: name.trim(),
    email: emailMatch ? emailMatch[1].trim() : "",
    dob: dobMatch ? dobMatch[1].trim() : "",
    phone: phoneMatch ? phoneMatch[1].trim() : "",
    address: address.trim(),
    insuranceProvider: insuranceProvider.trim(),
    policyNumber: policyMatch ? policyMatch[2].trim() : "",
    emergencyContact: emergencyContact.trim(),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";

    if (!notes) {
      return NextResponse.json(
        { error: "Receptionist notes are required." },
        { status: 400 }
      );
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      // Fallback directly
      const parsed = regexFallbackParse(notes);
      return NextResponse.json({
        output: parsed,
        model: "Regex Parser Fallback (No HF API Key)",
      });
    }

    try {
      const responseText = await generateText(
        HF_MODELS.general,
        EXTRACTION_PROMPT(notes),
        { maxNewTokens: 350, temperature: 0.1 }
      );

      // Clean the response from markdown formatting if any
      let cleaned = responseText.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "");
      }
      cleaned = cleaned.trim();

      const parsed = JSON.parse(cleaned);
      return NextResponse.json({ output: parsed, model: HF_MODELS.general });
    } catch (err) {
      // If LLM or JSON parse fails, use regex fallback
      const parsed = regexFallbackParse(notes);
      return NextResponse.json({
        output: parsed,
        model: "Regex Parser Fallback (HF failed or JSON parse error)",
      });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to extract patient details.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
