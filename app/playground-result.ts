import type {
  GenerationResult,
  GenerationStartResponse,
} from "lionsgate-club-imagegen";
import type { ResultValues } from "./playground-types";

type GenerationPayload = GenerationResult | GenerationStartResponse;

export function emptyResult(status = "Idle"): ResultValues {
  return {
    error: null,
    generationId: null,
    imageUrl: null,
    isGenerating: false,
    isPartialImage: false,
    pfpUrls: [],
    status,
    uploadedUrl: null,
  };
}

export function submittingResult() {
  return {
    ...emptyResult("Submitting"),
    isGenerating: true,
  };
}

export function failedResult(current: ResultValues, error: string) {
  return {
    ...current,
    error,
    isGenerating: false,
    status: "Failed",
  };
}

export function reconnectingResult(current: ResultValues) {
  return {
    ...current,
    status: "Reconnecting",
  };
}

export function resultWithUpload(current: ResultValues, uploadedUrl: string) {
  return {
    ...current,
    uploadedUrl,
  };
}

export function resultWithGeneration(
  current: ResultValues,
  generation: GenerationPayload,
) {
  return {
    ...current,
    error: generationError(generation) ?? current.error,
    generationId: generation.generation_id,
    imageUrl:
      generation.final_image_url ?? generation.partial_image_url ?? null,
    isGenerating: generation.done ? false : current.isGenerating,
    isPartialImage: Boolean(
      generation.partial_image_url && !generation.final_image_url,
    ),
    pfpUrls: generation.pfp_image_urls,
    status: generation.status,
  };
}

function generationError(generation: GenerationPayload) {
  if ("error" in generation && generation.error) {
    return generation.error.error.message;
  }

  return null;
}
