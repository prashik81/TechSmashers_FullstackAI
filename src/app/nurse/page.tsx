"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpDown,
  Bell,
  ClipboardList,
  Heart,
  Loader2,
  Sparkles,
  Thermometer,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Priority = "critical" | "high" | "medium" | "low";

interface Alert {
  id: string;
  patient: string;
  room: string;
  message: string;
  source: string;
  time: string;
  priority: Priority;
  aiScore: number;
  icon: typeof Bell;
}

const BASE_ALERTS: Omit<Alert, "priority" | "aiScore">[] = [
  {
    id: "1",
    patient: "Maria Garcia",
    room: "ICU-204",
    message: "SpO2 dropped to 88% — supplemental O2 initiated",
    source: "Vital Monitor",
    time: "2 min ago",
    icon: Heart,
  },
  {
    id: "2",
    patient: "James Wilson",
    room: "Ward-312",
    message: "Heart rate sustained at 142 bpm for 5 minutes",
    source: "Cardiac Monitor",
    time: "5 min ago",
    icon: Heart,
  },
  {
    id: "3",
    patient: "Sarah Chen",
    room: "Ward-108",
    message: "Temperature 38.9°C — post-op day 2",
    source: "Vital Monitor",
    time: "8 min ago",
    icon: Thermometer,
  },
  {
    id: "4",
    patient: "Robert Lee",
    room: "Ward-215",
    message: "Pain score reported as 8/10 — morphine due",
    source: "Patient Call",
    time: "12 min ago",
    icon: Bell,
  },
  {
    id: "5",
    patient: "Emily Davis",
    room: "Ward-401",
    message: "IV line infiltration suspected — site swelling noted",
    source: "Nurse Assessment",
    time: "18 min ago",
    icon: AlertTriangle,
  },
  {
    id: "6",
    patient: "Michael Brown",
    room: "Ward-103",
    message: "Scheduled medication due in 15 minutes",
    source: "Medication System",
    time: "20 min ago",
    icon: ClipboardList,
  },
  {
    id: "7",
    patient: "Lisa Anderson",
    room: "Ward-220",
    message: "Patient requesting water and blanket",
    source: "Patient Call",
    time: "25 min ago",
    icon: Bell,
  },
];

const DEFAULT_SCORES: Record<string, { priority: Priority; aiScore: number }> = {
  "1": { priority: "critical", aiScore: 98 },
  "2": { priority: "critical", aiScore: 95 },
  "3": { priority: "high", aiScore: 82 },
  "4": { priority: "high", aiScore: 78 },
  "5": { priority: "medium", aiScore: 65 },
  "6": { priority: "low", aiScore: 35 },
  "7": { priority: "low", aiScore: 20 },
};

const priorityConfig: Record<
  Priority,
  { label: string; className: string; order: number }
> = {
  critical: {
    label: "Critical",
    className: "bg-red-500/10 text-red-600 border-red-200",
    order: 0,
  },
  high: {
    label: "High",
    className: "bg-orange-500/10 text-orange-600 border-orange-200",
    order: 1,
  },
  medium: {
    label: "Medium",
    className: "bg-amber-500/10 text-amber-700 border-amber-200",
    order: 2,
  },
  low: {
    label: "Low",
    className: "bg-blue-50 text-muted-foreground border-blue-100",
    order: 3,
  },
};

function buildAlerts(
  scores: Record<string, { priority: Priority; aiScore: number }>
): Alert[] {
  return BASE_ALERTS.map((alert) => ({
    ...alert,
    priority: scores[alert.id]?.priority ?? "medium",
    aiScore: scores[alert.id]?.aiScore ?? 50,
  }));
}

