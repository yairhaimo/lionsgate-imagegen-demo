"use client";

import Image from "next/image";
import { useEffect } from "react";
import styles from "../styles/pfp-preview-dialog.module.css";

export function PfpPreviewDialog({
  onClose,
  url,
}: {
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
      aria-labelledby="pfp-dialog-title"
      aria-modal="true"
      className={styles.backdrop}
      role="dialog"
    >
      <div className={styles.dialog}>
        <div className={styles.heading}>
          <h2 id="pfp-dialog-title">Profile picture</h2>
          <button
            aria-label="Close profile picture preview"
            onClick={onClose}
            type="button"
          >
            &times;
          </button>
        </div>
        <div className={styles.imageFrame}>
          <Image
            alt="Generated profile picture full size"
            height={512}
            src={url}
            unoptimized
            width={512}
          />
        </div>
      </div>
    </div>
  );
}
