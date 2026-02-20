import React, { useState, useEffect, useRef } from 'react';
import { VideoItem } from '../../types';
import { getEmbedUrl } from '../../utils/youtube';
import { ChevronUpIcon, ChevronDownIcon, PlayIcon } from '../Icons';

const images = import.meta.glob('./pic/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

interface VerticalShowcaseProps {
  videos: VideoItem[];
}

const VerticalShowcase: React.FC<VerticalShowcaseProps> = ({ videos }) => {
  const [currentPage, setCurrentPage] = useState(0);
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

  // Chunk videos into pages of 3 (rows of 3)
  const chunkSize = 3;
  const pages: VideoItem[][] = [];
  for (let i = 0; i < videos.length; i += chunkSize) {
    pages.push(videos.slice(i, i + chunkSize));
  }

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      pauseCurrentVideo();
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      pauseCurrentVideo();
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Handle mouse wheel scrolling for seamless navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (isScrolling) return;

    if (e.deltaY > 50 && currentPage < pages.length - 1) {
      setIsScrolling(true);
      nextPage();
      // Reset after animation duration
      timeoutRef.current = setTimeout(() => setIsScrolling(false), 1000);
    } else if (e.deltaY < -50 && currentPage > 0) {
      setIsScrolling(true);
      prevPage();
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

    if (deltaY > 50 && currentPage < pages.length - 1) {
      setIsScrolling(true);
      nextPage();
      timeoutRef.current = setTimeout(() => setIsScrolling(false), 800);
    } else if (deltaY < -50 && currentPage > 0) {
      setIsScrolling(true);
      prevPage();
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
      className="w-full h-full relative overflow-hidden flex flex-col"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Static Header */}
      <div className="absolute top-0 left-0 w-full p-6 z-20 pointer-events-none flex justify-between items-center">
        <h3 className="text-2xl font-heading text-white flex items-center gap-3">
          <span className="w-1.5 h-6 bg-accent2 rounded-full inline-block shadow-[0_0_10px_rgba(54,0,120,0.8)]"></span>
          Short-form Content
        </h3>
        <span className="font-mono text-[10px] text-slate-500/70 tracking-widest uppercase hidden sm:block pr-16 md:pr-24 text-right">
          © Fare 2026. All rights reserved.
        </span>
      </div>

      {/* Pages Container */}
      <div className="flex-1 w-full h-full relative">
        {pages.map((page, pageIndex) => {
          const isActive = pageIndex === currentPage;
          const isPast = pageIndex < currentPage;

          return (
            <div 
              key={pageIndex} 
              className={`absolute inset-0 w-full h-full flex flex-row items-center justify-center gap-4 md:gap-8 p-4 pt-20 lg:pr-28 pointer-events-none ${isActive ? 'z-10' : 'z-0'}`}
            >
              {page.map((video) => {
                // Determine transform based on page state
                const transitionClass = isActive 
                  ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                  : isPast 
                    ? 'opacity-0 -translate-y-24 scale-95 pointer-events-none'
                    : 'opacity-0 translate-y-24 scale-95 pointer-events-none';

                return (
                  <div 
                    key={video.id} 
                    className={`h-[80%] max-h-[550px] aspect-[9/16] relative flex flex-col group transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${transitionClass}`}
                  >
                    <div className="flex-1 rounded-2xl overflow-hidden bg-black/50 border border-white/10 shadow-xl transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(54,0,120,0.5)] group-hover:border-accent2/50 relative z-10 w-full">
                      <iframe
                        ref={(el) => { iframeRefs.current[video.id] = el; }}
                        src={getEmbedUrl(video.url)}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full object-cover"
                      ></iframe>
                      
                      {playingVideo !== video.id && (
                        <div 
                          className="absolute inset-0 w-full h-full cursor-pointer z-10"
                          onClick={() => handlePlay(video.id)}
                        >
                          <img 
                            src={images[`./pic/${video.id}.png`] || 'https://picsum.photos/seed/vibrant/1080/1920?blur=4'} 
                            alt={video.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                            <div className="w-14 h-14 bg-accent2/80 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(54,0,120,0.5)] group-hover:scale-110 transition-transform">
                              <PlayIcon className="w-6 h-6 text-white ml-1" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 px-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <h4 className="font-heading text-white text-base md:text-lg truncate mb-1">{video.title}</h4>
                      <p className="font-text text-xs md:text-sm text-slate-400 line-clamp-2">{video.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Navigation Controls Overlay */}
      {pages.length > 1 && (
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-30 bg-windowBg/60 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors focus:outline-none"
            title="Previous Page"
          >
            <ChevronUpIcon className="w-5 h-5" />
          </button>

          <div className="flex flex-col gap-3 py-2">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                  i === currentPage
                    ? 'bg-accent1 shadow-[0_0_12px_rgba(0,168,255,0.9)] scale-125'
                    : 'bg-white/20 hover:bg-white/50'
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors focus:outline-none"
            title="Next Page"
          >
            <ChevronDownIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VerticalShowcase;
