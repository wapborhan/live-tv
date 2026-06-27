"use client";
import { useState, useEffect, useCallback } from "react";
import { Channel } from "@/types/channel";
import { parseM3U } from "@/lib/parseM3U";
import { useFavourites } from "@/hooks/useFavourites";
import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import ChannelList from "@/components/ChannelList";
import LoadModal from "@/components/LoadModal";
import Toast from "@/components/Toast";

export default function LiveTVClient() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [playlistLabel, setPlaylistLabel] = useState("Loading…");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState({ msg: "", k: 0 });
  const [globalSearch, setGlobalSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  const { isFav, toggle } = useFavourites();

  const showToast = useCallback((msg: string) => {
    setToast((p) => ({ msg, k: p.k + 1 }));
  }, []);

  // Load public/MinnatTv.m3u on mount
  useEffect(() => {
    fetch("/MinnatTv.m3u")
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.text();
      })
      .then((text) => {
        const parsed = parseM3U(text);
        setChannels(parsed);
        setPlaylistLabel(`${parsed.length} channels · MinnatTv.m3u`);
        showToast(`Loaded ${parsed.length} channels from MinnatTv.m3u`);
      })
      .catch(() => {
        setPlaylistLabel("No playlist loaded");
      });
  }, [showToast]);

  const handleLoad = useCallback(
    (text: string, label: string) => {
      const parsed = parseM3U(text);
      if (!parsed.length) {
        showToast("No channels found in playlist");
        return;
      }
      setChannels(parsed);
      setCurrentIdx(-1);
      setPlaylistLabel(`${parsed.length} channels · ${label}`);
      showToast(`Loaded ${parsed.length} channels`);
    },
    [showToast],
  );

  const handleToggleFav = useCallback(
    (key: string) => {
      const ch = channels.find((c) => c.key === key);
      if (!ch) return;
      const wasFav = isFav(key);
      toggle(key);
      showToast(
        wasFav
          ? `Removed "${ch.name}" from favourites`
          : `Added "${ch.name}" to favourites ★`,
      );
    },
    [channels, isFav, toggle, showToast],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "ArrowUp" && currentIdx > 0) setCurrentIdx((i) => i - 1);
      if (e.key === "ArrowDown" && currentIdx < channels.length - 1)
        setCurrentIdx((i) => i + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIdx, channels.length]);

  const currentChannel = currentIdx >= 0 ? channels[currentIdx] : null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0d0f14]">
      <Header
        playlistLabel={playlistLabel}
        onLoadClick={() => setModalOpen(true)}
        onSearch={setGlobalSearch}
        setShowSidebar={setShowSidebar}
      />

      <div className="flex flex-1 lg:flex-row flex-col overflow-hidden">
        {/* Player: 2/3 */}
        <div className="lg:flex-1 min-w-0 p-3 pr-2 h-full overflow-hidden">
          <VideoPlayer
            channel={currentChannel}
            onPrev={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            onNext={() =>
              setCurrentIdx((i) => Math.min(channels.length - 1, i + 1))
            }
            hasPrev={currentIdx > 0}
            hasNext={currentIdx < channels.length - 1}
          />
        </div>

        {/* Channel list: 1/3 */}
        <div className="hiddens lg:block lg:w-75 w-full min-w-65 h-full  overflow-hidden border-l ">
          <ChannelList
            channels={
              globalSearch
                ? channels.filter(
                    (c) =>
                      c.name
                        .toLowerCase()
                        .includes(globalSearch.toLowerCase()) ||
                      (c.group || "")
                        .toLowerCase()
                        .includes(globalSearch.toLowerCase()),
                  )
                : channels
            }
            currentIdx={currentIdx}
            isFav={isFav}
            onToggleFav={handleToggleFav}
            onSelect={(idx) => setCurrentIdx(idx)}
          />
        </div>
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
        <div
          className={`fixed top-0 right-0 h-full w-75 max-w-[85vw]  shadow-xl z-50 transform transition-transform duration-300 lg:hidden ${
            showSidebar ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* <div className="flex absolute top-4 -left-4 items-center text-xs px-3 py-1.5 justify-between border border-[#2a3050] rounded-full bg-red-500 p-1">
            <button onClick={() => setShowSidebar(false)}>X</button>
          </div> */}

          <ChannelList
            channels={
              globalSearch
                ? channels.filter(
                    (c) =>
                      c.name
                        .toLowerCase()
                        .includes(globalSearch.toLowerCase()) ||
                      (c.group || "")
                        .toLowerCase()
                        .includes(globalSearch.toLowerCase()),
                  )
                : channels
            }
            currentIdx={currentIdx}
            isFav={isFav}
            onToggleFav={handleToggleFav}
            onSelect={(idx) => setCurrentIdx(idx)}
          />
        </div>
      </div>

      <LoadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onLoad={handleLoad}
      />

      <Toast message={toast.msg} key={toast.k} />
    </div>
  );
}
