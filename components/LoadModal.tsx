"use client";
import { useState, useRef } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onLoad: (text: string, label: string) => void;
}

const DEMO_M3U = `#EXTM3U
#EXTINF:-1 tvg-name="Big Buck Bunny" tvg-logo="" group-title="Test Streams",Big Buck Bunny
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
#EXTINF:-1 tvg-name="Tears of Steel" tvg-logo="" group-title="Test Streams",Tears of Steel
https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8
#EXTINF:-1 tvg-name="Apple HLS Sample" tvg-logo="" group-title="Test Streams",Apple HLS Sample
https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8
#EXTINF:-1 tvg-name="Broken Stream Test" tvg-logo="" group-title="Test Streams",Broken Stream (Test Error)
https://this-stream-does-not-exist.example.com/stream.m3u8`;

type Tab = "url" | "paste" | "file" | "demo";

export default function LoadModal({ open, onClose, onLoad }: Props) {
  const [tab, setTab] = useState<Tab>("url");
  const [url, setUrl] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFetch = async () => {
    if (!url.trim()) return;
    setFetching(true); setError("");
    try {
      const res = await fetch(url.trim());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      onLoad(text, url.split("/").pop() || "URL");
      onClose();
    } catch (e) {
      setError("Failed to fetch. The URL may not allow CORS.");
    } finally {
      setFetching(false);
    }
  };

  const handleFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      onLoad(ev.target?.result as string, f.name);
      onClose();
    };
    reader.readAsText(f);
  };

  const handleLoad = () => {
    if (tab === "url") { handleFetch(); return; }
    if (tab === "paste") {
      if (!pasteText.trim()) { setError("Paste some M3U content first."); return; }
      onLoad(pasteText, "Pasted playlist"); onClose(); return;
    }
    if (tab === "file") {
      const f = fileRef.current?.files?.[0];
      if (!f) { setError("Select a file first."); return; }
      handleFile(f); return;
    }
    if (tab === "demo") { onLoad(DEMO_M3U, "Demo Streams"); onClose(); }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "url", label: "URL" },
    { id: "paste", label: "Paste M3U" },
    { id: "file", label: "Upload File" },
    { id: "demo", label: "Demo" },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#161920] border border-[#2a3050] rounded-xl p-5 w-full max-w-md flex flex-col gap-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#e8eaf2]">Load M3U Playlist</h2>
          <button onClick={onClose} className="text-[#7a83a0] hover:text-[#e8eaf2] text-lg leading-none">×</button>
        </div>

        {/* Tab bar */}
        <div className="flex border border-[#2a3050] rounded-lg overflow-hidden">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setError(""); }}
              className={`flex-1 py-1.5 text-xs font-semibold transition-colors ${
                tab === t.id
                  ? "bg-[#4f7ef8] text-white"
                  : "bg-[#1e2230] text-[#7a83a0] hover:text-[#e8eaf2]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "url" && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                placeholder="https://example.com/playlist.m3u"
                className="flex-1 bg-[#1e2230] border border-[#2a3050] rounded-lg px-3 py-2 text-xs text-[#e8eaf2] placeholder-[#7a83a0] outline-none focus:border-[#4f7ef8]"
              />
              <button
                onClick={handleFetch}
                disabled={fetching}
                className="bg-[#4f7ef8] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#3d63d4] disabled:opacity-60 transition-colors"
              >
                {fetching ? "…" : "Fetch"}
              </button>
            </div>
            <p className="text-[10px] text-[#7a83a0]">URL must allow CORS. Many public playlists work directly.</p>
          </div>
        )}

        {tab === "paste" && (
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={"#EXTM3U\n#EXTINF:-1 tvg-name=\"Channel\" group-title=\"Group\",Channel\nhttp://stream.url/stream.m3u8"}
            className="w-full h-40 bg-[#1e2230] border border-[#2a3050] rounded-lg px-3 py-2 text-xs font-mono text-[#e8eaf2] placeholder-[#7a83a0] outline-none focus:border-[#4f7ef8] resize-y"
          />
        )}

        {tab === "file" && (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept=".m3u,.m3u8,.txt"
              className="text-xs text-[#e8eaf2]"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleFile(f); } }}
            />
          </div>
        )}

        {tab === "demo" && (
          <p className="text-xs text-[#7a83a0] leading-relaxed">
            Load built-in demo streams (public HLS test content) to explore the player UI. Includes a broken stream to test the error state.
          </p>
        )}

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-xs text-[#e8eaf2] bg-[#1e2230] border border-[#2a3050] rounded-lg hover:bg-[#252a3a] transition-colors">Cancel</button>
          <button onClick={handleLoad} disabled={fetching} className="px-4 py-2 text-xs font-semibold text-white bg-[#4f7ef8] rounded-lg hover:bg-[#3d63d4] disabled:opacity-60 transition-colors">
            {tab === "demo" ? "Load Demo" : "Load Playlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
