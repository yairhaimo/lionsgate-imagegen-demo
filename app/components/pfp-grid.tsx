"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "../styles/pfp-grid.module.css";
import { PfpPreviewDialog } from "./pfp-preview-dialog";

export function PfpGrid({ urls }: { urls: string[] }) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  return (
    <>
      <div className={styles.pfpGrid}>
        {urls.map((url, index) => (
          <button
            aria-label={`Open profile picture ${index + 1}`}
            className={styles.thumbnailButton}
            key={url}
            onClick={() => setSelectedUrl(url)}
            type="button"
          >
            <Image
              alt={`Generated avatar ${index + 1}`}
              height={512}
              src={url}
              unoptimized
              width={512}
            />
          </button>
        ))}
      </div>

      {selectedUrl ? (
        <PfpPreviewDialog
          onClose={() => setSelectedUrl(null)}
          url={selectedUrl}
        />
      ) : null}
    </>
  );
}
