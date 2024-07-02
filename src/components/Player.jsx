import { useEffect, useRef } from "react";
import Hls from "hls.js";
import "video.js/dist/video-js.css";

const Player = ({ streamUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    const hls = new Hls();

    if (Hls.isSupported()) {
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.muted = true; // Mute the video to allow autoplay
        video.play().catch((error) => {
          console.error("Error attempting to play", error);
        });
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        video.muted = true; // Mute the video to allow autoplay
        video.play().catch((error) => {
          console.error("Error attempting to play", error);
        });
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl]);

  return (
    <div className="player-wrapper">
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        controls
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default Player;
