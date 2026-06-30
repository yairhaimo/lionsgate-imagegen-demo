import Image from "next/image";
import styles from "../styles/preview.module.css";
import { EmptyState } from "./empty-state";
import { Panel } from "./panel";

export function ImagePanel({
  alt,
  badge,
  emptyLabel,
  title,
  url,
}: {
  alt: string;
  badge?: string;
  emptyLabel: string;
  title: string;
  url: string | null;
}) {
  return (
    <Panel detail={badge} title={title}>
      <div className={styles.imageFrame}>
        {url ? (
          <Image alt={alt} height={1200} src={url} unoptimized width={900} />
        ) : (
          <EmptyState label={emptyLabel} />
        )}
      </div>
    </Panel>
  );
}
