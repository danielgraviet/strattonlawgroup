"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Check, SendHorizontal } from "lucide-react";
import type { IntakeStep } from "@/lib/intake/flow";
import styles from "./intake.module.css";

export type StepAnswer = {
  /** What appears in the visitor's chat bubble. */
  display: string;
  /** Values merged into the collected answers. */
  values: Record<string, string>;
};

type StepInputProps = {
  step: IntakeStep;
  onAnswer: (answer: StepAnswer) => void;
};

export function StepInput({ step, onAnswer }: StepInputProps) {
  switch (step.kind) {
    case "choice":
      return (
        <div className={styles.pills} role="group" aria-label="Choose an option">
          {step.options.map((option) => (
            <button
              key={option}
              type="button"
              className={styles.pill}
              onClick={() => onAnswer({ display: option, values: { [step.id]: option } })}
              data-event="intake_option"
              data-event-label={option}
              data-event-value={step.id}
            >
              {option}
            </button>
          ))}
        </div>
      );
    case "text":
      return <TextInput id={step.id} placeholder={step.placeholder} onAnswer={onAnswer} />;
    case "name":
      return <NameInput onAnswer={onAnswer} />;
    case "phone":
      return <PhoneInput onAnswer={onAnswer} />;
    case "email":
      return <EmailInput onAnswer={onAnswer} />;
  }
}

function CheckButton({ disabled }: { disabled: boolean }) {
  return (
    <button className={styles.checkButton} type="submit" disabled={disabled} aria-label="Submit">
      <Check aria-hidden="true" size={24} strokeWidth={3} />
    </button>
  );
}

function StepForm({ onSubmit, children }: { onSubmit: () => void; children: ReactNode }) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className={styles.stepForm} onSubmit={handleSubmit} noValidate>
      {children}
    </form>
  );
}

/** Focuses the first field when an input step appears. */
function useAutoFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return ref;
}

function TextInput({
  id,
  placeholder,
  onAnswer
}: {
  id: string;
  placeholder?: string;
  onAnswer: (answer: StepAnswer) => void;
}) {
  const [value, setValue] = useState("");
  const ref = useAutoFocus<HTMLTextAreaElement>();
  const trimmed = value.trim();
  const valid = trimmed.length >= 2;

  function submit() {
    if (valid) onAnswer({ display: trimmed, values: { [id]: trimmed } });
  }

  return (
    <StepForm onSubmit={submit}>
      <textarea
        ref={ref}
        className={styles.textArea}
        rows={2}
        maxLength={4000}
        value={value}
        placeholder={placeholder}
        aria-label="Your message"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          // Enter sends like a messaging app; Shift+Enter adds a new line.
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
      />
      <button className={styles.checkButton} type="submit" disabled={!valid} aria-label="Send message">
        <SendHorizontal aria-hidden="true" size={22} strokeWidth={2.5} />
      </button>
    </StepForm>
  );
}

function NameInput({ onAnswer }: { onAnswer: (answer: StepAnswer) => void }) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const ref = useAutoFocus<HTMLInputElement>();
  const firstName = first.trim();
  const lastName = last.trim();
  const valid = firstName.length > 0 && lastName.length > 0;

  return (
    <StepForm
      onSubmit={() => {
        if (valid) onAnswer({ display: `${firstName} ${lastName}`, values: { firstName, lastName } });
      }}
    >
      <div className={styles.fieldPair}>
        <input
          ref={ref}
          className={styles.field}
          value={first}
          onChange={(event) => setFirst(event.target.value)}
          placeholder="First name"
          aria-label="First name"
          autoComplete="given-name"
          maxLength={100}
        />
        <input
          className={styles.field}
          value={last}
          onChange={(event) => setLast(event.target.value)}
          placeholder="Last name"
          aria-label="Last name"
          autoComplete="family-name"
          maxLength={100}
        />
      </div>
      <CheckButton disabled={!valid} />
    </StepForm>
  );
}

function formatPhone(input: string) {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function PhoneInput({ onAnswer }: { onAnswer: (answer: StepAnswer) => void }) {
  const [value, setValue] = useState("");
  const ref = useAutoFocus<HTMLInputElement>();
  const valid = value.replace(/\D/g, "").length === 10;

  return (
    <StepForm
      onSubmit={() => {
        if (valid) onAnswer({ display: value, values: { phone: value } });
      }}
    >
      <input
        ref={ref}
        className={styles.field}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={value}
        onChange={(event) => setValue(formatPhone(event.target.value))}
        placeholder="(801) 555-1234"
        aria-label="Phone number"
      />
      <CheckButton disabled={!valid} />
    </StepForm>
  );
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function EmailInput({ onAnswer }: { onAnswer: (answer: StepAnswer) => void }) {
  const [value, setValue] = useState("");
  const ref = useAutoFocus<HTMLInputElement>();
  const email = value.trim();
  const valid = emailPattern.test(email);

  return (
    <StepForm
      onSubmit={() => {
        if (valid) onAnswer({ display: email, values: { email } });
      }}
    >
      <input
        ref={ref}
        className={styles.field}
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={200}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
      />
      <CheckButton disabled={!valid} />
    </StepForm>
  );
}
