import type { Franchise } from "lionsgate-club-imagegen";

export const shareablePlaceholderImages: Record<
  Franchise,
  { alt: string; src: string }
> = {
  hunger_games: {
    alt: "Hunger Games inspired placeholder shareable image",
    src: "/franchise-placeholders/hunger-games.png",
  },
  john_wick: {
    alt: "John Wick inspired placeholder shareable image",
    src: "/franchise-placeholders/john-wick.png",
  },
};
