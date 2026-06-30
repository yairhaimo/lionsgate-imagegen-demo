"use client";

import { useEffect, useState } from "react";

export function usePreviewUrl() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function setPreviewFile(file: File | null) {
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  return [previewUrl, setPreviewFile] as const;
}
