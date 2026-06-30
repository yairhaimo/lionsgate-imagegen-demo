import type { PointerEvent } from "react";

export function updateCardTilt(
  card: HTMLDivElement,
  event: PointerEvent<HTMLDivElement>,
) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = clamp((event.clientX - bounds.left) / bounds.width);
  const y = clamp((event.clientY - bounds.top) / bounds.height);
  const distance = Math.hypot(x - 0.5, y - 0.5);

  card.style.setProperty(
    "--card-rotate-x",
    `${((0.5 - y) * 16).toFixed(2)}deg`,
  );
  card.style.setProperty(
    "--card-rotate-y",
    `${((x - 0.5) * 20).toFixed(2)}deg`,
  );
  card.style.setProperty("--card-glare-x", `${(x * 100).toFixed(1)}%`);
  card.style.setProperty("--card-glare-y", `${(y * 100).toFixed(1)}%`);
  card.style.setProperty(
    "--card-glare-opacity",
    String(Math.min(0.78, 0.2 + distance * 1.15)),
  );
  card.style.setProperty(
    "--card-shadow-x",
    `${((x - 0.5) * -34).toFixed(1)}px`,
  );
  card.style.setProperty("--card-shadow-y", `${(30 + y * 18).toFixed(1)}px`);
}

export function isPointerInside(event: PointerEvent<HTMLDivElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();

  return (
    event.clientX >= bounds.left &&
    event.clientX <= bounds.right &&
    event.clientY >= bounds.top &&
    event.clientY <= bounds.bottom
  );
}

export function releasePointer(event: PointerEvent<HTMLDivElement>) {
  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}
