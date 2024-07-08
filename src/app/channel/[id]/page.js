import Player from "@/components/Player";
import StreamPage from "@/components/StreamPage";

export default function Page({ params }) {
  return (
    <div>
      <StreamPage id={params.id} />
    </div>
  );
}
