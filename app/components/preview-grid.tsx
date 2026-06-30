import type { PlaygroundController } from "../playground-types";
import styles from "../styles/layout.module.css";
import { ImagePanel } from "./image-panel";
import { OutputPanel } from "./output-panel";

export function PreviewGrid({
  controller,
}: {
  controller: PlaygroundController;
}) {
  return (
    <section className={styles.previewGrid}>
      <ImagePanel
        alt="Selected user upload"
        badge={controller.form.file ? "Loaded" : "Waiting"}
        emptyLabel="Portrait preview"
        title="Source"
        url={controller.previewUrl}
      />

      <OutputPanel
        franchise={controller.form.franchise}
        imageUrl={controller.result.imageUrl}
        isGenerating={controller.result.isGenerating}
        isPartialImage={controller.result.isPartialImage}
        mode={controller.form.mode}
        numOfAvatars={controller.form.numOfAvatars}
        pfpUrls={controller.result.pfpUrls}
      />
    </section>
  );
}
