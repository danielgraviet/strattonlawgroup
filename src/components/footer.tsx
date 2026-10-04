import Link from "next/link";
import { PhoneCta } from "@/components/phone-cta";
import { footerLinks, formatOfficeAddress, offices, site } from "@/lib/site";
import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          <p className={styles.brand}>{site.name}</p>
          <p className={styles.copy}>{site.tagline}</p>
          <ul className={styles.offices}>
            {offices.map((office) => (
              <li key={office.city}>
                <strong>{office.region}</strong>
                <span>{formatOfficeAddress(office)}</span>
              </li>
            ))}
          </ul>
          <p className={styles.copy}>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <PhoneCta />
        </div>
        <nav className={styles.links} aria-label="Footer navigation">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className={`container ${styles.legal}`}>
        <p>
          This website provides general information and is not legal advice.
          Contacting the firm does not create an attorney-client relationship.
        </p>
      </div>
    </footer>
  );
}
