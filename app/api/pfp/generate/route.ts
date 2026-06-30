import type {
  Franchise,
  GeneratePfpFromFileInput,
  ImageQuality,
  PfpAvatarCount,
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
const imageQualities = new Set<string>(["low", "medium", "high"]);
const pfpAvatarCounts = new Set<string>(["4", "16"]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const franchise = requiredFormString(formData, "franchise");
    const file = requiredFormFile(formData, "file");
    const quality = optionalFormString(formData, "quality");
    const numOfAvatars = optionalFormString(formData, "num_of_avatars");

    if (!franchises.has(franchise)) {
      throw new Error("Unsupported franchise.");
    }

    if (quality && !imageQualities.has(quality)) {
      throw new Error("Unsupported image quality.");
    }

    if (numOfAvatars && !pfpAvatarCounts.has(numOfAvatars)) {
      throw new Error("Unsupported number of avatars.");
    }

    const input: GeneratePfpFromFileInput = {
      file,
      fileName: file.name,
      franchise: franchise as Franchise,
    };

    if (numOfAvatars) {
      input.numOfAvatars = Number(numOfAvatars) as PfpAvatarCount;
    }
    if (quality) {
      input.quality = quality as ImageQuality;
    }

    const result = await imageClient().generatePfpFromFile(input);

    return Response.json(result, { status: 202 });
  } catch (error) {
    return jsonErrorResponse(error);
  }
}
