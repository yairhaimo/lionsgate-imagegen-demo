import { imageApiBaseUrl, imageApiKey, proxyJsonResponse } from "@/lib/api";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.text();
  const response = await fetch(`${imageApiBaseUrl()}/v1/franchise/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${imageApiKey()}`,
      "Content-Type": "application/json",
    },
    body,
  });

  return proxyJsonResponse(response);
}
