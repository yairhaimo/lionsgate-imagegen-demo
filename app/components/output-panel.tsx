import type { Franchise } from "lionsgate-club-imagegen";
import { modeContent } from "../playground-options";
import type { Mode } from "../playground-types";
import styles from "../styles/preview.module.css";
import { EmptyState } from "./empty-state";
import { Panel } from "./panel";
import { PfpGrid } from "./pfp-grid";
import { ShareableOutputPanel } from "./shareable-output-panel";

export function OutputPanel({
  franchise,
  imageUrl,
  isGenerating,
  isPartialImage,
  mode,
  numOfAvatars,
  pfpUrls,
}: {
  franchise: Franchise;
  imageUrl: string | null;
  isGenerating: boolean;
  isPartialImage: boolean;
  mode: Mode;
  numOfAvatars: number;
  pfpUrls: string[];
}) {
  if (mode !== "pfp") {
    return (
      <ShareableOutputPanel
        franchise={franchise}
        imageUrl={imageUrl}
        isGenerating={isGenerating}
        isPartialImage={isPartialImage}
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
