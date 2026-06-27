"use client";
import { useEffect, useState } from "react";

interface Props {
  message: string;
  key?: number;
}

export default function Toast({ message, key: k }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, [message, k]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-lg bg-[#1e2230] border border-[#4f7ef8] text-xs text-[#e8eaf2] shadow-lg pointer-events-none transition-all duration-300 whitespace-nowrap ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {message}
    </div>
  );
}
