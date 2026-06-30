import styles from "../styles/header.module.css";

export function PageHeader({ status }: { status: string }) {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>Lionsgate Club</p>
      <h1>Image API Playground</h1>
      <p className={styles.status}>{status}</p>
    </header>
  );
}
