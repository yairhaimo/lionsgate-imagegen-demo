"use client";

import type { PointerEvent } from "react";
import { useRef } from "react";
import {
  isPointerInside,
  releasePointer,
  updateCardTilt,
} from "./shareable-card-pointer";
import { restingShareableCardStyle } from "./shareable-card-style";

export function useShareableCardTilt() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const dragPointerIdRef = useRef<number | null>(null);

  function resetTilt() {
    const card = cardRef.current;

    if (!card) {
      return;
    }

    for (const [property, value] of Object.entries(restingShareableCardStyle)) {
      card.style.setProperty(property, value);
    }
  }

  function updateTilt(event: PointerEvent<HTMLDivElement>) {
    const card = cardRef.current;

    if (card && event.pointerType === "mouse") {
      updateCardTilt(card, event);
    }
  }

  function startTiltDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    event.preventDefault();
    dragPointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateTilt(event);
  }

  function finishTiltDrag(event: PointerEvent<HTMLDivElement>) {
    if (dragPointerIdRef.current !== event.pointerId) {
      return;
    }

    dragPointerIdRef.current = null;
    releasePointer(event);

    if (!isPointerInside(event)) {
      resetTilt();
    }
  }

  function handleLostPointerCapture(event: PointerEvent<HTMLDivElement>) {
    if (dragPointerIdRef.current === event.pointerId) {
      dragPointerIdRef.current = null;
      resetTilt();
    }
  }

  function handlePointerLeave() {
    if (dragPointerIdRef.current === null) {
      resetTilt();
    }
  }

  return {
    cardRef,
    finishTiltDrag,
    handleLostPointerCapture,
    handlePointerLeave,
    startTiltDrag,
    updateTilt,
  };
}
