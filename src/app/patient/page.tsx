"use client";

import { useRef, useState } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "What are my visiting hours?",
  "When should I take my medication?",
  "How do I prepare for my appointment?",
  "What are common side effects?",
];

const MOCK_RESPONSES: Record<string, string> = {
  default:
    "Thank you for your question. I am the Hospital 2050 patient assistant. For medical emergencies, please call 911 or visit the nearest emergency department. How else can I help you today?",
  visiting:
    "General visiting hours are 10:00 AM – 8:00 PM daily. ICU visiting hours are 11:00 AM – 1:00 PM and 5:00 PM – 7:00 PM. Please check in at the front desk with a valid ID.",
  medication:
    "Please take your prescribed medications exactly as directed on your label. If you miss a dose, do not double up — contact your care team or pharmacist for guidance.",
  appointment:
    "For your upcoming appointment, please arrive 15 minutes early, bring your insurance card and ID, and list any medications you are currently taking. Fasting may be required for certain lab work.",
  sideeffects:
    "Common side effects vary by medication. Mild nausea, drowsiness, or headache can occur. Contact your doctor if you experience severe reactions such as difficulty breathing, swelling, or chest pain.",
};

function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("visit") || lower.includes("hour"))
    return MOCK_RESPONSES.visiting;
  if (lower.includes("medication") || lower.includes("medicine") || lower.includes("dose"))
    return MOCK_RESPONSES.medication;
  if (lower.includes("appointment") || lower.includes("prepare"))
    return MOCK_RESPONSES.appointment;
  if (lower.includes("side effect") || lower.includes("symptom"))
    return MOCK_RESPONSES.sideeffects;
  return MOCK_RESPONSES.default;
}

export default function PatientPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content:
        "Hello! I am your Hospital 2050 patient assistant, powered by Llama 3.1. I can help with visiting hours, medications, appointments, and general care questions. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/patient/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await res.json();
      let reply: string;

      if (!res.ok) {
        reply =
          res.status === 503
            ? getMockResponse(text) + " (Demo mode — add HUGGINGFACE_API_KEY for live AI)"
            : getMockResponse(text);
      } else {
        reply = data.reply;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: getMockResponse(text),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-3 border border-blue-100 bg-blue-50 text-primary">
          <Bot className="size-3" />
          Patient Module · Llama 3.1
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Patient AI Chatbot
        </h1>
        <p className="mt-2 text-muted-foreground">
          Get instant answers about care, appointments, and medications — 24/7.
        </p>
      </div>

      <Card className="overflow-hidden border-blue-100/80 shadow-lg shadow-blue-500/5">
        <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50/80 to-white pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <Bot className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base">Care Assistant</CardTitle>
              <CardDescription>Online · Powered by Hugging Face</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[420px] bg-white px-4" ref={scrollRef}>
            <div className="flex flex-col gap-4 py-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-blue-100 bg-blue-50 text-primary"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="size-4" />
                    ) : (
                      <Bot className="size-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-blue-100 bg-white text-foreground"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-primary">
                    <Bot className="size-4" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-blue-100 bg-blue-50/30 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  className="border-blue-200 bg-white text-xs hover:bg-blue-50"
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                >
                  {prompt}
                </Button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
            >
              <Input
                placeholder="Ask about visiting hours, medications, appointments..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="border-blue-200 bg-white focus-visible:ring-primary/30"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || loading}>
                <Send className="size-4" />
              </Button>
            </form>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Not a substitute for emergency care. Call 911 for emergencies.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
