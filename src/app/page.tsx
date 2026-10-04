import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { OfficeList } from "@/components/office-list";
import { PhoneCta } from "@/components/phone-cta";
import { PracticeGrid } from "@/components/practice-grid";
import { TeamGrid } from "@/components/team-grid";
import { site } from "@/lib/site";
import styles from "./page.module.css";

const steps = [
  {
    title: "Tell us where you are",
    copy: "Share what's going on with your family, business, or situation. You don't need every answer before reaching out."
  },
  {
    title: "Get a clear path forward",
    copy: "We'll explain your options in plain language and what each one means for you."
  },
  {
    title: "Climb it together",
    copy: "From the first document to the final step, our team stays with you the whole way."
  }
];

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/home/hero.jpg"
          alt="The Stratton Law Group partners together in the Utah mountains"
          fill
          priority
          sizes="100vw"
        />
        <span className={styles.heroOverlay} aria-hidden="true" />
        <div className={`container ${styles.heroContent}`}>
          <p className={styles.heroEyebrow}>Pleasant Grove · St. George · South Jordan</p>
          <h1>{site.tagline}</h1>
          <p className={styles.heroLead}>
            At times, life can feel like a mountain that you climb alone. At {site.name}, our
            hands are outstretched and ready to help you conquer life&apos;s toughest peaks.
          </p>
          <div className="button-row">
            <PhoneCta label={`Call ${site.phone}`} />
            <Link className={`button secondary ${styles.heroSecondary}`} href="/our-services">
              Explore our services <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="services-title">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow">Our services</p>
              <h2 id="services-title">Covered at every stage of life and business.</h2>
            </div>
            <Link className="button secondary" href="/our-services">
              All services <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
          <PracticeGrid />
        </div>
      </section>

      <section className={`section band ${styles.stepsSection}`} aria-labelledby="steps-title">
        <div className={`container ${styles.stepsLayout}`}>
          <div>
            <p className="eyebrow">How we help</p>
            <h2 id="steps-title">You don&apos;t have to make the climb alone.</h2>
            <p className="lead">
              Whether you&apos;re planning for your family, building a business, or facing a
              setback, it starts with a simple conversation.
            </p>
            <PhoneCta label={`Talk with our team: ${site.phone}`} />
          </div>
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={step.title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="team-title">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow">Our team</p>
              <h2 id="team-title">Attorneys who care about people and results.</h2>
            </div>
            <Link className="button secondary" href="/our-team">
              Meet the team <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
          <TeamGrid />
        </div>
      </section>

      <section className="section band" aria-labelledby="offices-title">
        <div className="container">
          <p className="eyebrow">Our offices</p>
          <h2 id="offices-title">Three Utah offices, one team.</h2>
          <OfficeList />
        </div>
      </section>

      <section className={styles.ctaBand}>
        <div className={`container ${styles.ctaInner}`}>
          <div>
            <h2>Ready to take the next step?</h2>
            <p>Call us or send a message and we&apos;ll be in touch soon.</p>
          </div>
          <div className="button-row">
            <PhoneCta />
            <Link className={`button secondary ${styles.ctaSecondary}`} href="/contact">
              <Mail aria-hidden="true" size={18} /> Send a message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
