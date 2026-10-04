import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { PhoneCta } from "@/components/phone-cta";
import { PracticeGrid } from "@/components/practice-grid";
import { breadcrumbSchema, jsonLd } from "@/lib/schema";
import { site } from "@/lib/site";
import styles from "../[slug]/slug.module.css";

export const metadata: Metadata = {
  title: "Our Services",
  description: `${site.name} provides estate planning, business, visa, intellectual property, bankruptcy, real estate, personal injury, and non-profit legal services in Utah.`,
  alternates: { canonical: "/our-services" }
};

export default function ServicesPage() {
  return (
    <>
      {jsonLd(
        breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Our Services", url: `${site.url}/our-services` }
        ])
      )}
      <section
        className={`${styles.hero} ${styles.heroWithImage}`}
        style={{ "--hero-image": 'url("/services/gavel.jpg")' } as CSSProperties}
      >
        <div className="container">
          <p className="eyebrow">{site.name}</p>
          <h1>Our services.</h1>
          <p className="lead">
            A myriad of legal services that will have you covered no matter what stage of life or
            business you&apos;re in.
          </p>
          <div className="button-row">
            <PhoneCta />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <PracticeGrid />
        </div>
      </section>
    </>
  );
}
