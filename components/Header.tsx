"use client";

interface Props {
  playlistLabel: string;
  onLoadClick: () => void;
  onSearch: (q: string) => void;
  setShowSidebar: (q: boolean) => void;
}

export default function Header({
  playlistLabel,
  onLoadClick,
  setShowSidebar,
}: Props) {
  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-[#161920] border-b border-[#2a3050] shrink-0">
      <h1 className="flex items-center gap-2 text-sm font-bold tracking-wide text-[#e8eaf2]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        Minnat Live TV
      </h1>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#7a83a0] whitespace-nowrap hidden sm:block">
          {playlistLabel}
        </span>
        <button
          onClick={onLoadClick}
          className="bg-[#4f7ef8] hover:bg-[#3d63d4] text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
        >
          📂 Load M3U
        </button>
        <button
          onClick={() => setShowSidebar(true)}
          className="bg-[#4f7ef8] hover:bg-[#3d63d4] lg:hidden block text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
