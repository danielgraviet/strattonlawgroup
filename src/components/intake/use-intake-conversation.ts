"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { resolvePrompt, type IntakeAnswers, type IntakeFlow } from "@/lib/intake/flow";
import type { StepAnswer } from "./step-input";

export type IntakeMessage = {
  role: "bot" | "user";
  text: string;
};

/** Longer lines "take longer to type" so the pacing feels human. */
function typingDelay(text: string) {
  return Math.min(1600, Math.max(750, 450 + text.length * 14));
}

/**
 * Drives the scripted conversation: shows the typing indicator, reveals bot
 * lines one at a time, and advances through the flow as the visitor answers.
 * Answers stay in the browser; nothing is saved or sent.
 */
export function useIntakeConversation(flow: IntakeFlow) {
  const [messages, setMessages] = useState<IntakeMessage[]>([]);
  const [answers, setAnswers] = useState<IntakeAnswers>({});
  const [stepIndex, setStepIndex] = useState(0);
  // Starts true so the first step's input never flashes before the greeting.
  const [isTyping, setIsTyping] = useState(true);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const say = useCallback((lines: string[], initialPause = 300) => {
    setIsTyping(true);
    let elapsed = initialPause;
    lines.forEach((line, index) => {
      elapsed += typingDelay(line);
      const id = window.setTimeout(() => {
        setMessages((current) => [...current, { role: "bot", text: line }]);
        if (index === lines.length - 1) setIsTyping(false);
      }, elapsed);
      timers.current.push(id);
      // Short beat between consecutive bubbles, like a person hitting send twice.
      elapsed += 250;
    });
  }, []);

  useEffect(() => {
    say(resolvePrompt(flow.steps[0].prompt, {}), 600);
    return () => {
      // Reset so a remount (e.g. React strict mode) replays the opening cleanly.
      clearTimers();
      setMessages([]);
    };
  }, [clearTimers, flow, say]);

  const answer = useCallback(
    ({ display, values }: StepAnswer) => {
      const nextAnswers = { ...answers, ...values };
      const nextIndex = stepIndex + 1;
      setMessages((current) => [...current, { role: "user", text: display }]);
      setAnswers(nextAnswers);
      setStepIndex(nextIndex);

      const completed = nextIndex >= flow.steps.length;
      say(resolvePrompt(completed ? flow.closing : flow.steps[nextIndex].prompt, nextAnswers));
    },
    [answers, flow, say, stepIndex]
  );

  const isComplete = stepIndex >= flow.steps.length;
  const currentStep = !isTyping && !isComplete ? flow.steps[stepIndex] : null;

  return { messages, answers, isTyping, isComplete, currentStep, answer };
}
