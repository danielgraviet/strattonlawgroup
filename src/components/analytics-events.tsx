"use client";

import { useEffect } from "react";

export function AnalyticsEvents() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const tracked = target.closest<HTMLElement>("[data-event]");

      if (!tracked) {
        return;
      }

      window.dispatchEvent(
        new CustomEvent("site:analytics", {
          detail: {
            event: tracked.dataset.event,
            href: tracked instanceof HTMLAnchorElement ? tracked.href : undefined,
            label: tracked.dataset.eventLabel,
            location: tracked.dataset.eventLocation,
            value: tracked.dataset.eventValue,
            path: window.location.pathname
          }
        })
      );
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
