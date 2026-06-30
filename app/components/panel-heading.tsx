import styles from "../styles/preview.module.css";

export function PanelHeading({
  detail,
  title,
}: {
  detail?: string;
  title: string;
}) {
  return (
    <div className={styles.panelHeading}>
      <h2>{title}</h2>
      {detail ? <span>{detail}</span> : null}
    </div>
  );
}
