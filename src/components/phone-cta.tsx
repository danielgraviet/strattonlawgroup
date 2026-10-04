import { Phone } from "lucide-react";
import { site } from "@/lib/site";

type PhoneCtaProps = {
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export function PhoneCta({
  label = `Call ${site.phone}`,
  variant = "primary",
  className
}: PhoneCtaProps) {
  return (
    <a
      className={`button ${variant === "secondary" ? "secondary" : ""} ${className ?? ""}`}
      href={site.phoneHref}
      data-event="phone_click"
    >
      <Phone aria-hidden="true" size={19} />
      <span>{label}</span>
    </a>
  );
}

