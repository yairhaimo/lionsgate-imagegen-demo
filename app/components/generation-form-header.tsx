import { franchiseOptions, modeContent } from "../playground-options";
import type { FormValues } from "../playground-types";
import styles from "../styles/form-header.module.css";

export function GenerationFormHeader({ form }: { form: FormValues }) {
  const franchise = franchiseOptions.find(
    (option) => option.value === form.franchise,
  );

  return (
    <div className={styles.header}>
      <p>{franchise?.label ?? form.franchise}</p>
      <h2>{modeContent[form.mode].title}</h2>
    </div>
  );
}
