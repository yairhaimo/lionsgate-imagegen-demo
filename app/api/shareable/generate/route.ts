import type {
  Franchise,
  FranchisePreset,
  GenerateFranchiseImageInput,
  ImageQuality,
} from "lionsgate-club-imagegen";
import {
  imageClient,
  jsonErrorResponse,
  optionalFormString,
  requiredFormFile,
  requiredFormString,
} from "@/lib/api";

export const runtime = "nodejs";
export const maxDuration = 60;

const franchises = new Set<string>(["hunger_games", "john_wick"]);
const franchisePresets = new Set<string>(["general_image", "character_card"]);
const imageQualities = new Set<string>(["low", "medium", "high"]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = requiredFormString(formData, "name");
    const franchise = requiredFormString(formData, "franchise");
    const file = requiredFormFile(formData, "file");
    const preset = requiredFormString(formData, "preset");
    const quality = optionalFormString(formData, "quality");

    if (!franchises.has(franchise)) {
      throw new Error("Unsupported franchise.");
    }

    if (quality && !imageQualities.has(quality)) {
      throw new Error("Unsupported image quality.");
    }

    if (!franchisePresets.has(preset)) {
      throw new Error("Unsupported franchise preset.");
    }

    const input: GenerateFranchiseImageInput = {
      file,
      fileName: file.name,
      franchise: franchise as Franchise,
      name,
      preset: preset as FranchisePreset,
      partialImageTransform: "blur",
      blurPartialImages: true,
    };

    if (quality) {
      input.quality = quality as ImageQuality;
    }

    const result = await imageClient().generateFranchiseImage(input);

    return Response.json(result, { status: 202 });
  } catch (error) {
    return jsonErrorResponse(error);
  }
}
