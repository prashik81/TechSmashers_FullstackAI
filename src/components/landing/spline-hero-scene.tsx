"use client";

import dynamic from "next/dynamic";

const Spline = dynamic(
  () => import("@splinetool/react-spline").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-blue-50/80">
        <div className="size-10 animate-pulse rounded-full bg-blue-200" />
      </div>
    ),
  }
);

export function SplineHeroScene() {
  return (
    <Spline scene="https://prod.spline.design/fSyteSe0brYbYwr1/scene.splinecode" />
  );
}
