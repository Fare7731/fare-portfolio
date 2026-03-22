import React, { useState, useRef } from 'react';
import { SectionType, VideoData } from '../types';
import AboutSection from './sections/AboutSection';
import VideoShowcase from './sections/VideoShowcase';
import VerticalShowcase from './sections/VerticalShowcase';
import ContactSection from './sections/ContactSection';

interface MobileViewProps {
  videoData: VideoData;
}

const sections: SectionType[] = [
  'About Me',
  'Full-Length Videos',
  'Vertical Videos',
  'Motion Graphics',
  'Contact Me'
];

const MobileView: React.FC<MobileViewProps> = ({ videoData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = touchStartY.current - touchEndY.current;
    
    // Find if we are swiping inside a scrollable container
    const findScrollableParent = (el: HTMLElement | null): HTMLElement | null => {
      if (!el || el === e.currentTarget) return null;
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;
      const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
      const canScroll = el.scrollHeight > el.clientHeight;
      
      if (isScrollable && canScroll) return el;
      return findScrollableParent(el.parentElement);
    };

    const scrollableEl = findScrollableParent(e.target as HTMLElement);

    if (Math.abs(deltaY) > 70) {
      if (deltaY > 0 && currentIndex < sections.length - 1) {
        // Swipe up -> next section
        if (scrollableEl) {
          // Only switch if we're already at the bottom of the scrollable content
          const isAtBottom = Math.abs(scrollableEl.scrollHeight - scrollableEl.scrollTop - scrollableEl.clientHeight) < 5;
          if (isAtBottom) {
            setCurrentIndex(prev => prev + 1);
          }
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      } else if (deltaY < -70 && currentIndex > 0) {
        // Swipe down -> previous section
        if (scrollableEl) {
          // Only switch if we're already at the top of the scrollable content
          const isAtTop = scrollableEl.scrollTop <= 5;
          if (isAtTop) {
            setCurrentIndex(prev => prev - 1);
          }
        } else {
          setCurrentIndex(prev => prev - 1);
        }
      }
    }
    
    // Reset touch coordinates to prevent accidental triggers
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  const renderContent = (section: SectionType) => {
    switch (section) {
      case 'About Me':
        return <AboutSection onContactClick={() => setCurrentIndex(sections.indexOf('Contact Me'))} />;
      case 'Full-Length Videos':
        return <VideoShowcase videos={videoData.fullLength} isMobileView={true} />;
      case 'Vertical Videos':
        return <VerticalShowcase videos={videoData.vertical} isMobileView={true} />;
      case 'Motion Graphics':
        return <VideoShowcase videos={videoData.motionGraphics} isMobileView={true} />;
      case 'Contact Me':
        return <ContactSection />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 w-full h-full bg-bgMain z-[100] overflow-hidden flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-bgMain -z-10 overflow-hidden">
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-[150vw] h-[50vh] bg-accent1 blur-[100px] opacity-20 rounded-full pointer-events-none"></div>
      </div>

      <div className="flex-1 relative">
        {sections.map((section, index) => (
          <div 
            key={section}
            className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out p-4 flex flex-col justify-center ${
              index === currentIndex ? 'translate-y-0 opacity-100' : 
              index < currentIndex ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'
            }`}
          >
            <div className="w-full h-full flex flex-col pt-8 pb-6">
               {renderContent(section)}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Navigation Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <div className="flex gap-2">
          {sections.map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-accent1 w-4' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileView;
