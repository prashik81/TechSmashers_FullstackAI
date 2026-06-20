"use client";

import { Activity, Heart, Stethoscope, Zap } from "lucide-react";

export function HeroVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Animated background orbs */}
      <div className="absolute -left-20 top-0 size-72 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 size-72 animate-pulse rounded-full bg-cyan-500/10 blur-3xl [animation-delay:1s]" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Central content */}
      <div className="relative flex h-full flex-col items-center justify-center p-8">
        {/* Pulsing rings around the central icon */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute size-32 animate-ping rounded-full border border-blue-400/20 [animation-duration:3s]" />
          <div className="absolute size-24 animate-ping rounded-full border border-cyan-400/20 [animation-duration:2s] [animation-delay:0.5s]" />
          <div className="relative flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/40">
            <Activity className="size-10 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* ECG / Heartbeat line */}
        <svg
          viewBox="0 0 400 60"
          className="h-12 w-full max-w-xs"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ecg-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
              <stop offset="20%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="80%" stopColor="#22d3ee" stopOpacity="1" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            points="0,30 60,30 75,30 85,10 95,50 105,30 120,30 160,30 175,30 185,15 195,45 205,30 220,30 260,30 275,30 285,10 295,50 305,30 320,30 360,30 375,30 385,15 395,45 400,30"
            fill="none"
            stroke="url(#ecg-line)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />
        </svg>

        {/* Floating stat cards */}
        <div className="mt-8 grid w-full max-w-xs grid-cols-3 gap-3">
          {[
            { icon: Heart, label: "Heart Rate", value: "72", unit: "bpm", color: "text-rose-400" },
            { icon: Zap, label: "Response", value: "<2s", unit: "AI", color: "text-amber-400" },
            { icon: Stethoscope, label: "Accuracy", value: "98", unit: "%", color: "text-emerald-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
            >
              <stat.icon className={`mx-auto mb-1.5 size-4 ${stat.color}`} />
              <p className="text-center text-lg font-bold text-white">{stat.value}</p>
              <p className="text-center text-[10px] uppercase tracking-wide text-slate-400">
                {stat.unit}
              </p>
            </div>
          ))}
        </div>

        {/* Status indicator */}
        <div className="mt-6 flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-medium text-emerald-300">AI Copilot Active</span>
        </div>
      </div>
    </div>
  );
}
