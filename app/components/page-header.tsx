import styles from "../styles/header.module.css";

export function PageHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Lionsgate Club</p>
        <h1>Image Playground</h1>
        <p className={styles.status}>API</p>
      </div>
    </header>
  );
}
