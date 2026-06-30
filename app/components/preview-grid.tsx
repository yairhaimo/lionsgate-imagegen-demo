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
      <OutputPanel
        imageUrl={controller.result.imageUrl}
        isGenerating={controller.result.isGenerating}
        isPartialImage={controller.result.isPartialImage}
        mode={controller.form.mode}
        pfpUrls={controller.result.pfpUrls}
      />

      <ImagePanel
        alt="Selected user upload"
        emptyLabel="No image selected"
        title="Source"
        url={controller.previewUrl}
      />
    </section>
  );
}
