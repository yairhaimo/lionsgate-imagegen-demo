import { imageApiBaseUrl, imageApiKey } from "@/lib/api";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(
  _request: Request,
  context: { params: Promise<{ generationId: string }> },
) {
  const { generationId } = await context.params;
  const response = await fetch(
    `${imageApiBaseUrl()}/v1/results/${generationId}/events`,
    {
      headers: {
        Authorization: `Bearer ${imageApiKey()}`,
      },
    },
  );

  if (!response.body) {
    return new Response("event: error\ndata: {}\n\n", {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  }

  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
