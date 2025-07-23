import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function VideoPlayer({ src, poster }) {
  const videoRef = useRef();

  useEffect(() => {
    if (!videoRef.current) return;
    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      fluid: true,
      poster,
    });
    return () => {
      player.dispose();
    };
  }, [src, poster]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        controls
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
