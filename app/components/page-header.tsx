import styles from "../styles/layout.module.css";

export function PageHeader({ status }: { status: string }) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>Lionsgate Club</p>
        <h1>Image API Playground</h1>
      </div>
      <p className={styles.status}>{status}</p>
    </header>
  );
}
