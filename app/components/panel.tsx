import type { ReactNode } from "react";
import styles from "../styles/preview.module.css";
import { PanelHeading } from "./panel-heading";

export function Panel({
  children,
  detail,
  title,
}: {
  children: ReactNode;
  detail?: string;
  title: string;
}) {
  return (
    <section className={styles.panel}>
      <PanelHeading detail={detail} title={title} />
      {children}
    </section>
  );
}
