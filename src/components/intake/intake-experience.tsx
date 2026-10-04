"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Phone, X } from "lucide-react";
import type { IntakeFlow } from "@/lib/intake/flow";
import { site } from "@/lib/site";
import { StepInput } from "./step-input";
import { useIntakeConversation } from "./use-intake-conversation";
import styles from "./intake.module.css";

type IntakeExperienceProps = {
  flow: IntakeFlow;
  onClose: () => void;
};

/** Full-screen intake: a brand photo panel alongside a text-message style conversation. */
export function IntakeExperience({ flow, onClose }: IntakeExperienceProps) {
  const { messages, isTyping, isComplete, currentStep, answer } = useIntakeConversation(flow);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, currentStep]);

  return (
    <div className={styles.experience} role="dialog" aria-modal="true" aria-label={`Chat with ${flow.host.name}`}>
      <div className={styles.brandPane}>
        <Image className={styles.brandImage} src={flow.panelImage} alt="" fill sizes="(min-width: 900px) 50vw, 100vw" priority />
        <div className={styles.brandText}>
          <span>{flow.host.name}</span>
          <strong>{site.tagline}</strong>
        </div>
      </div>

      <section className={styles.chat}>
        <header className={styles.chatHeader}>
          <Avatar src={flow.host.avatar} alt={flow.host.name} size={44} />
          <div className={styles.chatHeaderText}>
            <strong>{flow.host.name}</strong>
            <span>{flow.host.title}</span>
          </div>
          <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close chat" data-event="intake_close">
            <X aria-hidden="true" size={22} />
          </button>
        </header>

        <div className={styles.transcript} ref={transcriptRef} role="log" aria-live="polite">
          {messages.map((message, index) => {
            const startsBotRun = message.role === "bot" && messages[index - 1]?.role !== "bot";
            return message.role === "bot" ? (
              <div key={index} className={styles.botRow}>
                {startsBotRun ? (
                  <Avatar src={flow.host.avatar} alt="" size={32} />
                ) : (
                  <span className={styles.avatarSpacer} aria-hidden="true" />
                )}
                <p className={styles.botBubble}>{message.text}</p>
              </div>
            ) : (
              <p key={index} className={styles.userBubble}>
                {message.text}
              </p>
            );
          })}

          {isTyping && (
            <div className={styles.botRow} aria-label={`${flow.host.name} is typing`}>
              {messages[messages.length - 1]?.role === "bot" ? (
                <span className={styles.avatarSpacer} aria-hidden="true" />
              ) : (
                <Avatar src={flow.host.avatar} alt="" size={32} />
              )}
              <p className={`${styles.botBubble} ${styles.typing}`}>
                <span />
                <span />
                <span />
              </p>
            </div>
          )}
        </div>

        <div className={styles.composer}>
          {currentStep && <StepInput key={currentStep.id} step={currentStep} onAnswer={answer} />}
          {isComplete && !isTyping && (
            <p className={styles.demoNote}>
              Preview: this chat isn&apos;t sent to the firm yet. Please call us so we don&apos;t miss you.
            </p>
          )}
          {isComplete && !isTyping && (
            <div className={styles.closingActions}>
              <a className={styles.callButton} href={site.phoneHref} data-event="intake_phone_click">
                <Phone aria-hidden="true" size={18} />
                Call {site.phone}
              </a>
              <button className={styles.secondaryButton} type="button" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Avatar({ src, alt, size }: { src: string; alt: string; size: number }) {
  return (
    <Image className={styles.avatar} src={src} alt={alt} width={size} height={size} style={{ width: size, height: size }} />
  );
}
