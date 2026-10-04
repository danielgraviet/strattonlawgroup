import Image from "next/image";
import Link from "next/link";
import { PhoneCta } from "@/components/phone-cta";
import { navItems, site } from "@/lib/site";
import styles from "./header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.brand} href="/" aria-label={`${site.name} home`}>
          <Image src="/brand/logo.png" alt={site.name} width={218} height={48} priority />
        </Link>
        <nav className={styles.nav} aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <a href={site.clientPortalUrl} target="_blank" rel="noopener noreferrer">
            Client Portal
          </a>
        </nav>
        <PhoneCta className={styles.cta} />
      </div>
    </header>
  );
}
