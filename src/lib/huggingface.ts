const HF_API_BASE = "https://api-inference.huggingface.co/models";

export const HF_MODELS = {
  medical: "epfl-llm/meditron-7b",
  general: "meta-llama/Meta-Llama-3.1-8B-Instruct",
} as const;

interface HFGenerateOptions {
  maxNewTokens?: number;
  temperature?: number;
}

function getApiKey(): string | undefined {
  return process.env.HUGGINGFACE_API_KEY;
}

export async function generateText(
  model: string,
  prompt: string,
  options: HFGenerateOptions = {}
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY is not configured");
  }

  const { maxNewTokens = 512, temperature = 0.3 } = options;

  const response = await fetch(`${HF_API_BASE}/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: maxNewTokens,
        temperature,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HF API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  if (Array.isArray(data) && data[0]?.generated_text) {
    return String(data[0].generated_text).trim();
  }

  if (typeof data === "object" && data !== null && "generated_text" in data) {
    return String((data as { generated_text: string }).generated_text).trim();
  }

  if (typeof data === "string") {
    return data.trim();
  }

  throw new Error("Unexpected response format from Hugging Face API");
}

export async function generateWithFallback(
  primaryModel: string,
  fallbackModel: string,
  prompt: string,
  options?: HFGenerateOptions
): Promise<{ text: string; model: string }> {
  try {
    const text = await generateText(primaryModel, prompt, options);
    return { text, model: primaryModel };
  } catch {
    const text = await generateText(fallbackModel, prompt, options);
    return { text, model: fallbackModel };
  }
}
