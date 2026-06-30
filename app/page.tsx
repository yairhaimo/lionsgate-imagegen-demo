"use client";

import type {
  ApiErrorPayload,
  Franchise,
  FranchisePreset,
  GenerationResult,
  GenerationStartResponse,
  ImageQuality,
  PfpAvatarCount,
  UploadUserImageResponse,
} from "lionsgate-club-imagegen";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "pfp" | "shareable";
type ShareableCardStyle = React.CSSProperties & {
  "--card-glare-opacity": string;
  "--card-glare-x": string;
  "--card-glare-y": string;
  "--card-rotate-x": string;
  "--card-rotate-y": string;
  "--card-shadow-x": string;
  "--card-shadow-y": string;
};
type PfpLoaderGridStyle = React.CSSProperties & {
  "--pfp-loader-columns": string;
};
type PfpLoaderCellStyle = React.CSSProperties & {
  "--pfp-delay": string;
  "--pfp-accent": string;
};

type GenerateRouteResponse = {
  upload: UploadUserImageResponse;
  generation: GenerationStartResponse;
};

type ModeContent = {
  endpoint: string;
  emptyResult: string;
  idle: string;
  submit: string;
  title: string;
};

const franchiseLabels: Record<Franchise, string> = {
  hunger_games: "Hunger Games",
  john_wick: "John Wick",
};

const shareablePlaceholderImages: Record<
  Franchise,
  { alt: string; src: string }
> = {
  hunger_games: {
    alt: "Hunger Games inspired placeholder shareable image",
    src: "/franchise-placeholders/hunger-games.png",
  },
  john_wick: {
    alt: "John Wick inspired placeholder shareable image",
    src: "/franchise-placeholders/john-wick.png",
  },
};

const qualityLabels: Record<ImageQuality, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const presetLabels: Record<FranchisePreset, string> = {
  general_image: "General Image",
  character_card: "Character card",
};

const modeContent: Record<Mode, ModeContent> = {
  pfp: {
    endpoint: "/api/pfp/generate",
    emptyResult: "PFPs appear here",
    idle: "Ready for PFP generation",
    submit: "Create PFP",
    title: "PFP generator",
  },
  shareable: {
    endpoint: "/api/shareable/generate",
    emptyResult: "Shareable image appears here",
    idle: "Ready for shareable generation",
    submit: "Create Shareable Image",
    title: "Shareable image generator",
  },
};

const pfpLoaderAccents = ["#f2d8a3", "#e8e0d6", "#cf313d", "#8e1b26"];
const restingShareableCardStyle: ShareableCardStyle = {
  "--card-glare-opacity": "0",
  "--card-glare-x": "50%",
  "--card-glare-y": "18%",
  "--card-rotate-x": "0deg",
  "--card-rotate-y": "0deg",
  "--card-shadow-x": "0px",
  "--card-shadow-y": "32px",
};

function clampShareableTiltPosition(value: number) {
  return Math.min(1, Math.max(0, value));
}

function ShareableLoaderGraphic({ compact = false }: { compact?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`shareable-loader-graphic ${
        compact ? "shareable-loader-graphic--compact" : ""
      }`}
    >
      <span className="shareable-loader-frame" />
      <span className="shareable-loader-scan" />
      <span className="shareable-loader-iris" />
      <span className="shareable-loader-bar shareable-loader-bar--one" />
      <span className="shareable-loader-bar shareable-loader-bar--two" />
      <span className="shareable-loader-bar shareable-loader-bar--three" />
    </div>
  );
}

function ShareableLoaderOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[#080707]/42 backdrop-blur-[1px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,transparent_0%,transparent_33%,rgba(8,7,7,0.46)_72%),linear-gradient(180deg,rgba(242,216,163,0.12),transparent_30%,rgba(207,49,61,0.14))]" />
      <ShareableLoaderGraphic compact />
    </div>
  );
}

