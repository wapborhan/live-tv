import PopularPlaylist from "../components/PopularPlaylist";
import FeaturedArtists from "../components/FeaturedArtists";
import RecommendedAlbums from "../components/RecommendedAlbums";
import BanglaChannel from "@/components/BanglaChannel";

export default function Home() {
  return (
    <div className="my-5">
      <PopularPlaylist />
      <RecommendedAlbums />
      <BanglaChannel />
      {/* <FeaturedArtists /> */}
    </div>
  );
}
