import type { SelectOption } from "../playground-types";
import styles from "../styles/form.module.css";

export function TextField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

export function SelectField<T extends number | string>({
  hint,
  label,
  onChange,
  options,
  value,
}: {
  hint?: string;
  label: string;
  onChange: (value: T) => void;
  options: Array<SelectOption<T>>;
  value: T;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <select
        onChange={(event) => {
          const selected = options.find(
            (option) => String(option.value) === event.target.value,
          );
          onChange((selected?.value ?? event.target.value) as T);
        }}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function FileField({
  onChange,
}: {
  onChange: (file: File | null) => void;
}) {
  return (
    <label className={styles.field}>
      <span>User image</span>
      <input
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        type="file"
      />
    </label>
  );
}
