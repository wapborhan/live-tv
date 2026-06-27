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
      <div className="flex border-b border-[#2a3050] flex-shrink-0">
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
      <div className="p-2 shrink-0 relative">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter channels…"
          className="w-full bg-[#1e2230] border border-[#2a3050] rounded-lg px-3 py-1.5 text-xs text-[#e8eaf2] placeholder-[#7a83a0] outline-none focus:border-[#4f7ef8] transition-colors"
        />
        <div
          className="clr bg-red-500 w-10 h-full absolute top-0 right-0 text-center content-center"
          onClick={() => setFilter("")}
        >
          C
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
      <div className="shrink-0 text-center text-[10px] text-[#7a83a0] py-1.5 border-t border-[#2a3050]">
        {filtered.length} channel{filtered.length !== 1 ? "s" : ""}
      </div>
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
          className="w-8 h-8 rounded-md object-contain bg-[#252a3a] flex-shrink-0"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
          loading="lazy"
        />
      ) : (
        <div className="w-8 h-8 rounded-md bg-[#252a3a] flex items-center justify-center text-[11px] font-bold text-[#7a83a0] flex-shrink-0">
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
        className={`text-base flex-shrink-0 transition-colors ${
          isFav ? "text-yellow-400" : "text-[#7a83a0] hover:text-yellow-400"
        }`}
        title={isFav ? "Remove from favourites" : "Add to favourites"}
      >
        {isFav ? "★" : "☆"}
      </button>
    </div>
  );
}
