'use client';

import { useEffect, useState } from 'react';

const HERO_IMAGE = '/images/hero-image.jpg';
const FALLBACK_IMAGE = '/images/og-image.jpg';

export default function HeroBackground() {
  const [hasVideo, setHasVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [useFallbackImg, setUseFallbackImg] = useState(false);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = '/images/hero-video.mp4';
    video.oncanplay = () => setHasVideo(true);
    video.onerror = () => {
      setHasVideo(false);
      setVideoError(true);
    };
  }, []);

  const imgSrc = useFallbackImg ? FALLBACK_IMAGE : HERO_IMAGE;

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      {hasVideo && !videoError && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={HERO_IMAGE}
        >
          <source src="/images/hero-video.mp4" type="video/mp4" />
          <source src="/images/hero-video.webm" type="video/webm" />
        </video>
      )}
      {(!imgError || useFallbackImg) && (
        <img
          src={imgSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => {
            if (!useFallbackImg) setUseFallbackImg(true);
            else setImgError(true);
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-blue-700/60 to-blue-800/80 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.1),transparent)] z-10" />
    </div>
  );
}