export default function NursePage() {
  const [filter, setFilter] = useState<string>("all");
  const [sorted, setSorted] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>(() => buildAlerts(DEFAULT_SCORES));
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);

  useEffect(() => {
    async function prioritize() {
      setAiLoading(true);
      try {
        const payload = BASE_ALERTS.map(({ id, patient, room, message, source, time }) => ({
          id,
          patient,
          room,
          message,
          source,
          time,
        }));

        const res = await fetch("/api/nurse/prioritize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alerts: payload }),
        });

        if (!res.ok) return;

        const data = await res.json();
        const scores: Record<string, { priority: Priority; aiScore: number }> = {};

        for (const item of data.prioritized) {
          const p = item.priority as Priority;
          if (["critical", "high", "medium", "low"].includes(p)) {
            scores[item.id] = { priority: p, aiScore: item.aiScore };
          }
        }

        setAlerts(buildAlerts({ ...DEFAULT_SCORES, ...scores }));
        setAiEnabled(true);
      } catch {
        /* keep default scores */
      } finally {
        setAiLoading(false);
      }
    }

    prioritize();
  }, []);

  const filteredAlerts = useMemo(() => {
    let list = [...alerts];
    if (filter !== "all") {
      list = list.filter((a) => a.priority === filter);
    }
    if (sorted) {
      list.sort(
        (a, b) =>
          priorityConfig[a.priority].order - priorityConfig[b.priority].order ||
          b.aiScore - a.aiScore
      );
    }
    return list;
  }, [alerts, filter, sorted]);

  const counts = useMemo(() => {
    return alerts.reduce(
      (acc, a) => {
        acc[a.priority] = (acc[a.priority] || 0) + 1;
        return acc;
      },
      {} as Record<Priority, number>
    );
  }, [alerts]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-white p-6 sm:p-8">
        <Badge variant="secondary" className="mb-3 border border-blue-100 bg-white text-primary">
          <ClipboardList className="size-3" />
          Nurse Module · Llama 3.1
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Nurse Alert Prioritization
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          AI ranks ward alerts by severity so you respond to critical events
          first and reduce alert fatigue.
        </p>
        {aiLoading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" />
            Running AI priority analysis...
          </div>
        )}
        {aiEnabled && !aiLoading && (
          <Badge variant="outline" className="mt-4 border-blue-200 text-primary">
            <Sparkles className="size-3" />
            Live AI scores active
          </Badge>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.keys(priorityConfig) as Priority[]).map((p) => (
          <Card key={p} className="border-blue-100/80 py-3 shadow-sm">
            <CardContent className="flex items-center justify-between px-4 py-0">
              <Badge variant="outline" className={priorityConfig[p].className}>
                {priorityConfig[p].label}
              </Badge>
              <span className="text-2xl font-bold text-primary">{counts[p] || 0}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value ?? "all")}
          >
            <SelectTrigger className="w-40 border-blue-200">
              <SelectValue placeholder="Filter priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={sorted ? "default" : "outline"}
            size="sm"
            className={sorted ? "" : "border-blue-200"}
            onClick={() => setSorted(!sorted)}
          >
            <ArrowUpDown className="size-4" />
            AI Priority Sort
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? "s" : ""}{" "}
          · sorted by AI urgency score
        </p>
      </div>

      <div className="space-y-3">
        {filteredAlerts.map((alert, index) => {
          const config = priorityConfig[alert.priority];
          const Icon = alert.icon;
          return (
            <Card
              key={alert.id}
              className={cn(
                "border-blue-100/80 shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:shadow-blue-500/5",
                alert.priority === "critical" && "border-red-200 bg-red-50/30"
              )}
            >
              <CardContent className="flex gap-4 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{alert.patient}</span>
                    <Badge variant="outline" className="border-blue-200 text-xs">
                      {alert.room}
                    </Badge>
                    <Badge variant="outline" className={config.className}>
                      {config.label}
                    </Badge>
                    {sorted && index < 2 && (
                      <Badge className="bg-primary/10 text-primary">
                        AI Top Priority
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm">{alert.message}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>{alert.source}</span>
                    <span>·</span>
                    <span>{alert.time}</span>
                    <span>·</span>
                    <span className="font-medium text-primary">
                      AI score: {alert.aiScore}/100
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-blue-100">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${alert.aiScore}%` }}
                    />
                  </div>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 self-start border-blue-200">
                  Acknowledge
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
