import React, { useState, useEffect } from 'react';
import TopPanel from './components/TopPanel';
import Navigation from './components/Navigation';
import WindowContainer from './components/WindowContainer';
import AboutSection from './components/sections/AboutSection';
import VideoShowcase from './components/sections/VideoShowcase';
import VerticalShowcase from './components/sections/VerticalShowcase';
import ContactSection from './components/sections/ContactSection';
import TerminalSection from './components/sections/TerminalSection';
import { SectionType, VideoData } from './types';

const staticVideoData: VideoData = {
  fullLength: [
    {
      id: "fl-1",
      title: "Visualizations that sell",
      subtitle: "or how animations make your video come alive",
      difficulty: "medium",
      text: "This video was a kind of test for me. It was important to me to show that even simple visual editing can be appealing. I think I succeeded.",
      url: "https://youtu.be/kli9SjiCXG4?si=aPhEn34GGnS9R6ls"
    },
    {
      id: "fl-2",
      title: "Accentuation as a lifeline",
      subtitle: "A brief overview of how editing can save even hopeless videos.",
      difficulty: "easy",
      text: "Initially, the narrator of this video had very poor speech delivery, making it incredibly difficult to engage the viewer, but I was able to find an individual approach, taking the video to a new level.",
      url: "https://youtu.be/kquBMQTlAqA?si=9AP84Z6MBmNkGko-"
    }
  ],
  vertical: [
    {
      id: "v-1",
      title: "The power of numbers",
      text: "When you need to make a boring lecture beautiful",
      url: "https://youtu.be/ruGOtcqJ5sg?si=_Sf1plwtZwr2us8h"
    },
    {
      id: "v-2",
      title: "AI Duo",
      text: "A clear illustration of why neural networks with humans at the helm are powerful.",
      url: "https://youtu.be/ZSzZw7AmOzE?si=54_5GsxoAf0cyxRF"
    },
    {
      id: "v-3",
      title: "Podcasts are almighty",
      text: "Medical concerns in simple terms.",
      url: "https://youtu.be/Iob_g3vITyI"
    }
  ],
  motionGraphics: [
    {
      id: "mg-1",
      title: "Animated presentation",
      subtitle: "But at least it's not boring to watch.",
      difficulty: "medium",
      text: "The idea for this animation came from Max.Mov's video of configuring Windows 11 for 8 hours, where he made a similar presentation of his system at the beginning.",
      url: "https://youtu.be/MYKo3KA2u-U"
    },
    {
      id: "mg-2",
      title: "Gamer interface animation",
      subtitle: "Systems can look beautiful too",
      difficulty: "easy",
      text: "I've long been a fan of system interfaces. So, for me, animating some system component was only a matter of time.",
      url: "https://youtu.be/3cccfWBxXHg"
    }
  ]
};

// Encapsulated workspace layer that handles its own open/close window animations
interface WorkspaceLayerProps {
  isActive: boolean;
  activeSection: SectionType | null;
  onClose: () => void;
  videoData: VideoData | null;
}

