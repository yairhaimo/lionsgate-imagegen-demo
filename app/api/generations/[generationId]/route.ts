import { imageApiBaseUrl, imageApiKey, proxyJsonResponse } from "@/lib/api";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(
  _request: Request,
  context: { params: Promise<{ generationId: string }> },
) {
  const { generationId } = await context.params;
  const response = await fetch(
    `${imageApiBaseUrl()}/v1/results/${generationId}`,
    {
      headers: {
        Authorization: `Bearer ${imageApiKey()}`,
      },
    },
  );

  return proxyJsonResponse(response);
}
