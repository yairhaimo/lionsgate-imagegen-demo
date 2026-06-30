import type { Mode } from "../playground-types";
import { EmptyState } from "./empty-state";
import { ImagePanel } from "./image-panel";
import { Panel } from "./panel";
import { PfpGrid } from "./pfp-grid";

export function OutputPanel({
  imageUrl,
  isGenerating,
  isPartialImage,
  mode,
  pfpUrls,
}: {
  imageUrl: string | null;
  isGenerating: boolean;
  isPartialImage: boolean;
  mode: Mode;
  pfpUrls: string[];
}) {
  if (mode !== "pfp") {
    return (
      <ImagePanel
        alt={isPartialImage ? "Partial generated image" : "Generated image"}
        badge={isPartialImage ? "Partial" : undefined}
        emptyLabel={isGenerating ? "Generating" : "Waiting"}
        title="Output"
        url={imageUrl}
      />
    );
  }

  return (
    <Panel detail={`${pfpUrls.length} images`} title="Output">
      {pfpUrls.length > 0 ? (
        <PfpGrid urls={pfpUrls} />
      ) : (
        <EmptyState label={isGenerating ? "Generating" : "Waiting"} />
      )}
    </Panel>
  );
}
