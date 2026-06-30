import type {
  Franchise,
  FranchisePreset,
  ImageQuality,
  PfpAvatarCount,
} from "lionsgate-club-imagegen";
import type { Mode, ModeContent, SelectOption } from "./playground-types";

export const modeOptions: Array<SelectOption<Mode>> = [
  { label: "Create PFP", value: "pfp" },
  { label: "Create Shareable Image", value: "franchise" },
];

export const modeContent: Record<Mode, ModeContent> = {
  franchise: {
    emptyResult: "Shareable image appears here",
    idle: "Ready for shareable generation",
    submit: "Create Shareable Image",
    title: "Shareable image generator",
  },
  pfp: {
    emptyResult: "PFPs appear here",
    idle: "Ready for PFP generation",
    submit: "Create PFP",
    title: "PFP generator",
  },
};

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
  { label: "4 PFPs", value: 4 },
  { label: "16 PFPs", value: 16 },
];
