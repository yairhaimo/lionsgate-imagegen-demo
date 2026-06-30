import styles from "../styles/preview.module.css";

export function EmptyState({ label }: { label: string }) {
  return <div className={styles.emptyState}>{label}</div>;
}