const WorkspaceLayer: React.FC<WorkspaceLayerProps> = ({ isActive, activeSection, onClose, videoData }) => {
  const [renderedSection, setRenderedSection] = useState<SectionType | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Handle window transition animations specific to this workspace
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (activeSection === renderedSection) {
      return; // State is synced, do nothing
    }

    if (renderedSection !== null) {
      // Trigger the closing animation first
      setIsClosing(true);
      timeoutId = setTimeout(() => {
        setRenderedSection(activeSection);
        setIsClosing(false);
      }, 300); // Wait for 300ms (matches CSS animation duration)
    } else {
      // Simply render the new one immediately
      setRenderedSection(activeSection);
      setIsClosing(false);
    }

    return () => clearTimeout(timeoutId);
  }, [activeSection, renderedSection]);

  const renderContent = (section: SectionType | null) => {
    switch (section) {
      case 'About Me':
        return <AboutSection key="about" />;
      case 'Full-Length Videos':
        return videoData ? <VideoShowcase key="fl" videos={videoData.fullLength} /> : <div className="p-8 text-slate-400 font-mono text-sm animate-pulse">Loading configuration...</div>;
      case 'Vertical Videos':
        return videoData ? <VerticalShowcase key="v" videos={videoData.vertical} /> : <div className="p-8 text-slate-400 font-mono text-sm animate-pulse">Loading configuration...</div>;
      case 'Motion Graphics':
        return videoData ? <VideoShowcase key="mg" videos={videoData.motionGraphics} /> : <div className="p-8 text-slate-400 font-mono text-sm animate-pulse">Loading configuration...</div>;
      case 'Contact Me':
        return <ContactSection key="contact" />;
      case 'Terminal':
        return <TerminalSection key="terminal" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center transition-opacity duration-300 ease-in-out ${isActive ? 'opacity-100 z-10 pointer-events-none' : 'opacity-0 z-0 pointer-events-none'}`}
    >
      {renderedSection && (
        <WindowContainer 
          title={renderedSection === 'Terminal' ? 'Konsole' : renderedSection} 
          onClose={onClose}
          isClosing={isClosing}
          resizable={renderedSection === 'Vertical Videos'}
          initialHeight={renderedSection === 'Vertical Videos' ? '80vh' : '65vh'}
        >
          {renderContent(renderedSection)}
        </WindowContainer>
      )}
    </div>
  );
};

const App: React.FC = () => {
  // State for Workspaces
  const [currentWorkspace, setCurrentWorkspace] = useState<number>(1);
  const [workspaceSections, setWorkspaceSections] = useState<Record<number, SectionType | null>>({
    1: null,
    2: null,
    3: null
  });

  const handleSectionChange = (section: SectionType | null) => {
    setWorkspaceSections(prev => ({ ...prev, [currentWorkspace]: section }));
  };

  const handleOpenTerminal = () => {
    setWorkspaceSections(prev => ({ ...prev, [currentWorkspace]: 'Terminal' }));
  };

  // Mobile Back Button Handler
  const prevActiveSection = React.useRef<SectionType | null>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const activeSection = workspaceSections[currentWorkspace];

    const handlePopState = (event: PopStateEvent) => {
      // If a section is open, close it
      if (activeSection) {
        setWorkspaceSections(prev => ({ ...prev, [currentWorkspace]: null }));
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Push state when opening a section
    if (activeSection && !prevActiveSection.current) {
      window.history.pushState({ section: activeSection }, '');
    }

    prevActiveSection.current = activeSection;

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [workspaceSections, currentWorkspace]);

  // Standard Desktop App Render
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col font-text text-slate-200">
      
      {/* Hemisphere and Backlight Background */}
      <div className="absolute inset-0 bg-bgMain -z-20 overflow-hidden">
        {/* Huge Backlight / Aura */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-[120vw] md:w-[80vw] h-[60vh] bg-accent1 blur-[120px] opacity-40 rounded-full mix-blend-screen -z-10 pointer-events-none"></div>
        
        {/* Hemisphere / Dark Planet */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[80%] w-[200vw] md:w-[150vw] lg:w-[120vw] aspect-square rounded-full bg-[#02050A] border-t-[1.5px] border-accent1/50 shadow-[inset_0_4px_30px_rgba(0,168,255,0.2)] -z-10 pointer-events-none"></div>
      </div>

      <TopPanel 
        activeWorkspace={currentWorkspace} 
        onWorkspaceChange={setCurrentWorkspace} 
        onOpenTerminal={handleOpenTerminal} 
      />
      
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col p-4 md:p-6 lg:p-8 relative z-10 h-[calc(100vh-2rem)]">
        <Navigation 
          activeSection={workspaceSections[currentWorkspace]} 
          onSectionChange={handleSectionChange} 
        />
        
        {/* Window Area with Workspace Layers */}
        <div className="flex-1 w-full flex flex-col items-center justify-center min-h-0 relative pb-4 z-[45] pointer-events-none">
          {[1, 2, 3].map(ws => (
            <WorkspaceLayer
              key={ws}
              isActive={ws === currentWorkspace}
              activeSection={workspaceSections[ws]}
              onClose={() => setWorkspaceSections(prev => ({ ...prev, [ws]: null }))}
              videoData={staticVideoData}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;