function PfpGenerationLoader({ count }: { count: number }) {
  const columns = count > 16 ? 8 : 4;
  const cells = useMemo(
    () => Array.from({ length: count }, (_, index) => index),
    [count],
  );
  const gridStyle: PfpLoaderGridStyle = {
    "--pfp-loader-columns": String(columns),
    maxWidth: count > 16 ? "540px" : "410px",
  };

  return (
    <output
      aria-label={`Generating ${count} profile pictures`}
      className="pfp-loader-shell relative flex min-h-[284px] items-center justify-center overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(242,216,163,0.16),transparent_26%),radial-gradient(circle_at_86%_78%,rgba(207,49,61,0.18),transparent_31%),linear-gradient(145deg,rgba(255,255,255,0.05),transparent_44%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:44px_44px] opacity-24" />
      <div
        className="pfp-loader-grid relative z-10 grid w-full gap-2 sm:gap-3 [grid-template-columns:repeat(var(--pfp-loader-columns),minmax(0,1fr))]"
        style={gridStyle}
      >
        {cells.map((index) => {
          const row = Math.floor(index / columns);
          const delay = row * 52 + (index % columns) * 72;
          const cellStyle: PfpLoaderCellStyle = {
            "--pfp-accent": pfpLoaderAccents[index % pfpLoaderAccents.length],
            "--pfp-delay": `${delay}ms`,
          };

          return (
            <span className="pfp-loader-cell" key={index} style={cellStyle} />
          );
        })}
      </div>
      <div className="pointer-events-none absolute bottom-5 h-14 w-[70%] max-w-[420px] rounded-full bg-black/65 blur-2xl" />
    </output>
  );
}

function parseJson(value: string) {
  try {
    return JSON.parse(value || "{}") as unknown;
  } catch {
    return {};
  }
}

function isApiErrorPayload(payload: unknown): payload is ApiErrorPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const error = (payload as { error?: { message?: unknown } }).error;
  return typeof error?.message === "string";
}

function isGenerationResult(payload: unknown): payload is GenerationResult {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as { generation_id?: unknown }).generation_id === "string"
  );
}

function errorMessage(payload: unknown) {
  if (isApiErrorPayload(payload)) {
    return payload.error.message;
  }

  return "Request failed.";
}

function postForm<T>(
  url: string,
  formData: FormData,
  onProgress: (progress: number) => void,
) {
  return new Promise<T>((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    request.onload = () => {
      const body = parseJson(request.responseText);

      if (request.status >= 200 && request.status < 300) {
        resolve(body as T);
        return;
      }

      reject(new Error(errorMessage(body)));
    };

    request.onerror = () => reject(new Error("Request failed."));
    request.open("POST", url);
    request.send(formData);
  });
}

