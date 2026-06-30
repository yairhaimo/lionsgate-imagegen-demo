import type { CSSProperties } from "react";

export type ShareableCardStyle = CSSProperties & {
  "--card-glare-opacity": string;
  "--card-glare-x": string;
  "--card-glare-y": string;
  "--card-rotate-x": string;
  "--card-rotate-y": string;
  "--card-shadow-x": string;
  "--card-shadow-y": string;
};

export const restingShareableCardStyle: ShareableCardStyle = {
  "--card-glare-opacity": "0",
  "--card-glare-x": "50%",
  "--card-glare-y": "18%",
  "--card-rotate-x": "0deg",
  "--card-rotate-y": "0deg",
  "--card-shadow-x": "0px",
  "--card-shadow-y": "32px",
};
