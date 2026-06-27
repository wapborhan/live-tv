import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live TV",
  description: "M3U Live TV Player",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
