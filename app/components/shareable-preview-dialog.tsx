"use client";

import Image from "next/image";
import { useEffect } from "react";
import styles from "../styles/shareable-preview-dialog.module.css";

export function ShareablePreviewDialog({
  alt,
  onClose,
  url,
}: {
  alt: string;
  onClose: () => void;
  url: string;
}) {
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div
      aria-labelledby="shareable-dialog-title"
      aria-modal="true"
      className={styles.backdrop}
      role="dialog"
    >
      <div className={styles.dialog}>
        <div className={styles.heading}>
          <h2 id="shareable-dialog-title">Shareable image</h2>
          <button
            aria-label="Close shareable image preview"
            onClick={onClose}
            type="button"
          >
            &times;
          </button>
        </div>
        <div className={styles.imageFrame}>
          <Image alt={alt} height={1200} src={url} unoptimized width={900} />
        </div>
      </div>
    </div>
  );
}
