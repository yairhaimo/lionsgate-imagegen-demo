import { modeOptions } from "../playground-options";
import type { Mode } from "../playground-types";
import styles from "../styles/layout.module.css";

export function ModeSwitch({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) {
  return (
    <div className={styles.modeSwitch}>
      {modeOptions.map((option) => (
        <button
          className={`${styles.modeButton} ${
            mode === option.value ? styles.modeButtonActive : ""
          }`}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
