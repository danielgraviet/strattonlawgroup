"use server";

import { Resend } from "resend";
import { z } from "zod";
import { practiceAreas, site } from "@/lib/site";
import { verifyTurnstileToken } from "@/lib/turnstile";

const practiceAreaLabels = new Set<string>([...practiceAreas.map((area) => area.label), "Something else"]);

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(200),
  phone: z.string().trim().min(7, "Please enter a valid phone number.").max(40),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  practiceArea: z
    .string()
    .trim()
    .refine((value) => practiceAreaLabels.has(value), "Please choose what you need help with."),
  message: z.string().trim().max(5000).optional().default(""),
  // Honeypot field: real users never fill this in.
  company: z.string().max(0).optional().default("")
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Turnstile is enforced only once its secret is configured.
  if (process.env.TURNSTILE_SECRET_KEY) {
    const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
    if (!(await verifyTurnstileToken(turnstileToken))) {
      return { status: "error", message: "Please complete the security check and try again." };
    }
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name") ?? undefined,
    phone: formData.get("phone") ?? undefined,
    email: formData.get("email") ?? undefined,
    practiceArea: formData.get("practiceArea") ?? undefined,
    message: formData.get("message") ?? undefined,
    company: formData.get("company") ?? undefined
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the form and try again."
    };
  }

  const { name, phone, email, practiceArea, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FORM_FROM_EMAIL;
  const to = process.env.CONTACT_FORM_TO_EMAIL ?? site.email;

  if (!apiKey || !from) {
    console.error("RESEND_API_KEY or CONTACT_FORM_FROM_EMAIL is not configured.");
    return { status: "error", message: `Something went wrong. Please call us at ${site.phone}.` };
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: to.split(",").map((address) => address.trim()),
      replyTo: email,
      subject: `New ${practiceArea} inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Needs help with: ${practiceArea}`,
        "",
        message || "(No message provided)"
      ].join("\n")
    });

    if (error) {
      console.error("Resend error:", error);
      return { status: "error", message: `Something went wrong. Please call us at ${site.phone}.` };
    }
  } catch (error) {
    console.error("Failed to send contact form email:", error);
    return { status: "error", message: `Something went wrong. Please call us at ${site.phone}.` };
  }

  return { status: "success", message: "Thanks — we received your message and will be in touch soon." };
}
