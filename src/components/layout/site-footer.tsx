import Link from "next/link";
import { Activity } from "lucide-react";

import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t border-blue-100/80 bg-blue-50/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Activity className="size-4" />
              </div>
              <span className="font-semibold">Hospital 2050 AI Copilot</span>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Reducing documentation burden, prioritizing nurse alerts, and
              improving patient communication with AI.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="mb-3 text-sm font-semibold">Modules</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/doctor" className="hover:text-primary">
                    Doctor AI Scribe
                  </Link>
                </li>
                <li>
                  <Link href="/nurse" className="hover:text-primary">
                    Nurse Alerts
                  </Link>
                </li>
                <li>
                  <Link href="/patient" className="hover:text-primary">
                    Patient Chatbot
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Impact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Save doctor time</li>
                <li>Reduce nurse overload</li>
                <li>Better patient experience</li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="mb-3 text-sm font-semibold">Future Scope</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Voice input</li>
                <li>EHR integration</li>
                <li>Predictive analytics</li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Hospital 2050 AI Copilot · TechSmashers
          Fullstack AI
        </p>
      </div>
    </footer>
  );
}
