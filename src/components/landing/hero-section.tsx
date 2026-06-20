import Link from "next/link";
import { ArrowRight, Bot, ClipboardList, Sparkles, Stethoscope } from "lucide-react";

import { SplineHeroScene } from "@/components/landing/spline-hero-scene";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 size-96 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="text-center lg:text-left">
          <Badge
            variant="secondary"
            className="mb-6 border border-blue-100 bg-blue-50 text-primary"
          >
            <Sparkles className="size-3" />
            Healthcare AI · Powered by Hugging Face
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Hospital 2050{" "}
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              AI Copilot
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Save doctor time, reduce nurse alert fatigue, and give patients
            instant answers — with medical-grade AI built for modern hospitals.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Button size="lg" className="shadow-lg shadow-primary/20" render={<Link href="/doctor" />}>
              Launch Doctor Scribe
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-200 bg-white hover:bg-blue-50"
              render={<Link href="/patient" />}
            >
              Try Patient Chat
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground lg:justify-start">
            <span className="rounded-full border border-blue-100 bg-white px-3 py-1">
              Meditron + Llama 3.1
            </span>
            <span className="rounded-full border border-blue-100 bg-white px-3 py-1">
              HIPAA-ready design
            </span>
            <span className="rounded-full border border-blue-100 bg-white px-3 py-1">
              &lt; 2s response
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-400/20 to-blue-600/10 blur-2xl" />
          <div className="relative h-[360px] overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl shadow-blue-500/10 sm:h-[420px] lg:h-[480px]">
            <SplineHeroScene />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Stethoscope,
              title: "Doctor AI Scribe",
              desc: "Meditron-powered SOAP notes from visit transcripts.",
            },
            {
              icon: ClipboardList,
              title: "Nurse Alert Prioritization",
              desc: "AI ranks critical ward alerts so you respond first.",
            },
            {
              icon: Bot,
              title: "Patient AI Chatbot",
              desc: "Empathetic 24/7 answers powered by Llama 3.1.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-blue-100/80 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md hover:shadow-blue-500/5"
            >
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
