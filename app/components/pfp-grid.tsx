import Image from "next/image";
import styles from "../styles/pfp-grid.module.css";

export function PfpGrid({ urls }: { urls: string[] }) {
  return (
    <div className={styles.pfpGrid}>
      {urls.map((url, index) => (
        <a href={url} key={url} rel="noreferrer" target="_blank">
          <Image
            alt={`Generated avatar ${index + 1}`}
            height={512}
            src={url}
            unoptimized
            width={512}
          />
        </a>
      ))}
    </div>
  );
}
