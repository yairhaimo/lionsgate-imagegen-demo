import {
  LionsGateImageApiError,
  LionsGateImageClient,
} from "lionsgate-club-imagegen";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

export function imageApiBaseUrl() {
  return requiredEnv("IMAGE_API_BASE_URL").replace(/\/+$/, "");
}

export function imageApiKey() {
  return requiredEnv("IMAGE_API_KEY");
}

export function imageClient() {
  return new LionsGateImageClient({
    apiKey: imageApiKey(),
    baseUrl: imageApiBaseUrl(),
  });
}

export async function proxyJsonResponse(response: Response) {
  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}

export function jsonErrorResponse(error: unknown) {
  if (error instanceof LionsGateImageApiError) {
    return Response.json(error.payload, { status: error.status });
  }

  const message =
    error instanceof Error
      ? error.message
      : "The request could not be handled.";

  return Response.json(
    {
      error: {
        message,
        type: "api_error",
        param: null,
        code: null,
      },
    },
    { status: 500 },
  );
}

export function requiredFormString(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required form field: ${name}`);
  }
  return value.trim();
}

export function optionalFormString(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }
  return value.trim();
}

export function requiredFormFile(formData: FormData, name: string) {
  const value = formData.get(name);
  if (!(value instanceof File)) {
    throw new Error(`Missing required file field: ${name}`);
  }
  return value;
}
