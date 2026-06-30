import type { Dispatch, SetStateAction } from "react";
import {
  generateFranchiseImage,
  generateProfilePictures,
  subscribeToGeneration,
} from "./playground-api";
import {
  failedResult,
  reconnectingResult,
  resultWithGeneration,
  resultWithUpload,
  submittingResult,
} from "./playground-result";
import type { FormValues, ResultValues } from "./playground-types";

type StreamCloser = (() => void) | null;

type SubmitGenerationDeps = {
  closeStream: () => void;
  setResult: Dispatch<SetStateAction<ResultValues>>;
  setStreamCloser: (closer: StreamCloser) => void;
};

export async function submitGeneration(
  values: FormValues,
  deps: SubmitGenerationDeps,
) {
  deps.closeStream();
  deps.setResult(submittingResult());

  try {
    const response =
      values.mode === "franchise"
        ? await generateFranchiseImage({
            file: values.file as File,
            franchise: values.franchise,
            name: values.name.trim(),
            preset: values.preset,
            quality: values.quality,
          })
        : await generateProfilePictures({
            file: values.file as File,
            franchise: values.franchise,
            numOfAvatars: values.numOfAvatars,
            quality: values.quality,
          });

    deps.setResult((current) =>
      resultWithGeneration(
        resultWithUpload(current, response.upload.user_image_url),
        response.generation,
      ),
    );

    if (!response.generation.done) {
      deps.setStreamCloser(
        subscribeToGeneration(response.generation.generation_id, {
          onError: (message) =>
            deps.setResult((current) => failedResult(current, message)),
          onReconnect: () =>
            deps.setResult((current) => reconnectingResult(current)),
          onUpdate: (generation) => {
            deps.setResult((current) =>
              resultWithGeneration(current, generation),
            );

            if (generation.done) {
              deps.closeStream();
            }
          },
        }),
      );
    }
  } catch (caught) {
    const message =
      caught instanceof Error ? caught.message : "Generation failed.";
    deps.setResult((current) => failedResult(current, message));
  }
}
