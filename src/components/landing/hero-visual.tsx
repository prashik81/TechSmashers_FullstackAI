"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <Loader2 className="size-8 animate-spin text-blue-400" />
    </div>
  ),
});

export function HeroVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Spline 3D scene fills the container */}
      <Spline
        scene="https://prod.spline.design/fSyteSe0brYbYwr1/scene.splinecode"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Centered MedLife AI Copilot text overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h2 className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent drop-shadow-2xl sm:text-4xl lg:text-5xl">
            MedLife AI Copilot
          </h2>
          <p className="mt-2 text-sm font-medium text-blue-200/70 sm:text-base">
            Intelligent healthcare, reimagined
          </p>
        </div>
      </div>
    </div>
  );
}
