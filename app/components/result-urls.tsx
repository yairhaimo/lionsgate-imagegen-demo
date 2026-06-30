import type { FormValues, ResultValues } from "../playground-types";
import styles from "../styles/urls.module.css";

export function ResultUrls({
  form,
  result,
}: {
  form: FormValues;
  result: ResultValues;
}) {
  const resultUrl =
    form.mode === "pfp"
      ? (result.pfpUrls[0] ?? "Waiting")
      : (result.imageUrl ?? "Waiting");

  return (
    <dl className={styles.urls}>
      <ResultUrl
        label="Upload URL"
        value={result.uploadedUrl ?? "Not uploaded"}
      />
      <ResultUrl label="Result URL" value={resultUrl} />
    </dl>
  );
}

function ResultUrl({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value ?? "Not started"}</dd>
    </div>
  );
}
