import Link from "next/link";
import {
  ArrowRight,
  Bot,
  ClipboardList,
  FileText,
  Mic,
  Sparkles,
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

const features = [
  {
    icon: FileText,
    badge: "Doctor",
    title: "Doctor AI Scribe",
    description:
      "Dictate or type visit notes and receive structured SOAP documentation, diagnoses, and follow-up plans in seconds.",
    href: "/doctor",
    highlights: [
      "SOAP note generation",
      "ICD-ready summaries",
      "Copy & export ready",
    ],
  },
  {
    icon: ClipboardList,
    badge: "Nurse",
    title: "Nurse Alert Prioritization",
    description:
      "AI ranks incoming ward alerts by severity and urgency so nurses respond to critical events first.",
    href: "/nurse",
    highlights: [
      "Smart priority scoring",
      "Critical-first sorting",
      "Workload visibility",
    ],
  },
  {
    icon: Bot,
    badge: "Patient",
    title: "Patient AI Chatbot",
    description:
      "Patients get instant answers about appointments, medications, and post-discharge care without waiting on hold.",
    href: "/patient",
    highlights: [
      "24/7 availability",
      "Empathetic responses",
      "Escalation to staff",
    ],
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-blue-100/80 bg-blue-50/30 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="size-3" />
            Core Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Three AI modules, one copilot
          </h2>
          <p className="mt-4 text-muted-foreground">
            Purpose-built tools for doctors, nurses, and patients — designed to
            integrate with your hospital workflow.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="flex flex-col border-blue-100/80 bg-white shadow-sm transition-shadow hover:border-primary/20 hover:shadow-lg hover:shadow-blue-500/5"
            >
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <Badge variant="secondary">{feature.badge}</Badge>
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex flex-col gap-4">
                <ul className="space-y-2">
                  {feature.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span className="size-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full"
                  render={<Link href={feature.href} />}
                >
                  Open module
                  <ArrowRight className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-background p-4 text-sm text-muted-foreground">
          <Mic className="size-4 text-primary" />
          Voice input coming soon — speak notes directly into the scribe.
        </div>
      </div>
    </section>
  );
}
