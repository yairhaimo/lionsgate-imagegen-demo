import type {
  Franchise,
  FranchisePreset,
  ImageQuality,
  PfpAvatarCount,
} from "lionsgate-club-imagegen";

export type Mode = "franchise" | "pfp";

export type FormValues = {
  file: File | null;
  franchise: Franchise;
  mode: Mode;
  name: string;
  numOfAvatars: PfpAvatarCount;
  preset: FranchisePreset;
  quality: ImageQuality;
};

export type ResultValues = {
  error: string | null;
  generationId: string | null;
  imageUrl: string | null;
  isGenerating: boolean;
  isPartialImage: boolean;
  pfpUrls: string[];
  requestProgress: number;
  status: string;
  uploadedUrl: string | null;
};

export type PlaygroundController = {
  canGenerate: boolean;
  form: FormValues;
  previewUrl: string | null;
  result: ResultValues;
  selectFile: (file: File | null) => void;
  selectMode: (mode: Mode) => void;
  setFranchise: (franchise: FormValues["franchise"]) => void;
  setName: (name: string) => void;
  setNumOfAvatars: (count: FormValues["numOfAvatars"]) => void;
  setPreset: (preset: FormValues["preset"]) => void;
  setQuality: (quality: FormValues["quality"]) => void;
  submit: () => Promise<void>;
};

export type SelectOption<T extends number | string> = {
  label: string;
  value: T;
};

export type ModeContent = {
  emptyResult: string;
  idle: string;
  submit: string;
  title: string;
};
