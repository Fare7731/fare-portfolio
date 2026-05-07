import React, { useState, useEffect } from 'react';
import { SectionType } from '../types';
import LocalizedText from './LocalizedText';

interface NavigationProps {
  activeSection: SectionType | null;
  onSectionChange: (section: SectionType | null) => void;
}

const SECTIONS: SectionType[] = [
  'About Me',
  'Full-Length Videos',
  'Motion Graphics',
  'Contact Me'
];

const SECTION_NAMES_RU: Record<string, string> = {
  'About Me': 'Обо мне',
  'Full-Length Videos': 'Горизонтальные видео',
  'Motion Graphics': 'Motion-дизайн',
  'Contact Me': 'Контакты'
};

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const [showOutline, setShowOutline] = useState(true);

  useEffect(() => {
    // Remove the animated nodes from the DOM slightly after the 1.5s CSS animation finishes
    const timer = setTimeout(() => {
      setShowOutline(false);
    }, 1600);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <nav className="w-full flex justify-center mt-8 mb-6 z-40 relative animate-nav-enlarge">
      <div className="relative rounded-full border border-white/10 shadow-lg shadow-black/40 bg-windowBg backdrop-blur-md">
        
        {/* Animated Running Outline (Glow Shadow Layer) */}
        {showOutline && (
          <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(0,168,255,0.4)] animate-fade-outline pointer-events-none" />
        )}
        
        {/* Animated Running Outline (Edge Stroke via Mask) */}
        {showOutline && (
          <div className="absolute inset-0 rounded-full border-mask overflow-hidden pointer-events-none animate-fade-outline z-20">
            <div className="absolute top-1/2 left-1/2 w-[200vw] h-[200vw] max-w-[2000px] max-h-[2000px] origin-center bg-[conic-gradient(from_0deg,transparent_0%,#00A8FF_20%,#ff007f_40%,#360078_60%,transparent_80%)] animate-spin-outline" />
          </div>
        )}
        
        {/* Inner Content Block */}
        <div className="relative flex flex-wrap justify-center p-1.5 z-10">
          {SECTIONS.map((section) => {
            const isActive = activeSection === section;
            return (
              <button
                key={section}
                // If it's already active, click again closes it. Otherwise open the new one.
                onClick={() => onSectionChange(isActive ? null : section)}
                className={`
                  px-4 md:px-6 py-2 rounded-full text-sm font-subheading transition-all duration-300 ease-in-out relative
                  ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}
                `}
              >
                <span className="relative z-10">
                  <LocalizedText en={section} ru={SECTION_NAMES_RU[section]} />
                </span>
                {isActive && (
                  <div className="absolute inset-0 bg-accent1 rounded-full -z-0 shadow-[0_0_15px_rgba(0,168,255,0.5)] animate-fade-in" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;