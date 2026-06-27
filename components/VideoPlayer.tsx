"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Channel } from "@/types/channel";

interface Props {
  channel: Channel | null;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

type PlayerState = "idle" | "loading" | "playing" | "error";

export default function VideoPlayer({
  channel,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<import("hls.js").default | null>(null);
  const [state, setState] = useState<PlayerState>("idle");
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const destroyHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  const loadChannel = useCallback(
    async (ch: Channel) => {
      const video = videoRef.current;
      if (!video) return;
      destroyHls();
      setState("loading");
      setErrorMsg("");

      const url = ch.url;
      const isHls =
        url.includes(".m3u8") || url.includes("m3u8") || url.includes(".ts");

      const handleError = (msg: string) => {
        setState("error");
        setErrorMsg(msg);
        destroyHls();
      };

      if (isHls) {
        const Hls = (await import("hls.js")).default;
        if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
          hlsRef.current = hls;
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
          hls.on(
            Hls.Events.ERROR,
            (_e: unknown, data: import("hls.js").ErrorData) => {
              if (data.fatal)
                handleError("Stream unavailable or failed to load.");
            },
          );
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
          video.play().catch(() => handleError("Playback failed."));
        } else {
          handleError("HLS not supported in this browser.");
        }
      } else {
        video.src = url;
        video.play().catch(() => handleError("Playback failed."));
      }
    },
    [destroyHls],
  );

  useEffect(() => {
    if (!channel) {
      setState("idle");
      destroyHls();
      return;
    }
    loadChannel(channel);
    return () => {
      destroyHls();
    };
  }, [channel, loadChannel, destroyHls]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlaying = () => setState("playing");
    const onWaiting = () => setState("loading");
    const onError = () => {
      setState("error");
      setErrorMsg("Stream unavailable or failed to load.");
    };
    video.addEventListener("playing", onPlaying);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) videoRef.current.volume = v;
  };

  const handleFullscreen = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (!document.fullscreenElement) wrap.requestFullscreen().catch(() => {});
    else document.exitFullscreen();
  };

  const handleRefresh = () => {
    if (channel) loadChannel(channel);
  };

  const volIcon = volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊";

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Player wrap */}
      <div
        ref={wrapRef}
        className="relative flex-1 min-h-0 rounded-xl overflow-hidden bg-black"
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain bg-black"
          playsInline
          controls={state === "playing"}
        />

        {/* Idle overlay */}
        {state === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#7a83a0]">
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <p className="text-sm">No channel selected</p>
            <p className="text-xs opacity-60 max-w-55 text-center leading-relaxed">
              Pick a channel from the list on the right to start watching
            </p>
          </div>
        )}

        {/* Loading overlay */}
        {state === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60">
            <div className="w-10 h-10 border-[3px] border-[#2a3050] border-t-[#4f7ef8] rounded-full animate-spin" />
            <p className="text-sm text-[#7a83a0]">Loading stream…</p>
          </div>
        )}

        {/* Error overlay */}
        {state === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f08080"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <p className="text-[#f08080] font-semibold text-sm mb-1">
                Stream not available
              </p>
              <p className="text-[#7a83a0] text-xs leading-relaxed">
                {errorMsg}
              </p>
            </div>
            <div className="flex gap-2 mt-1">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e2230] border border-[#2a3050] text-sm text-[#e8eaf2] hover:border-[#4f7ef8] transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                Refresh
              </button>
              {hasPrev && (
                <button
                  onClick={onPrev}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e2230] border border-[#2a3050] text-sm text-[#e8eaf2] hover:border-[#4f7ef8] transition-colors"
                >
                  ⏮ Prev
                </button>
              )}
              {hasNext && (
                <button
                  onClick={onNext}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e2230] border border-[#2a3050] text-sm text-[#e8eaf2] hover:border-[#4f7ef8] transition-colors"
                >
                  Next ⏭
                </button>
              )}
            </div>
          </div>
        )}

        {/* Fullscreen exit button — shown in fullscreen */}
        {isFullscreen && (
          <button
            onClick={handleFullscreen}
            className="absolute top-3 right-3 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white text-xs hover:bg-black/80 transition-colors"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
            Exit Fullscreen
          </button>
        )}
      </div>

      {/* Now playing bar */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <div className="shrink-0 px-1">
          <div className="text-sm font-semibold truncate text-[#e8eaf2] uppercase">
            {channel ? channel.name : "—"}
          </div>
          <div className="text-xs text-[#7a83a0] mt-0.5">
            {channel ? channel.group : "Select a channel to begin"}
          </div>
        </div>

        {/* Controls bar */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2230] border border-[#2a3050] text-xs text-[#e8eaf2] hover:border-[#4f7ef8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ⏮ Prev
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2230] border border-[#2a3050] text-xs text-[#e8eaf2] hover:border-[#4f7ef8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next ⏭
          </button>
          {state === "error" && (
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2230] border border-[#2a3050] text-xs text-[#e8eaf2] hover:border-[#4f7ef8] transition-colors"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Refresh
            </button>
          )}
          <button
            onClick={handleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2230] border border-[#2a3050] text-xs text-[#e8eaf2] hover:border-[#4f7ef8] transition-colors"
          >
            {isFullscreen ? (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
                Normal Screen
              </>
            ) : (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
                Fullscreen
              </>
            )}
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs">{volIcon}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={handleVolume}
              className="w-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
