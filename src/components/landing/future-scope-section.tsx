import {
  BarChart3,
  Database,
  Mic,
  Plug,
  Rocket,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const roadmap = [
  {
    icon: Mic,
    phase: "Phase 1",
    title: "Voice input",
    description:
      "Hands-free dictation for doctors during rounds — speak notes and let AI transcribe and structure them.",
    status: "In design",
  },
  {
    icon: Database,
    phase: "Phase 2",
    title: "Electronic Health Records integration",
    description:
      "Sync generated notes and alerts directly with Epic, Cerner, and other EHR systems via FHIR APIs.",
    status: "Planned",
  },
  {
    icon: BarChart3,
    phase: "Phase 3",
    title: "Predictive healthcare analytics",
    description:
      "Forecast readmissions, sepsis risk, and bed capacity using historical patient data and real-time vitals.",
    status: "Research",
  },
];

export function FutureScopeSection() {
  return (
    <section
      id="future"
      className="border-t border-blue-100/80 bg-white py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            <Rocket className="size-3" />
            Future Scope
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for where healthcare is going
          </h2>
          <p className="mt-4 text-muted-foreground">
            Built with Next.js, Hugging Face (Meditron + Llama 3.1), and a
            professional blue-and-white design system. Here is what comes next.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {roadmap.map((item) => (
            <Card
              key={item.title}
              className="relative overflow-hidden border-border/60 shadow-sm"
            >
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-primary/5" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  {item.phase}
                </p>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-border/60 bg-background p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Plug className="size-6" />
              </div>
              <div>
                <h3 className="font-semibold">Full-stack architecture</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Next.js frontend · Hugging Face Inference API · Meditron +
                  Llama 3.1 · Vercel-ready deployment
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "Hugging Face", "Meditron", "Llama 3.1", "Tailwind CSS"].map((tech) => (
                <Badge key={tech} variant="outline">
                  <Sparkles className="size-3" />
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
