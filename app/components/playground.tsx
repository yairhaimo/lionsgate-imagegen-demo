"use client";

import { usePlayground } from "../use-playground";
import { PlaygroundView } from "./playground-view";

export function Playground() {
  const controller = usePlayground();

  return <PlaygroundView controller={controller} />;
}
