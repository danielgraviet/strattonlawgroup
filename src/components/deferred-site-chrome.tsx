"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Analytics = dynamic(() => import("@vercel/analytics/next").then((mod) => mod.Analytics), {
  ssr: false
});

const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((mod) => mod.SpeedInsights),
  { ssr: false }
);

const IntakeLauncher = dynamic(
  () => import("@/components/intake/intake-launcher").then((mod) => mod.IntakeLauncher),
  { ssr: false }
);

/**
 * Loads analytics + the intake chat after the browser is idle so they don't compete
 * with first paint (FCP) for CSS/fonts/hero media.
 */
export function DeferredSiteChrome() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const enable = () => setReady(true);

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(enable, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(enable, 1200);
    }

    return () => {
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
      <IntakeLauncher />
    </>
  );
}
