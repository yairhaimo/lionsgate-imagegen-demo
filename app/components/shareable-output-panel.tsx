import type { Franchise } from "lionsgate-club-imagegen";
import { shareablePlaceholderImages } from "../shareable-placeholders";
import { Panel } from "./panel";
import { ShareableImageCard } from "./shareable-image-card";

export function ShareableOutputPanel({
  franchise,
  imageUrl,
  isGenerating,
  isPartialImage,
}: {
  franchise: Franchise;
  imageUrl: string | null;
  isGenerating: boolean;
  isPartialImage: boolean;
}) {
  const placeholder = shareablePlaceholderImages[franchise];
  const src = imageUrl ?? placeholder.src;
  const alt = getShareableAlt({ imageUrl, isPartialImage, placeholder });

  return (
    <Panel
      detail={shareableBadge({ imageUrl, isGenerating, isPartialImage })}
      title="Output"
    >
      <ShareableImageCard
        alt={alt}
        isPartial={isPartialImage}
        showLoader={isGenerating}
        src={src}
      />
    </Panel>
  );
}

function getShareableAlt({
  imageUrl,
  isPartialImage,
  placeholder,
}: {
  imageUrl: string | null;
  isPartialImage: boolean;
  placeholder: { alt: string };
}) {
  if (!imageUrl) {
    return placeholder.alt;
  }

  return isPartialImage
    ? "Blurred partial shareable image"
    : "Generated shareable image";
}

function shareableBadge({
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
