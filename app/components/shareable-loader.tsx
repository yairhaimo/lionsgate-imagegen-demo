import styles from "../styles/shareable-loader.module.css";
import lineStyles from "../styles/shareable-loader-lines.module.css";
import overlayStyles from "../styles/shareable-loader-overlay.module.css";

export function ShareableLoader({ compact = false }: { compact?: boolean }) {
  const className = compact
    ? `${styles.graphic} ${styles.compact}`
    : styles.graphic;

  return (
    <div aria-hidden="true" className={className}>
      <span className={styles.frame} />
      <span className={lineStyles.scan} />
      <span className={styles.iris} />
      <span className={`${lineStyles.bar} ${lineStyles.barOne}`} />
      <span className={`${lineStyles.bar} ${lineStyles.barTwo}`} />
      <span className={`${lineStyles.bar} ${lineStyles.barThree}`} />
    </div>
  );
}

export function ShareableLoaderOverlay() {
  return (
    <div className={overlayStyles.overlay}>
      <ShareableLoader compact />
    </div>
  );
}
