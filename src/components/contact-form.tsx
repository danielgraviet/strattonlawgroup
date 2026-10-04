"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Mail } from "lucide-react";
import { TurnstileField } from "@/components/turnstile-field";
import { submitContactForm, type ContactFormState } from "@/lib/contact-form";
import { practiceAreas } from "@/lib/site";
import styles from "./contact-form.module.css";

const initialState: ContactFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="button" type="submit" disabled={pending} data-event="contact_form_submit">
      <Mail aria-hidden="true" size={19} />
      {pending ? "Sending..." : "Send message"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);

  return (
    <form className={styles.form} action={formAction} noValidate>
      <label>
        Name
        <input type="text" name="name" autoComplete="name" required />
      </label>
      <label>
        Phone
        <input type="tel" name="phone" autoComplete="tel" required />
      </label>
      <label>
        Email
        <input type="email" name="email" autoComplete="email" required />
      </label>
      <label>
        What do you need help with?
        <select name="practiceArea" required defaultValue="">
          <option value="" disabled>
            Choose a service
          </option>
          {practiceAreas.map((area) => (
            <option key={area.slug} value={area.label}>
              {area.label}
            </option>
          ))}
          <option value="Something else">Something else</option>
        </select>
      </label>
      <label>
        How can we help?
        <textarea name="message" rows={5} />
      </label>
      <TurnstileField />
      {/* Honeypot field, hidden from real users, catches simple bots */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className={styles.honeypot}
        aria-hidden="true"
      />
      <SubmitButton />
      {state.status !== "idle" && (
        <p className={state.status === "success" ? styles.success : styles.error} role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
