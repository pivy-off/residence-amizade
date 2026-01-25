'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function HeroBackground() {
  const [hasVideo, setHasVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Check if video exists by trying to load it
    const video = document.createElement('video');
    video.src = '/images/hero-video.mp4';
    video.oncanplay = () => setHasVideo(true);
    video.onerror = () => {
      setHasVideo(false);
      setVideoError(true);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      {/* Video Background - if hero-video.mp4 exists */}
      {hasVideo && !videoError && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/hero-image.jpg"
        >
          <source src="/images/hero-video.mp4" type="video/mp4" />
          <source src="/images/hero-video.webm" type="video/webm" />
        </video>
      )}
      {/* Fallback Image Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-image.jpg"
          alt="Résidence Amizade"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          onError={(e) => {
            // Fallback to gradient if image doesn't exist
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.1),transparent)] z-10"></div>
    </div>
  );
}
