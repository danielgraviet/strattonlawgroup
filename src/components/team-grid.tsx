import Image from "next/image";
import { attorneys } from "@/lib/site";
import styles from "./team-grid.module.css";

export function TeamGrid() {
  return (
    <ul className={styles.grid}>
      {attorneys.map((attorney) => (
        <li className={styles.member} key={attorney.name}>
          <div className={styles.photo}>
            <Image
              src={attorney.photo}
              alt={`Portrait of ${attorney.name}`}
              fill
              sizes="(max-width: 560px) 50vw, (max-width: 1000px) 33vw, 210px"
            />
          </div>
          <h3>{attorney.name}</h3>
          <p>{attorney.title}</p>
        </li>
      ))}
    </ul>
  );
}
