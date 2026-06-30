import type {
  ApiErrorPayload,
  GenerationResult,
} from "lionsgate-club-imagegen";

export function parseJson(value: string) {
  try {
    return JSON.parse(value || "{}") as unknown;
  } catch {
    return {};
  }
}

export function errorMessage(payload: unknown) {
  if (isApiErrorPayload(payload)) {
    return payload.error.message;
  }

  return "Request failed.";
}

export function isGenerationResult(
  payload: unknown,
): payload is GenerationResult {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as { generation_id?: unknown }).generation_id === "string"
  );
}

function isApiErrorPayload(payload: unknown): payload is ApiErrorPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const error = (payload as { error?: { message?: unknown } }).error;
  return typeof error?.message === "string";
}
