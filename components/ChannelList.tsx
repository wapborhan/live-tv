"use client";
import { useState, useMemo } from "react";
import { Channel } from "@/types/channel";

interface Props {
  channels: Channel[];
  currentIdx: number;
  isFav: (key: string) => boolean;
  onToggleFav: (key: string) => void;
  onSelect: (idx: number) => void;
}

type Tab = "all" | "favourites";

export default function ChannelList({
  channels,
  currentIdx,
  isFav,
  onToggleFav,
  onSelect,
}: Props) {
  const [tab, setTab] = useState<Tab>("all");
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return channels
      .map((ch, idx) => ({ ch, idx }))
      .filter(({ ch }) => {
        if (tab === "favourites" && !isFav(ch.key)) return false;
        if (
          q &&
          !ch.name.toLowerCase().includes(q) &&
          !(ch.group || "").toLowerCase().includes(q)
        )
          return false;
        return true;
      });
  }, [channels, tab, filter, isFav]);

  // Group by group-title
  const grouped = useMemo(() => {
    const map = new Map<string, { ch: Channel; idx: number }[]>();
    for (const item of filtered) {
      const g = item.ch.group || "Uncategorized";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(item);
    }
    return map;
  }, [filtered]);

  return (
    <div className="flex flex-col h-full overflow-hidden border-l border-[#2a3050] bg-[#0d0f14]">
      {/* Tabs */}
      <div className="flex border-b border-[#2a3050] shrink-0">
        {(["all", "favourites"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === t
                ? "text-[#4f7ef8] border-[#4f7ef8]"
                : "text-[#7a83a0] border-transparent hover:text-[#e8eaf2]"
            }`}
          >
            {t === "all" ? (
              <>
                {filtered.length} Channel
                {filtered.length !== 1 ? "s" : ""}
              </>
            ) : (
              "★ Favourites"
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="p-2 shrink-0 flex gap-2">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter channels…"
          className="w-full bg-[#1e2230] border border-[#2a3050] rounded-lg px-3 py-1.5 text-xs text-[#e8eaf2] placeholder-[#7a83a0] outline-none focus:border-[#4f7ef8] transition-colors"
        />
        <div
          className="clr bg-[#1e2230] w-10 h-full text-center border-[#2a3050] focus:border-[#4f7ef8] rounded-lg flex justify-center items-center cursor-pointer"
          onClick={() => setFilter("")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            imageRendering="optimizeQuality"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 456 511.82"
            height="18"
            width="18"
          >
            <path
              fill="#FD3B3B"
              d="M48.42 140.13h361.99c17.36 0 29.82 9.78 28.08 28.17l-30.73 317.1c-1.23 13.36-8.99 26.42-25.3 26.42H76.34c-13.63-.73-23.74-9.75-25.09-24.14L20.79 168.99c-1.74-18.38 9.75-28.86 27.63-28.86zM24.49 38.15h136.47V28.1c0-15.94 10.2-28.1 27.02-28.1h81.28c17.3 0 27.65 11.77 27.65 28.01v10.14h138.66c.57 0 1.11.07 1.68.13 10.23.93 18.15 9.02 18.69 19.22.03.79.06 1.39.06 2.17v42.76c0 5.99-4.73 10.89-10.62 11.19-.54 0-1.09.03-1.63.03H11.22c-5.92 0-10.77-4.6-11.19-10.38 0-.72-.03-1.47-.03-2.23v-39.5c0-10.93 4.21-20.71 16.82-23.02 2.53-.45 5.09-.37 7.67-.37zm83.78 208.38c-.51-10.17 8.21-18.83 19.53-19.31 11.31-.49 20.94 7.4 21.45 17.57l8.7 160.62c.51 10.18-8.22 18.84-19.53 19.32-11.32.48-20.94-7.4-21.46-17.57l-8.69-160.63zm201.7-1.74c.51-10.17 10.14-18.06 21.45-17.57 11.32.48 20.04 9.14 19.53 19.31l-8.66 160.63c-.52 10.17-10.14 18.05-21.46 17.57-11.31-.48-20.04-9.14-19.53-19.32l8.67-160.62zm-102.94.87c0-10.23 9.23-18.53 20.58-18.53 11.34 0 20.58 8.3 20.58 18.53v160.63c0 10.23-9.24 18.53-20.58 18.53-11.35 0-20.58-8.3-20.58-18.53V245.66z"
            />
          </svg>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-[#7a83a0] p-5 text-center">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="opacity-30"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-xs">
              {tab === "favourites"
                ? "No favourites yet — star a channel"
                : "No channels match"}
            </p>
          </div>
        ) : (
          Array.from(grouped.entries()).map(([group, items]) => (
            <div key={group}>
              <div className="sticky top-0 z-10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#7a83a0] bg-[#161920]">
                {group}
              </div>
              {items.map(({ ch, idx }) => (
                <ChannelItem
                  key={ch.key}
                  channel={ch}
                  isActive={idx === currentIdx}
                  isFav={isFav(ch.key)}
                  onSelect={() => onSelect(idx)}
                  onToggleFav={() => onToggleFav(ch.key)}
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Status */}
      {/* <div className="shrink-0 text-center text-[10px] text-[#7a83a0] py-1.5 border-t border-[#2a3050]">
        {filtered.length} channel{filtered.length !== 1 ? "s" : ""}
      </div> */}
    </div>
  );
}

function ChannelItem({
  channel,
  isActive,
  isFav,
  onSelect,
  onToggleFav,
}: {
  channel: Channel;
  isActive: boolean;
  isFav: boolean;
  onSelect: () => void;
  onToggleFav: () => void;
}) {
  const initials = (channel.name || "?").slice(0, 2).toUpperCase();

  return (
    <div
      onClick={onSelect}
      className={`relative flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors group ${
        isActive ? "bg-[#252a3a]" : "hover:bg-[#1e2230]"
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r bg-[#4f7ef8]" />
      )}

      {/* Logo */}
      {channel.logo && channel.logo.startsWith("http") ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={channel.logo}
          alt=""
          className="w-8 h-8 rounded-md object-contain bg-[#252a3a] shrink-0"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
          loading="lazy"
        />
      ) : (
        <div className="w-8 h-8 rounded-md bg-[#252a3a] flex items-center justify-center text-[11px] font-bold text-[#7a83a0] shrink-0">
          {initials}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium truncate text-[#e8eaf2]">
          {channel.name}
        </div>
        <div className="text-[10px] text-[#7a83a0]">
          {channel.group || "Uncategorized"}
        </div>
      </div>

      {/* Fav button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFav();
        }}
        className={`text-base shrink-0 transition-colors ${
          isFav ? "text-yellow-400" : "text-[#7a83a0] hover:text-yellow-400"
        }`}
        title={isFav ? "Remove from favourites" : "Add to favourites"}
      >
        {isFav ? "★" : "☆"}
      </button>
    </div>
  );
}
