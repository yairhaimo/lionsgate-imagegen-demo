import type { FormEvent } from "react";
import {
  franchiseOptions,
  modeContent,
  pfpCountOptions,
  presetOptions,
  qualityOptions,
} from "../playground-options";
import type { PlaygroundController } from "../playground-types";
import styles from "../styles/form.module.css";
import actionStyles from "../styles/form-actions.module.css";
import { FileField, SelectField, TextField } from "./form-fields";
import { GenerationFormHeader } from "./generation-form-header";
import { GenerationStatus } from "./generation-status";

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
      <GenerationFormHeader form={form} />

      <div className={styles.fields}>
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
          hint="Higher quality can increase generation time."
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
      </div>

      <div className={actionStyles.progress}>
        <span style={{ width: `${result.requestProgress}%` }} />
      </div>

      <button
        className={actionStyles.submitButton}
        disabled={!canGenerate}
        type="submit"
      >
        {result.isGenerating ? "Generating" : modeContent[form.mode].submit}
      </button>

      <GenerationStatus result={result} />
    </form>
  );
}
