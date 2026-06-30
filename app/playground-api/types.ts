import type {
  Franchise,
  FranchisePreset,
  GenerationStartResponse,
  ImageQuality,
  PfpAvatarCount,
  UploadUserImageResponse,
} from "lionsgate-club-imagegen";

export type GenerateRouteResponse = {
  generation: GenerationStartResponse;
  upload: UploadUserImageResponse;
};

export type FranchiseImageInput = {
  file: File;
  franchise: Franchise;
  name: string;
  preset: FranchisePreset;
  quality: ImageQuality;
};

export type ProfilePicturesInput = {
  file: File;
  franchise: Franchise;
  numOfAvatars: PfpAvatarCount;
  quality: ImageQuality;
};
