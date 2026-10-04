import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { PhoneCta } from "@/components/phone-cta";
import { TeamGrid } from "@/components/team-grid";
import { breadcrumbSchema, jsonLd } from "@/lib/schema";
import { site } from "@/lib/site";
import styles from "../[slug]/slug.module.css";

export const metadata: Metadata = {
  title: "Our Team",
  description: `Meet the attorneys of ${site.name}.`,
  alternates: { canonical: "/our-team" }
};

export default function TeamPage() {
  return (
    <>
      {jsonLd(
        breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Our Team", url: `${site.url}/our-team` }
        ])
      )}
      <section
        className={`${styles.hero} ${styles.heroWithImage}`}
        style={{ "--hero-image": 'url("/home/hero.jpg")' } as CSSProperties}
      >
        <div className="container">
          <p className="eyebrow">{site.name}</p>
          <h1>Our team.</h1>
          <p className="lead">
            We are a team of experienced, knowledgeable, and talented attorneys who genuinely care
            as much about our clients as we do the results that we achieve on their behalf.
          </p>
          <div className="button-row">
            <PhoneCta />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <TeamGrid />
        </div>
      </section>
    </>
  );
}
