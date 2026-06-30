import { postForm } from "./request";
import type {
  FranchiseImageInput,
  GenerateRouteResponse,
  ProfilePicturesInput,
} from "./types";

export function generateFranchiseImage(input: FranchiseImageInput) {
  const formData = new FormData();
  formData.set("file", input.file, input.file.name);
  formData.set("franchise", input.franchise);
  formData.set("name", input.name);
  formData.set("preset", input.preset);
  formData.set("quality", input.quality);

  return postForm<GenerateRouteResponse>("/api/shareable/generate", formData);
}

export function generateProfilePictures(input: ProfilePicturesInput) {
  const formData = new FormData();
  formData.set("file", input.file, input.file.name);
  formData.set("franchise", input.franchise);
  formData.set("num_of_avatars", String(input.numOfAvatars));
  formData.set("quality", input.quality);

  return postForm<GenerateRouteResponse>("/api/pfp/generate", formData);
}
