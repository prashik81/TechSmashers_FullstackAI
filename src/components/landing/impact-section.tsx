import { Clock, Heart, ShieldCheck, TrendingDown, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const impacts = [
  {
    icon: Clock,
    title: "Saves doctor time",
    stat: "40%",
    description:
      "Less time on documentation means more time at the bedside with patients.",
  },
  {
    icon: TrendingDown,
    title: "Reduces nurse overload",
    stat: "60%",
    description:
      "Prioritized alerts cut through noise so nurses focus on what matters most.",
  },
  {
    icon: Heart,
    title: "Improves patient experience",
    stat: "3×",
    description:
      "Instant answers and clearer communication boost satisfaction scores.",
  },
];

const metrics = [
  { icon: Users, label: "Staff roles supported", value: "3" },
  { icon: ShieldCheck, label: "HIPAA-ready design", value: "Built-in" },
  { icon: Clock, label: "Avg. response time", value: "< 2s" },
];

export function ImpactSection() {
  return (
    <section id="impact" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            Impact
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Measurable outcomes for your hospital
          </h2>
          <p className="mt-4 text-muted-foreground">
            Hospital 2050 AI Copilot targets the biggest time sinks in modern
            healthcare operations.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {impacts.map((item) => (
            <Card key={item.title} className="border-blue-100/80 bg-white text-center shadow-sm transition-shadow hover:shadow-md hover:shadow-blue-500/5">
              <CardHeader>
                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="size-6" />
                </div>
                <CardTitle className="text-4xl font-bold text-primary">
                  {item.stat}
                </CardTitle>
                <CardDescription className="text-base font-medium text-foreground">
                  {item.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center gap-4 rounded-xl border border-blue-100 bg-white p-4 shadow-sm"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-sm">
                <metric.icon className="size-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
