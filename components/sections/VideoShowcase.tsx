import React, { useState, useEffect, useRef } from 'react';
import { VideoItem, Difficulty } from '../../types';
import { getEmbedUrl } from '../../utils/youtube';
import { ChevronUpIcon, ChevronDownIcon, PlayIcon } from '../Icons';

const images = import.meta.glob('./pic/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

interface VideoShowcaseProps {
  videos: VideoItem[];
}

const DifficultyBadge = ({ level }: { level?: Difficulty }) => {
  if (!level) return null;
  
  const colors = {
    easy: 'bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
  };

  return (
    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-mono rounded border ${colors[level]}`}>
      {level}
    </span>
  );
};

const VideoShowcase: React.FC<VideoShowcaseProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartY = useRef(0);
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});

  const pauseCurrentVideo = () => {
    if (playingVideo) {
      const iframe = iframeRefs.current[playingVideo];
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
      }
      setPlayingVideo(null);
    }
  };

  const handlePlay = (id: string) => {
    if (playingVideo && playingVideo !== id) {
      pauseCurrentVideo();
    }
    setPlayingVideo(id);
    const iframe = iframeRefs.current[id];
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
    }
  };

  const nextVideo = () => {
    if (currentIndex < videos.length - 1) {
      pauseCurrentVideo();
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevVideo = () => {
    if (currentIndex > 0) {
      pauseCurrentVideo();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Handle mouse wheel scrolling for seamless navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (isScrolling) return;

    if (e.deltaY > 50 && currentIndex < videos.length - 1) {
      setIsScrolling(true);
      nextVideo();
      timeoutRef.current = setTimeout(() => setIsScrolling(false), 1000);
    } else if (e.deltaY < -50 && currentIndex > 0) {
      setIsScrolling(true);
      prevVideo();
      timeoutRef.current = setTimeout(() => setIsScrolling(false), 1000);
    }
  };

  // Handle touch swipes for mobile users
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isScrolling) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;

    if (deltaY > 50 && currentIndex < videos.length - 1) {
      setIsScrolling(true);
      nextVideo();
      timeoutRef.current = setTimeout(() => setIsScrolling(false), 800);
    } else if (deltaY < -50 && currentIndex > 0) {
      setIsScrolling(true);
      prevVideo();
      timeoutRef.current = setTimeout(() => setIsScrolling(false), 800);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div 
      className="w-full h-full relative overflow-hidden"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Copyright */}
      <div className="absolute top-0 right-0 p-6 pr-20 md:pr-28 z-20 pointer-events-none">
        <span className="font-mono text-[10px] text-slate-500/70 tracking-widest uppercase hidden sm:block text-right">
          © Fare 2026. All rights reserved.
        </span>
      </div>

      {/* Video Items */}
      {videos.map((video, index) => {
        const isActive = index === currentIndex;
        // Cinematic ease out transition
        const transitionClass = isActive 
          ? 'opacity-100 translate-y-0 scale-100 z-10 pointer-events-auto delay-100' 
          : index < currentIndex 
            ? 'opacity-0 -translate-y-16 scale-95 z-0 pointer-events-none'
            : 'opacity-0 translate-y-16 scale-95 z-0 pointer-events-none';

        return (
          <div 
            key={video.id} 
            className={`absolute inset-0 w-full h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 p-4 lg:pr-24 transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${transitionClass}`}
          >
            {/* Left: Video Embed */}
            <div className="w-full max-w-2xl lg:w-3/5 aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,112,187,0.4)] hover:border-accent1/50 group shrink-0 relative">
              <iframe
                ref={(el) => { iframeRefs.current[video.id] = el; }}
                src={getEmbedUrl(video.url)}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
              ></iframe>
              
              {playingVideo !== video.id && (
                <div 
                  className="absolute inset-0 w-full h-full cursor-pointer z-10"
                  onClick={() => handlePlay(video.id)}
                >
                  <img 
                    src={images[`./pic/${video.id}.png`] || 'https://picsum.photos/seed/vibrant/1920/1080?blur=4'} 
                    alt={video.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 bg-accent1/80 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(0,168,255,0.5)] group-hover:scale-110 transition-transform">
                      <PlayIcon className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="w-full lg:w-2/5 flex flex-col items-start pb-12 lg:pb-0">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl lg:text-3xl font-heading text-white">{video.title}</h3>
                {video.difficulty && <DifficultyBadge level={video.difficulty} />}
              </div>
              
              {video.subtitle && (
                <h4 className="text-lg font-subheading text-accent1 mb-4 border-b border-accent1/30 pb-2 w-full">
                  {video.subtitle}
                </h4>
              )}
              
              <p className="text-slate-300 font-text leading-relaxed">
                {video.text}
              </p>
            </div>
          </div>
        );
      })}

      {/* Navigation Controls Overlay */}
      {videos.length > 1 && (
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-20 bg-windowBg/60 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <button
            onClick={prevVideo}
            disabled={currentIndex === 0}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors focus:outline-none"
            title="Previous Video"
          >
            <ChevronUpIcon className="w-5 h-5" />
          </button>

          <div className="flex flex-col gap-3 py-2">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                  i === currentIndex
                    ? 'bg-accent1 shadow-[0_0_12px_rgba(0,168,255,0.9)] scale-125'
                    : 'bg-white/20 hover:bg-white/50'
                }`}
                aria-label={`Go to video ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextVideo}
            disabled={currentIndex === videos.length - 1}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors focus:outline-none"
            title="Next Video"
          >
            <ChevronDownIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoShowcase;
