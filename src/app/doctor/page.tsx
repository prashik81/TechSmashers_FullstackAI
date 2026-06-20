"use client";

import { useState } from "react";
import {
  Copy,
  FileText,
  Loader2,
  Mic,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SAMPLE_NOTES =
  "Patient is a 58-year-old male presenting with persistent cough for 2 weeks, low-grade fever, and mild shortness of breath. No chest pain. History of hypertension on lisinopril. Vitals: BP 138/86, HR 92, SpO2 94% on room air, temp 37.8°C. Lungs with scattered wheezes bilaterally.";

const SAMPLE_SOAP = `Subjective
58-year-old male with 2-week history of persistent cough, low-grade fever, and mild dyspnea. Denies chest pain. PMH: hypertension (lisinopril).

Objective
Vitals: BP 138/86, HR 92, SpO2 94% RA, Temp 37.8°C
Exam: Scattered bilateral wheezes, no accessory muscle use

Assessment
1. Acute bronchitis, likely viral
2. Hypertension — stable on current regimen

Plan
- Supportive care: rest, fluids, honey for cough
- Albuterol inhaler PRN for wheezing
- Return if fever >38.5°C, worsening dyspnea, or SpO2 <92%
- Follow-up in 1 week if symptoms persist`;

export default function DoctorPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateSoap = async () => {
    if (!notes.trim()) return;
    setLoading(true);
    setOutput("");
    setError(null);
    setModelUsed(null);

    try {
      const res = await fetch("/api/doctor/scribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 503) {
          setOutput(SAMPLE_SOAP);
          setModelUsed("Demo mode (add HUGGINGFACE_API_KEY)");
          return;
        }
        throw new Error(data.error ?? "Generation failed");
      }

      setOutput(data.output);
      setModelUsed(data.model ?? "Meditron / Llama 3.1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setOutput(SAMPLE_SOAP);
      setModelUsed("Fallback demo output");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setNotes(SAMPLE_NOTES);
    setOutput("");
    setError(null);
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-white p-6 sm:p-8">
        <Badge variant="secondary" className="mb-3 border border-blue-100 bg-white text-primary">
          <Stethoscope className="size-3" />
          Doctor Module
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Doctor AI Scribe
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Enter visit notes or dictation transcript. AI generates structured
          SOAP documentation using Meditron with Llama 3.1 fallback.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-blue-100/80 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Visit Notes
            </CardTitle>
            <CardDescription>
              Type or paste raw clinical notes from the patient encounter.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Clinical notes</Label>
              <Textarea
                id="notes"
                placeholder="e.g. Patient presents with..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={12}
                className="resize-none border-blue-100 bg-white font-mono text-sm focus-visible:ring-primary/30"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={generateSoap} disabled={!notes.trim() || loading}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Generate SOAP Note
                  </>
                )}
              </Button>
              <Button variant="outline" className="border-blue-200" onClick={loadSample}>
                Load sample
              </Button>
              <Button variant="ghost" disabled title="Coming soon">
                <Mic className="size-4" />
                Voice input
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  Generated Documentation
                </CardTitle>
                <CardDescription>
                  Structured SOAP note output from AI scribe.
                </CardDescription>
              </div>
              {output && (
                <Button variant="outline" size="sm" className="border-blue-200" onClick={copyOutput}>
                  <Copy className="size-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
            </div>
            {modelUsed && (
              <Badge variant="outline" className="mt-2 w-fit border-blue-200 text-xs text-muted-foreground">
                {modelUsed}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {error && (
              <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {error} — showing demo output.
              </p>
            )}
            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-blue-200 bg-blue-50/50 text-muted-foreground">
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="text-sm">Meditron is structuring your notes...</p>
              </div>
            ) : output ? (
              <div className="max-h-[420px] overflow-y-auto rounded-lg border border-blue-100 bg-white p-4">
                {output.split("\n").map((line, i) => (
                  <p
                    key={i}
                    className={
                      line.match(/^(Subjective|Objective|Assessment|Plan)/i)
                        ? "mt-3 font-semibold text-primary first:mt-0"
                        : "text-sm leading-relaxed text-foreground"
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-blue-200 bg-blue-50/30 text-center text-muted-foreground">
                <FileText className="size-10 opacity-40" />
                <p className="text-sm">Generated SOAP notes will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
