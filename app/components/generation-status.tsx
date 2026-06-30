import type { ResultValues } from "../playground-types";
import styles from "../styles/generation-status.module.css";

export function GenerationStatus({ result }: { result: ResultValues }) {
  return (
    <div className={styles.statusBlock}>
      <p>Status: {result.status}</p>
      {result.generationId ? <p>Generation: {result.generationId}</p> : null}
      {result.error ? <p className={styles.error}>{result.error}</p> : null}
    </div>
  );
}