function ShareableImageCard({
  alt,
  isPartial,
  showLoader,
  src,
}: {
  alt: string;
  isPartial: boolean;
  showLoader: boolean;
  src: string;
}) {
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

  function updateTilt(event: React.PointerEvent<HTMLDivElement>) {
    const card = cardRef.current;

    if (!card || event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = clampShareableTiltPosition(
      (event.clientX - bounds.left) / bounds.width,
    );
    const y = clampShareableTiltPosition(
      (event.clientY - bounds.top) / bounds.height,
    );
    const rotateX = (0.5 - y) * 16;
    const rotateY = (x - 0.5) * 20;
    const distanceFromCenter = Math.hypot(x - 0.5, y - 0.5);

    card.style.setProperty("--card-rotate-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--card-rotate-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--card-glare-x", `${(x * 100).toFixed(1)}%`);
    card.style.setProperty("--card-glare-y", `${(y * 100).toFixed(1)}%`);
    card.style.setProperty(
      "--card-glare-opacity",
      String(Math.min(0.78, 0.2 + distanceFromCenter * 1.15)),
    );
    card.style.setProperty(
      "--card-shadow-x",
      `${((x - 0.5) * -34).toFixed(1)}px`,
    );
    card.style.setProperty("--card-shadow-y", `${(30 + y * 18).toFixed(1)}px`);
  }

  function startTiltDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    event.preventDefault();
    dragPointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateTilt(event);
  }

  function finishTiltDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (dragPointerIdRef.current !== event.pointerId) {
      return;
    }

    dragPointerIdRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const isPointerInside =
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom;

    if (!isPointerInside) {
      resetTilt();
    }
  }

  function handleLostPointerCapture(event: React.PointerEvent<HTMLDivElement>) {
    if (dragPointerIdRef.current !== event.pointerId) {
      return;
    }

    dragPointerIdRef.current = null;
    resetTilt();
  }

  function handlePointerLeave() {
    if (dragPointerIdRef.current === null) {
      resetTilt();
    }
  }

  return (
    <div className="relative flex min-h-[316px] items-center justify-center overflow-hidden bg-[#0b0909] p-6 [perspective:1200px] sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(177,31,42,0.22),transparent_42%),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:auto,42px_42px]" />
      <div className="pointer-events-none absolute bottom-8 h-20 w-[62%] max-w-[420px] rounded-full bg-[#040303] blur-2xl" />
      <div
        aria-label={alt}
        className="group/shareable-card relative aspect-[3/4] w-full max-w-[430px] cursor-grab select-none [transform-style:preserve-3d] active:cursor-grabbing"
        onDragStart={(event) => event.preventDefault()}
        onLostPointerCapture={handleLostPointerCapture}
        onPointerCancel={finishTiltDrag}
        onPointerDown={startTiltDrag}
        onPointerLeave={handlePointerLeave}
        onPointerMove={updateTilt}
        onPointerUp={finishTiltDrag}
        role="img"
      >
        <div
          className="relative h-full w-full rounded-[8px] bg-[linear-gradient(145deg,#f3e2bf_0%,#8e1b26_21%,#17100f_43%,#050404_100%)] p-[2px] transition-[transform,box-shadow] duration-200 ease-out [box-shadow:var(--card-shadow-x)_var(--card-shadow-y)_74px_rgba(0,0,0,0.68),0_0_0_1px_rgba(255,255,255,0.14),inset_0_1px_0_rgba(255,255,255,0.38)] [transform-style:preserve-3d] [transform:rotateX(var(--card-rotate-x))_rotateY(var(--card-rotate-y))] motion-reduce:transition-none motion-reduce:[transform:none]"
          ref={cardRef}
          style={restingShareableCardStyle}
        >
          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[8px] bg-[conic-gradient(from_210deg_at_50%_50%,transparent_0deg,rgba(210,28,42,0.36)_54deg,rgba(245,228,188,0.42)_104deg,transparent_162deg,transparent_360deg)] opacity-75 blur-xl [transform:translateZ(-44px)]" />
          <div className="absolute inset-0 overflow-hidden rounded-[7px] bg-[#080707]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22)_0%,transparent_18%,transparent_72%,rgba(255,255,255,0.1)_100%)]" />
            <div className="absolute inset-[10px] overflow-hidden rounded-[5px] bg-[#151111] [transform:translateZ(46px)]">
              <Image
                alt=""
                className={`h-full w-full object-cover transition duration-500 ${
                  isPartial ? "blur-[5px] scale-[1.03]" : ""
                }`}
                draggable={false}
                height={1200}
                src={src}
                unoptimized
                width={900}
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent_18%,transparent_78%,rgba(0,0,0,0.24))]" />
              {showLoader ? <ShareableLoaderOverlay /> : null}
            </div>
            <div className="pointer-events-none absolute inset-[10px] rounded-[5px] ring-1 ring-white/20 [box-shadow:inset_0_0_28px_rgba(0,0,0,0.52)] [transform:translateZ(50px)]" />
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-[8px] opacity-[var(--card-glare-opacity)] mix-blend-screen transition-opacity duration-200 [background:radial-gradient(circle_at_var(--card-glare-x)_var(--card-glare-y),rgba(255,255,255,0.92)_0%,rgba(255,228,172,0.48)_13%,rgba(255,255,255,0.16)_28%,transparent_56%)] motion-reduce:hidden" />
          <div className="pointer-events-none absolute inset-0 rounded-[8px] opacity-0 transition-opacity duration-300 [background:linear-gradient(112deg,transparent_23%,rgba(255,255,255,0.46)_35%,rgba(255,255,255,0.1)_44%,transparent_58%)] group-hover/shareable-card:opacity-[0.55] motion-reduce:hidden" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("pfp");
  const [name, setName] = useState("");
  const [franchise, setFranchise] = useState<Franchise>("john_wick");
  const [preset, setPreset] = useState<FranchisePreset>("general_image");
  const [quality, setQuality] = useState<ImageQuality>("high");
  const [numOfAvatars, setNumOfAvatars] = useState<PfpAvatarCount>(16);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [requestProgress, setRequestProgress] = useState(0);
  const [status, setStatus] = useState(modeContent.pfp.idle);
  const [error, setError] = useState<string | null>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [partialUrl, setPartialUrl] = useState<string | null>(null);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [pfpUrls, setPfpUrls] = useState<string[]>([]);
  const [selectedPfpUrl, setSelectedPfpUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const activeContent = modeContent[mode];
  const resultUrl = finalUrl ?? partialUrl;
  const pfpTargetCount = numOfAvatars;
  const isShareablePartial =
    mode === "shareable" && Boolean(partialUrl && !finalUrl);
  const shareablePlaceholder = shareablePlaceholderImages[franchise];
  const shareableImageAlt = resultUrl
    ? isShareablePartial
      ? "Blurred partial shareable image"
      : "Generated shareable image"
    : shareablePlaceholder.alt;
  const shareableImageSrc = resultUrl ?? shareablePlaceholder.src;

  const canGenerate = useMemo(
    () => Boolean(file && !isGenerating && (mode === "pfp" || name.trim())),
    [file, isGenerating, mode, name],
  );

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!selectedPfpUrl) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedPfpUrl(null);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedPfpUrl]);

  function closeEvents() {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
  }

  function resetGenerationState(nextStatus: string) {
    closeEvents();
    setError(null);
    setGenerationId(null);
    setPartialUrl(null);
    setFinalUrl(null);
    setPfpUrls([]);
    setSelectedPfpUrl(null);
    setRequestProgress(0);
    setStatus(nextStatus);
    setIsGenerating(false);
  }

  function onModeChange(nextMode: Mode) {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    resetGenerationState(modeContent[nextMode].idle);
  }

  function onFileChange(nextFile: File | null) {
    setFile(nextFile);
    setUploadedUrl(null);
    resetGenerationState(activeContent.idle);
    setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : null);
  }

  function connectEvents(id: string, generationMode: Mode) {
    closeEvents();
    const source = new EventSource(`/api/generations/${id}/events`);
    eventSourceRef.current = source;
    let terminal = false;

    const handleMessage = (event: MessageEvent<string>) => {
      const payload = parseJson(event.data);

      if (!isGenerationResult(payload)) {
        if (isApiErrorPayload(payload)) {
          setError(payload.error.message);
        }
        terminal = true;
        setStatus("Failed");
        setIsGenerating(false);
        source.close();
        return;
      }

      setStatus(payload.status);
      setGenerationId(payload.generation_id);

      if (payload.error?.error.message) {
        setError(payload.error.error.message);
      }

      if (generationMode === "pfp") {
        setPfpUrls(payload.pfp_image_urls);
      } else {
        setPartialUrl(payload.partial_image_url ?? null);
        setFinalUrl(payload.final_image_url ?? null);
      }

      if (payload.done) {
        terminal = true;
        setIsGenerating(false);
        source.close();
      }
    };

    source.addEventListener("status", handleMessage);
    source.addEventListener("partial", handleMessage);
    source.addEventListener("final", handleMessage);
    source.addEventListener("error", handleMessage);
    source.onerror = () => {
      if (!terminal) {
        setStatus("Reconnecting");
      }
    };
  }

  async function generate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Choose an image first.");
      return;
    }

    const generationMode = mode;
    const content = modeContent[generationMode];
    const formData = new FormData();
    formData.append("franchise", franchise);
    formData.append("file", file, file.name);
    formData.append("quality", quality);
    if (generationMode === "shareable") {
      formData.append("name", name.trim());
      formData.append("preset", preset);
    }
    if (generationMode === "pfp") {
      formData.append("num_of_avatars", String(numOfAvatars));
    }

    setError(null);
    setPartialUrl(null);
    setFinalUrl(null);
    setPfpUrls([]);
    setSelectedPfpUrl(null);
    setGenerationId(null);
    setRequestProgress(1);
    setIsGenerating(true);
    setStatus("Uploading portrait");
    closeEvents();

    try {
      const response = await postForm<GenerateRouteResponse>(
        content.endpoint,
        formData,
        setRequestProgress,
      );

      const generation = response.generation;
      setUploadedUrl(response.upload.user_image_url);
      setRequestProgress(100);
      setGenerationId(generation.generation_id);
      setStatus(generation.status);
      if (generationMode === "pfp") {
        setPfpUrls(generation.pfp_image_urls);
      } else {
        setPartialUrl(generation.partial_image_url ?? null);
        setFinalUrl(generation.final_image_url ?? null);
      }
      connectEvents(generation.generation_id, generationMode);
    } catch (caught) {
      setIsGenerating(false);
      setStatus("Failed");
      setError(caught instanceof Error ? caught.message : "Generation failed.");
    }
  }

  return (
    <main className="min-h-screen bg-[#080707] text-[#f5efe8]">
      <header className="border-b border-[#a13942] bg-[#86151d]">
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 md:px-8">
          <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#f2d8d8]">
            Lionsgate Club
          </div>
          <div className="text-center text-2xl font-black uppercase tracking-[0.12em] text-white md:text-3xl">
            Image Playground
          </div>
          <div className="justify-self-end rounded-full border border-[#f0d7d7] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#f7e7e7]">
            API
          </div>
        </div>
      </header>

      <div className="border-b border-[#391115] bg-[#56090f]">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 md:px-8">
          {(["pfp", "shareable"] as const).map((item) => (
            <button
              className={`shrink-0 whitespace-nowrap border-b-2 px-2 py-4 text-sm font-black uppercase tracking-[0.08em] transition md:px-4 ${
                mode === item
                  ? "border-white text-white"
                  : "border-transparent text-[#bfa4a6] hover:text-white"
              }`}
              key={item}
              onClick={() => onModeChange(item)}
              type="button"
            >
              {modeContent[item].submit}
            </button>
          ))}
        </div>
      </div>

      <section className="relative min-h-[calc(100vh-129px)] overflow-hidden bg-[#080707]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(151,22,32,0.24)_0%,rgba(8,7,7,0.72)_38%,rgba(8,7,7,1)_76%),linear-gradient(180deg,rgba(255,255,255,0.06)_0,rgba(255,255,255,0)_28%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_96px)] opacity-35" />

        <div className="relative mx-auto grid max-w-7xl gap-7 px-5 py-8 md:px-8 lg:grid-cols-[390px_1fr] lg:py-10">
          <form
            className="self-start rounded-[6px] border border-[#3b2424] bg-[#130f0f]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.38)]"
            onSubmit={generate}
          >
            <div className="border-b border-[#3b2424] pb-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#a88f8c]">
                {franchiseLabels[franchise]}
              </p>
              <h1 className="mt-2 text-3xl font-black uppercase leading-none tracking-[0.03em] text-white">
                {activeContent.title}
              </h1>
            </div>

            <div className="mt-5 grid gap-5">
              {mode === "shareable" ? (
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#d7c9c1]">
                  Name
                  <input
                    className="h-12 rounded-[4px] border border-[#4a3332] bg-[#090808] px-3 text-base font-semibold normal-case tracking-normal text-white outline-none transition placeholder:text-[#756b68] focus:border-[#d7c9c1]"
                    name="name"
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Jane Wick"
                    value={name}
                  />
                </label>
              ) : null}

              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#d7c9c1]">
                Franchise
                <select
                  className="h-12 rounded-[4px] border border-[#4a3332] bg-[#090808] px-3 text-base font-semibold normal-case tracking-normal text-white outline-none transition focus:border-[#d7c9c1]"
                  name="franchise"
                  onChange={(event) =>
                    setFranchise(event.target.value as Franchise)
                  }
                  value={franchise}
                >
                  {Object.entries(franchiseLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#d7c9c1]">
                Quality
                <select
                  className="h-12 rounded-[4px] border border-[#4a3332] bg-[#090808] px-3 text-base font-semibold normal-case tracking-normal text-white outline-none transition focus:border-[#d7c9c1]"
                  name="quality"
                  onChange={(event) =>
                    setQuality(event.target.value as ImageQuality)
                  }
                  value={quality}
                >
                  {Object.entries(qualityLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] font-semibold normal-case leading-5 tracking-normal text-[#a88f8c]">
                  Higher quality can increase generation time.
                </span>
              </label>

              {mode === "shareable" ? (
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#d7c9c1]">
                  Preset
                  <select
                    className="h-12 rounded-[4px] border border-[#4a3332] bg-[#090808] px-3 text-base font-semibold normal-case tracking-normal text-white outline-none transition focus:border-[#d7c9c1]"
                    onChange={(event) =>
                      setPreset(event.target.value as FranchisePreset)
                    }
                    value={preset}
                  >
                    {Object.entries(presetLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {mode === "pfp" ? (
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#d7c9c1]">
                  PFP count
                  <select
                    className="h-12 rounded-[4px] border border-[#4a3332] bg-[#090808] px-3 text-base font-semibold normal-case tracking-normal text-white outline-none transition focus:border-[#d7c9c1]"
                    onChange={(event) =>
                      setNumOfAvatars(
                        Number(event.target.value) as PfpAvatarCount,
                      )
                    }
                    value={numOfAvatars}
                  >
                    <option value={4}>4 PFPs</option>
                    <option value={16}>16 PFPs</option>
                  </select>
                </label>
              ) : null}

              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#d7c9c1]">
                User image
                <input
                  accept="image/png,image/jpeg,image/webp"
                  className="block w-full rounded-[4px] border border-dashed border-[#6e5552] bg-[#090808] p-3 text-sm text-[#d7c9c1] file:mr-3 file:rounded-[3px] file:border-0 file:bg-[#eee5db] file:px-3 file:py-2 file:text-sm file:font-black file:uppercase file:text-[#160f0f]"
                  name="file"
                  onChange={(event) =>
                    onFileChange(event.target.files?.[0] ?? null)
                  }
                  type="file"
                />
              </label>

              <div className="h-2 overflow-hidden rounded-full bg-[#332423]">
                <div
                  className="h-full bg-[#c9c0b8] transition-all"
                  style={{ width: `${requestProgress}%` }}
                />
              </div>

              <button
                className="h-12 rounded-[4px] bg-[#e8e0d6] px-4 text-sm font-black uppercase tracking-[0.1em] text-[#130f0f] transition hover:bg-white disabled:cursor-not-allowed disabled:bg-[#574946] disabled:text-[#9f918c]"
                disabled={!canGenerate}
                type="submit"
              >
                {isGenerating ? "Generating" : activeContent.submit}
              </button>

              <div className="border-t border-[#3b2424] pt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#a88f8c]">
                <p>Status: {status}</p>
                {generationId ? (
                  <p className="mt-2 truncate">Generation: {generationId}</p>
                ) : null}
                {error ? (
                  <p className="mt-3 normal-case tracking-normal text-[#ffb3b3]">
                    {error}
                  </p>
                ) : null}
              </div>
            </div>
          </form>

          <section className="grid gap-5">
            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="min-h-[360px] overflow-hidden rounded-[6px] border border-[#3b2424] bg-[#0d0b0b]">
                <div className="flex h-11 items-center justify-between border-b border-[#3b2424] px-4 text-xs font-black uppercase tracking-[0.16em] text-[#a88f8c]">
                  <span>Source</span>
                  <span>{file ? "Loaded" : "Waiting"}</span>
                </div>
                <div className="flex min-h-[316px] items-center justify-center bg-[#151111]">
                  {previewUrl ? (
                    <Image
                      alt="Selected user upload"
                      className="h-full max-h-[640px] w-full object-contain"
                      height={1200}
                      src={previewUrl}
                      unoptimized
                      width={900}
                    />
                  ) : (
                    <span className="text-sm font-black uppercase tracking-[0.18em] text-[#766965]">
                      Portrait preview
                    </span>
                  )}
                </div>
              </div>

              <div className="min-h-[360px] overflow-hidden rounded-[6px] border border-[#3b2424] bg-[#0d0b0b]">
                <div className="flex h-11 items-center justify-between border-b border-[#3b2424] px-4 text-xs font-black uppercase tracking-[0.16em] text-[#a88f8c]">
                  <span>Output</span>
                  <span>
                    {mode === "pfp"
                      ? pfpUrls.length > 0
                        ? `${pfpUrls.length} PFPs`
                        : isGenerating
                          ? `${pfpTargetCount} PFPs`
                          : "Waiting"
                      : finalUrl
                        ? "Final"
                        : isShareablePartial
                          ? "Blurred partial"
                          : isGenerating
                            ? "Generating"
                            : "Placeholder"}
                  </span>
                </div>

                {mode === "pfp" ? (
                  <div className="max-h-[720px] min-h-[316px] overflow-y-auto bg-[#151111] p-4">
                    {pfpUrls.length > 0 ? (
                      <div className="grid content-start gap-3 sm:grid-cols-3 xl:grid-cols-4">
                        {pfpUrls.map((url, index) => (
                          <button
                            aria-label={`Open profile picture ${index + 1}`}
                            className="aspect-square overflow-hidden rounded-full border border-[#3b2424] bg-[#080707] shadow-[0_16px_38px_rgba(0,0,0,0.35)] transition hover:border-[#e8e0d6] hover:shadow-[0_18px_46px_rgba(232,224,214,0.18)] focus:outline-none focus:ring-2 focus:ring-[#e8e0d6] focus:ring-offset-2 focus:ring-offset-[#151111]"
                            key={url}
                            onClick={() => setSelectedPfpUrl(url)}
                            type="button"
                          >
                            <Image
                              alt="Generated profile picture"
                              className="h-full w-full object-cover"
                              height={512}
                              src={url}
                              unoptimized
                              width={512}
                            />
                          </button>
                        ))}
                      </div>
                    ) : isGenerating ? (
                      <PfpGenerationLoader count={pfpTargetCount} />
                    ) : (
                      <div className="flex min-h-[260px] items-center justify-center">
                        <span className="text-sm font-black uppercase tracking-[0.18em] text-[#766965]">
                          {activeContent.emptyResult}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="min-h-[316px] bg-[#151111]">
                    <ShareableImageCard
                      alt={shareableImageAlt}
                      isPartial={isShareablePartial}
                      showLoader={isGenerating && !finalUrl}
                      src={shareableImageSrc}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-3 border-t border-[#3b2424] pt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#a88f8c] md:grid-cols-2">
              <p className="truncate">
                Upload URL: {uploadedUrl ?? "Not uploaded"}
              </p>
              <p className="truncate">
                Result URL:{" "}
                {mode === "pfp"
                  ? (pfpUrls[0] ?? "Waiting")
                  : (finalUrl ?? partialUrl ?? "Waiting")}
              </p>
            </div>
          </section>
        </div>
      </section>
      {selectedPfpUrl ? (
        <div
          aria-labelledby="pfp-dialog-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/78 p-5"
          role="dialog"
        >
          <div className="w-full max-w-[560px] rounded-[6px] border border-[#4f3432] bg-[#0d0b0b] p-4 shadow-[0_32px_90px_rgba(0,0,0,0.62)]">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2
                className="text-xs font-black uppercase tracking-[0.18em] text-[#d7c9c1]"
                id="pfp-dialog-title"
              >
                Profile picture
              </h2>
              <button
                aria-label="Close profile picture preview"
                className="inline-flex size-9 items-center justify-center rounded-[4px] border border-[#4a3332] bg-[#151111] text-lg font-black leading-none text-[#d7c9c1] transition hover:border-[#e8e0d6] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e8e0d6]"
                onClick={() => setSelectedPfpUrl(null)}
                type="button"
              >
                &times;
              </button>
            </div>
            <div className="mx-auto size-full max-h-[512px] max-w-[512px] overflow-hidden rounded-[6px] border border-[#3b2424] bg-[#080707]">
              <Image
                alt="Generated profile picture full size"
                className="size-full object-cover"
                height={512}
                src={selectedPfpUrl}
                unoptimized
                width={512}
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
