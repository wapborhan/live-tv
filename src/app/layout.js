import { Inter } from "next/font/google";
import "../assets/css/custom.css";
import MainMenu from "@/components/MainMenu";
import ScrollableContainers from "@/components/ScrollableContainers";
import MusicPlayer from "@/components/MusicPlayer";
import RecommendedSongs from "@/components/RecommendedSongs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Find Dev's",
  description: " Connect and Discover with Skilled Developers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`template-color-1 home-sticky spybody white-version ${inter.className}`}
      >
        <main>
          <MainMenu />
          <ScrollableContainers />
          <section className="content">
            <div className="left-content">{children}</div>
            <div className="right-content">
              <MusicPlayer />
              <RecommendedSongs />
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
