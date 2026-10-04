import { MapPin } from "lucide-react";
import { formatOfficeAddress, offices } from "@/lib/site";
import styles from "./office-list.module.css";

export function OfficeList() {
  return (
    <ul className={styles.list}>
      {offices.map((office) => {
        const address = formatOfficeAddress(office);
        return (
          <li className={styles.office} key={office.city}>
            <MapPin aria-hidden="true" />
            <div>
              <h3>{office.region}</h3>
              <p>
                {office.street}
                <br />
                {office.city}, UT {office.postalCode}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get directions
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
