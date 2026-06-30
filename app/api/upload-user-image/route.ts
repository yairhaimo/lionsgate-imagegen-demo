import { imageApiBaseUrl, imageApiKey, proxyJsonResponse } from "@/lib/api";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const formData = await request.formData();
  const response = await fetch(`${imageApiBaseUrl()}/v1/uploads/user-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${imageApiKey()}`,
    },
    body: formData,
  });

  return proxyJsonResponse(response);
}
