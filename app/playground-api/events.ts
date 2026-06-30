import type { GenerationResult } from "lionsgate-club-imagegen";
import { errorMessage, isGenerationResult, parseJson } from "./response";

type GenerationSubscriptionHandlers = {
  onError: (message: string) => void;
  onReconnect: () => void;
  onUpdate: (result: GenerationResult) => void;
};

export function subscribeToGeneration(
  generationId: string,
  handlers: GenerationSubscriptionHandlers,
) {
  const source = new EventSource(
    `/api/generations/${encodeURIComponent(generationId)}/events`,
  );

  function handleGenerationEvent(event: MessageEvent<string>) {
    const payload = parseJson(event.data);

    if (isGenerationResult(payload)) {
      handlers.onUpdate(payload);
      return;
    }

    handlers.onError(errorMessage(payload));
    source.close();
  }

  function handleErrorEvent(event: Event) {
    if (event instanceof MessageEvent) {
      handleGenerationEvent(event);
      return;
    }

    handlers.onReconnect();
  }

  source.addEventListener("status", handleGenerationEvent);
  source.addEventListener("partial", handleGenerationEvent);
  source.addEventListener("final", handleGenerationEvent);
  source.addEventListener("error", handleErrorEvent);

  return () => source.close();
}
