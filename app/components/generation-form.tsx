import type { FormEvent } from "react";
import {
  franchiseOptions,
  pfpCountOptions,
  presetOptions,
  qualityOptions,
} from "../playground-options";
import type { PlaygroundController } from "../playground-types";
import styles from "../styles/form.module.css";
import { FileField, SelectField, TextField } from "./form-fields";

export function GenerationForm({
  controller,
}: {
  controller: PlaygroundController;
}) {
  const { canGenerate, form, result } = controller;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void controller.submit();
  }

  return (
    <form className={styles.panel} onSubmit={submit}>
      {form.mode === "franchise" ? (
        <TextField
          label="Name"
          onChange={controller.setName}
          placeholder="Jane Wick"
          value={form.name}
        />
      ) : null}

      <SelectField
        label="Franchise"
        onChange={controller.setFranchise}
        options={franchiseOptions}
        value={form.franchise}
      />

      <SelectField
        label="Quality"
        onChange={controller.setQuality}
        options={qualityOptions}
        value={form.quality}
      />

      {form.mode === "franchise" ? (
        <SelectField
          label="Preset"
          onChange={controller.setPreset}
          options={presetOptions}
          value={form.preset}
        />
      ) : null}

      {form.mode === "pfp" ? (
        <SelectField
          label="PFP count"
          onChange={controller.setNumOfAvatars}
          options={pfpCountOptions}
          value={form.numOfAvatars}
        />
      ) : null}

      <FileField onChange={controller.selectFile} />

      <button
        className={styles.submitButton}
        disabled={!canGenerate}
        type="submit"
      >
        {result.isGenerating ? "Generating" : "Generate"}
      </button>

      {result.error ? <p className={styles.error}>{result.error}</p> : null}
    </form>
  );
}
