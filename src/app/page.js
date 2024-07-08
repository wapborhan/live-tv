import PopularPlaylist from "../components/PopularPlaylist";
import FeaturedArtists from "../components/FeaturedArtists";
import RecommendedAlbums from "../components/RecommendedAlbums";

export default function Home() {
  return (
    <>
      <PopularPlaylist />
      <RecommendedAlbums />
      <FeaturedArtists />
    </>
  );
}
