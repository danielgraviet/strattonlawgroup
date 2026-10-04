"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageCircle, X } from "lucide-react";
import { intakeFlow } from "@/lib/intake/flow";
import { IntakeExperience } from "./intake-experience";
import styles from "./intake.module.css";

const promptDelayMs = 5000;
const dismissedKey = "slg_intake_prompt_dismissed";
const openEvent = "intake:open";

/** Opens the intake from anywhere. */
export function openIntake() {
  window.dispatchEvent(new Event(openEvent));
}

function track(event: string) {
  window.dispatchEvent(
    new CustomEvent("site:analytics", {
      detail: { event, path: window.location.pathname, location: "intake_prompt" }
    })
  );
}

function markDismissed() {
  try {
    sessionStorage.setItem(dismissedKey, "true");
  } catch {
    // Storage can be blocked (private mode); the prompt just may show again.
  }
}

/** Site-wide entry points: the chat orb and a timed Yes/No prompt, both opening the full-screen intake. */
export function IntakeLauncher() {
  const [promptOpen, setPromptOpen] = useState(false);
  const [intakeOpen, setIntakeOpen] = useState(false);
  // Remount on every open so the conversation starts fresh.
  const [session, setSession] = useState(0);
  const intakeOpenRef = useRef(false);

  const open = useCallback(() => {
    markDismissed();
    intakeOpenRef.current = true;
    setPromptOpen(false);
    setSession((value) => value + 1);
    setIntakeOpen(true);
  }, []);

  const close = useCallback(() => {
    intakeOpenRef.current = false;
    setIntakeOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener(openEvent, open);
    return () => window.removeEventListener(openEvent, open);
  }, [open]);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(dismissedKey) === "true";
    } catch {
      // Treat unreadable storage as not dismissed.
    }
    if (dismissed) return;

    const timer = window.setTimeout(() => {
      // Never interrupt someone who is already in the intake.
      if (intakeOpenRef.current) return;
      setPromptOpen(true);
      track("intake_prompt_view");
    }, promptDelayMs);
    return () => window.clearTimeout(timer);
  }, []);

  const decline = useCallback(() => {
    markDismissed();
    setPromptOpen(false);
    track("intake_prompt_no");
  }, []);

  useEffect(() => {
    if (!promptOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") decline();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [promptOpen, decline]);


  return (
    <>
      {promptOpen && !intakeOpen && (
        <div
          className={styles.promptOverlay}
          onClick={(event) => {
            // Clicking the dimmed backdrop counts as "No".
            if (event.target === event.currentTarget) decline();
          }}
        >
          <div className={styles.prompt} role="dialog" aria-modal="true" aria-labelledby="intake-prompt-title">
            <button className={styles.promptClose} type="button" onClick={decline} aria-label="Close">
              <X aria-hidden="true" size={18} />
            </button>
            <Image
              className={styles.avatar}
              src={intakeFlow.host.avatar}
              alt={intakeFlow.host.name}
              width={88}
              height={88}
              style={{ width: 88, height: 88 }}
            />
            <h2 id="intake-prompt-title">Is there something our attorneys can help you with?</h2>
            <div className={styles.promptActions}>
              <button className={styles.promptNo} type="button" onClick={decline}>
                No
              </button>
              <button
                className={styles.promptYes}
                type="button"
                onClick={() => {
                  track("intake_prompt_yes");
                  open();
                }}
                autoFocus
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {!intakeOpen && (
        <button
          className={styles.orb}
          type="button"
          onClick={() => {
            track("intake_orb_click");
            open();
          }}
          aria-label={`Chat with ${intakeFlow.host.name}`}
        >
          <Image
            className={styles.orbPhoto}
            src={intakeFlow.host.avatar}
            alt=""
            width={64}
            height={64}
            style={{ width: 64, height: 64 }}
          />
          <span className={styles.orbBadge} aria-hidden="true">
            <MessageCircle size={14} strokeWidth={2.75} />
          </span>
        </button>
      )}

      {intakeOpen && <IntakeExperience key={session} flow={intakeFlow} onClose={close} />}
    </>
  );
}
