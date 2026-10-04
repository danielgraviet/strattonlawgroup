import { offices, practiceAreas, site } from "@/lib/site";

/**
 * Scripted intake conversation. Everything the visitor sees is defined here so
 * the same components can run a different flow per site.
 */

export type IntakeAnswers = Record<string, string>;

/** One or more bot bubbles, optionally personalized from earlier answers. */
export type IntakePrompt = string | string[] | ((answers: IntakeAnswers) => string | string[]);

type BaseStep = {
  id: string;
  prompt: IntakePrompt;
};

export type ChoiceStep = BaseStep & { kind: "choice"; options: string[] };
export type TextStep = BaseStep & { kind: "text"; placeholder?: string };
// Contact steps always store under fixed keys: firstName/lastName, phone, email.
export type NameStep = BaseStep & { kind: "name" };
export type PhoneStep = BaseStep & { kind: "phone" };
export type EmailStep = BaseStep & { kind: "email" };

export type IntakeStep = ChoiceStep | TextStep | NameStep | PhoneStep | EmailStep;

export type IntakeFlow = {
  host: {
    name: string;
    title: string;
    avatar: string;
  };
  panelImage: string;
  steps: IntakeStep[];
  closing: IntakePrompt;
};

export const intakeFlow: IntakeFlow = {
  host: {
    name: site.name,
    title: offices.map((office) => office.city).join(" · "),
    avatar: "/brand/mark.png"
  },
  panelImage: "/home/hero.jpg",
  steps: [
    {
      id: "matterType",
      kind: "choice",
      prompt: [`Hi, thanks for reaching out to ${site.name}.`, "What can we help you with today?"],
      options: [...practiceAreas.map((area) => area.label), "Something else"]
    },
    {
      id: "situation",
      kind: "text",
      prompt: "Could you briefly tell us about your situation?",
      placeholder: "Type your message…"
    },
    {
      id: "name",
      kind: "name",
      prompt: ["Thank you for sharing that.", "What is your full name?"]
    },
    {
      id: "phone",
      kind: "phone",
      prompt: (answers) => `Thanks, ${answers.firstName}. What's the best phone number to reach you?`
    },
    {
      id: "email",
      kind: "email",
      prompt: "And what is your email address?"
    },
    {
      id: "office",
      kind: "choice",
      prompt: "Which office is most convenient for you?",
      options: [...offices.map((office) => office.city), "No preference"]
    },
    {
      id: "timing",
      kind: "choice",
      prompt: "How soon are you hoping to get help?",
      options: ["As soon as possible", "Within the next few weeks", "Just planning ahead"]
    }
  ],
  closing: (answers) => [
    `Thank you, ${answers.firstName}. That's everything we need for now.`,
    "A member of our team will review your situation and reach out soon."
  ]
};

export function resolvePrompt(prompt: IntakePrompt, answers: IntakeAnswers): string[] {
  const value = typeof prompt === "function" ? prompt(answers) : prompt;
  return Array.isArray(value) ? value : [value];
}
