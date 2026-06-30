import type {
  Franchise,
  FranchisePreset,
  ImageQuality,
  PfpAvatarCount,
} from "lionsgate-club-imagegen";
import type { Mode, SelectOption } from "./playground-types";

export const modeOptions: Array<SelectOption<Mode>> = [
  { label: "Franchise image", value: "franchise" },
  { label: "Profile pictures", value: "pfp" },
];

export const franchiseOptions: Array<SelectOption<Franchise>> = [
  { label: "Hunger Games", value: "hunger_games" },
  { label: "John Wick", value: "john_wick" },
];

export const presetOptions: Array<SelectOption<FranchisePreset>> = [
  { label: "General image", value: "general_image" },
  { label: "Character card", value: "character_card" },
];

export const qualityOptions: Array<SelectOption<ImageQuality>> = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export const pfpCountOptions: Array<SelectOption<PfpAvatarCount>> = [
  { label: "4", value: 4 },
  { label: "16", value: 16 },
];
