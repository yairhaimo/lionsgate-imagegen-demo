"use client";

import Image from "next/image";
import { restingShareableCardStyle } from "../shareable-card-style";
import styles from "../styles/shareable-card.module.css";
import effectStyles from "../styles/shareable-card-effects.module.css";
import layerStyles from "../styles/shareable-card-layers.module.css";
import { useShareableCardTilt } from "../use-shareable-card-tilt";
import { ShareableLoaderOverlay } from "./shareable-loader";

export function ShareableImageCard({
  alt,
  isPartial,
  onOpen,
  showLoader,
  src,
}: {
  alt: string;
  isPartial: boolean;
  onOpen: () => void;
  showLoader: boolean;
  src: string;
}) {
  const card = useShareableCardTilt();
  const imageClassName = isPartial
    ? `${layerStyles.image} ${layerStyles.imagePartial}`
    : layerStyles.image;

  return (
    <div className={styles.shell}>
      <div className={styles.grid} />
      <div className={styles.shadow} />
      <button
        aria-label={`Open ${alt}`}
        className={`${styles.stage} ${effectStyles.stage}`}
        onClick={onOpen}
        onDragStart={(event) => event.preventDefault()}
        onLostPointerCapture={card.handleLostPointerCapture}
        onPointerCancel={card.finishTiltDrag}
        onPointerDown={card.startTiltDrag}
        onPointerLeave={card.handlePointerLeave}
        onPointerMove={card.updateTilt}
        onPointerUp={card.finishTiltDrag}
        type="button"
      >
        <div
          className={styles.card}
          ref={card.cardRef}
          style={restingShareableCardStyle}
        >
          <div className={effectStyles.glow} />
          <div className={layerStyles.face}>
            <div className={layerStyles.faceGradient} />
            <div className={layerStyles.surface}>
              <Image
                alt=""
                className={imageClassName}
                draggable={false}
                height={1200}
                src={src}
                unoptimized
                width={900}
              />
              <div className={layerStyles.imageShade} />
              {showLoader ? <ShareableLoaderOverlay /> : null}
            </div>
            <div className={layerStyles.ring} />
          </div>
          <div className={effectStyles.glare} />
          <div className={effectStyles.shine} />
        </div>
      </button>
    </div>
  );
}
