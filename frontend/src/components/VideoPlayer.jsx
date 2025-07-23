import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function VideoPlayer({ src, poster }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // فقط عند توفر src والعنصر موجود
    if (videoRef.current && src) {
      // إذا فيه مشغل قديم نظفه
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        responsive: true,
        fluid: true,
        poster: poster || "",
        sources: [
          {
            src,
            type: "video/mp4",
          },
        ],
        language: "ar",
      });
    }

    // التنظيف عند الخروج
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster]);

  // لا تعرض شيء إذا src غير موجود
  if (!src) return null;

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        playsInline
      />
    </div>
  );
}
