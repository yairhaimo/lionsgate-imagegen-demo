import type { PlaygroundController } from "../playground-types";
import styles from "../styles/layout.module.css";
import { GenerationForm } from "./generation-form";
import { ModeSwitch } from "./mode-switch";
import { PageHeader } from "./page-header";
import { PreviewGrid } from "./preview-grid";
import { ResultUrls } from "./result-urls";

export function PlaygroundView({
  controller,
}: {
  controller: PlaygroundController;
}) {
  return (
    <main className={styles.page}>
      <PageHeader status={controller.result.status} />
      <ModeSwitch
        mode={controller.form.mode}
        onChange={controller.selectMode}
      />
      <div className={styles.layout}>
        <GenerationForm controller={controller} />
        <PreviewGrid controller={controller} />
      </div>
      <ResultUrls form={controller.form} result={controller.result} />
    </main>
  );
}
