"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { initialForm } from "./playground-defaults";
import { modeContent } from "./playground-options";
import { emptyResult, failedResult } from "./playground-result";
import type {
  FormValues,
  Mode,
  PlaygroundController,
} from "./playground-types";
import { submitGeneration } from "./submit-generation";
import { usePreviewUrl } from "./use-preview-url";

export function usePlayground(): PlaygroundController {
  const [form, setForm] = useState<FormValues>(initialForm);
  const [previewUrl, setPreviewFile] = usePreviewUrl();
  const [result, setResult] = useState(emptyResult);
  const closeStreamRef = useRef<(() => void) | null>(null);

  const canGenerate = useMemo(() => {
    if (!form.file || result.isGenerating) {
      return false;
    }

    return form.mode === "pfp" || form.name.trim().length > 0;
  }, [form.file, form.mode, form.name, result.isGenerating]);

  useEffect(() => {
    return () => {
      closeStreamRef.current?.();
      closeStreamRef.current = null;
    };
  }, []);

  function closeStream() {
    closeStreamRef.current?.();
    closeStreamRef.current = null;
  }

  function resetResult(status = modeContent[form.mode].idle) {
    closeStream();
    setResult(emptyResult(status));
  }

  function updateForm(patch: Partial<FormValues>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function selectFile(file: File | null) {
    updateForm({ file });
    setPreviewFile(file);
    resetResult();
  }

  function selectMode(mode: Mode) {
    if (mode === form.mode) {
      return;
    }

    updateForm({ mode });
    resetResult(modeContent[mode].idle);
  }

  async function submit() {
    const values = form;

    if (!values.file) {
      setResult((current) =>
        failedResult(current, "Choose a user image first."),
      );
      return;
    }

    await submitGeneration(values, {
      closeStream,
      setResult,
      setStreamCloser: (closer) => {
        closeStreamRef.current = closer;
      },
    });
  }

  return {
    canGenerate,
    form,
    previewUrl,
    result,
    selectFile,
    selectMode,
    setFranchise: (franchise) => updateForm({ franchise }),
    setName: (name) => updateForm({ name }),
    setNumOfAvatars: (numOfAvatars) => updateForm({ numOfAvatars }),
    setPreset: (preset) => updateForm({ preset }),
    setQuality: (quality) => updateForm({ quality }),
    submit,
  };
}
