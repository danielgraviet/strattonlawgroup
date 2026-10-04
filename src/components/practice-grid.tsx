import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { practiceAreas } from "@/lib/site";
import styles from "./practice-grid.module.css";

export function PracticeGrid() {
  return (
    <div className={styles.grid}>
      {practiceAreas.map((area) => (
        <Link className={styles.card} href={`/${area.slug}`} key={area.slug}>
          <div className={styles.media}>
            <Image
              src={`/services/${area.slug}.jpg`}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 280px"
            />
          </div>
          <div className={styles.body}>
            <h3>{area.label}</h3>
            <p>{area.summary}</p>
            <span className={styles.more}>
              Learn more <ArrowRight aria-hidden="true" size={16} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
