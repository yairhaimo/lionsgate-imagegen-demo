import { modeContent } from "../playground-options";
import type { Mode } from "../playground-types";
import styles from "../styles/preview.module.css";
import { EmptyState } from "./empty-state";
import { ImagePanel } from "./image-panel";
import { Panel } from "./panel";
import { PfpGrid } from "./pfp-grid";

export function OutputPanel({
  imageUrl,
  isGenerating,
  isPartialImage,
  mode,
  numOfAvatars,
  pfpUrls,
}: {
  imageUrl: string | null;
  isGenerating: boolean;
  isPartialImage: boolean;
  mode: Mode;
  numOfAvatars: number;
  pfpUrls: string[];
}) {
  if (mode !== "pfp") {
    return (
      <ImagePanel
        alt={isPartialImage ? "Partial generated image" : "Generated image"}
        badge={franchiseBadge({ imageUrl, isGenerating, isPartialImage })}
        emptyLabel={modeContent.franchise.emptyResult}
        title="Output"
        url={imageUrl}
      />
    );
  }

  return (
    <Panel
      detail={pfpBadge({ isGenerating, numOfAvatars, pfpUrls })}
      title="Output"
    >
      <div className={styles.previewBody}>
        {pfpUrls.length > 0 ? (
          <PfpGrid urls={pfpUrls} />
        ) : (
          <EmptyState label={modeContent.pfp.emptyResult} />
        )}
      </div>
    </Panel>
  );
}

function pfpBadge({
  isGenerating,
  numOfAvatars,
  pfpUrls,
}: {
  isGenerating: boolean;
  numOfAvatars: number;
  pfpUrls: string[];
}) {
  if (pfpUrls.length > 0) {
    return `${pfpUrls.length} PFPs`;
  }

  return isGenerating ? `${numOfAvatars} PFPs` : "Waiting";
}

function franchiseBadge({
  imageUrl,
  isGenerating,
  isPartialImage,
}: {
  imageUrl: string | null;
  isGenerating: boolean;
  isPartialImage: boolean;
}) {
  if (imageUrl && !isPartialImage) {
    return "Final";
  }

  if (isPartialImage) {
    return "Blurred partial";
  }

  return isGenerating ? "Generating" : "Placeholder";
}
