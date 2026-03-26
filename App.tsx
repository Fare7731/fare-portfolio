import React, { useState, useEffect } from 'react';
import TopPanel from './components/TopPanel';
import Navigation from './components/Navigation';
import WindowContainer from './components/WindowContainer';
import MobileView from './components/MobileView';
import AboutSection from './components/sections/AboutSection';
import VideoShowcase from './components/sections/VideoShowcase';
import VerticalShowcase from './components/sections/VerticalShowcase';
import ContactSection from './components/sections/ContactSection';
import TerminalSection from './components/sections/TerminalSection';
import LocalizedText from './components/LocalizedText';
import { SectionType, VideoData } from './types';

const SECTION_NAMES_RU: Record<string, string> = {
  'About Me': 'Обо мне',
  'Full-Length Videos': 'Горизонтальные видео',
  'Vertical Videos': 'Вертикальные видео',
  'Motion Graphics': 'Motion-дизайн',
  'Contact Me': 'Контакты',
  'Terminal': 'Консоль'
};

const staticVideoData: VideoData = {
  fullLength: [
    {
      id: "fl-1",
      title: "Visualizations that sell",
      titleRu: "Визуал который продаёт",
      subtitle: "or how animations make your video come alive",
      subtitleRu: "или как сделать видео живым",
      difficulty: "medium",
      text: "Using motion graphics in videos shows that content doesn't always have to be in the SDAF format. Even a minimalist visual style can be appealing. In this video, I demonstrated that.",
      textRu: "Использование моушен-графики в роликах показывает что контент не всегда должен быть в сдвг формате. Даже минималистичный визуал может быть привлекательным. В этом видео я это показал",
      url: "https://youtu.be/kli9SjiCXG4?si=aPhEn34GGnS9R6ls"
    },
    {
      id: "fl-2",
      title: "Accentuation as a lifeline",
      titleRu: "Визуал как спасение безнадёжного видео",
      subtitle: "A brief overview of how editing can save even hopeless videos.",
      subtitleRu: "как с помощью монтажа можно из безнадёжного видео сделать шедевр",
      difficulty: "easy",
      text: "When the initial shoot with a narrator looks like no one would want to watch it, that's where editing comes in as the last hope. That's what I tried to do with this video. Did I succeed? Give it a look and find out.",
      textRu: "Когда изначальная съёмка с диктором похожа на то что никто не захотел бы смотреть - именно монтаж является последним спасением. Именно так я попытался спасти это видео. Получилось ли у меня? Посмотри и узнай",
      url: "https://youtu.be/kquBMQTlAqA?si=9AP84Z6MBmNkGko-"
    }
  ],
  vertical: [
    {
      id: "v-1",
      title: "Simply About the Complex",
      titleRu: "Просто о сложном",
      text: "When you need to make a boring lecture beautiful",
      textRu: "Превращение нёрдной лекции в качественную единицу контента",
      url: "https://youtu.be/ruGOtcqJ5sg?si=_Sf1plwtZwr2us8h"
    },
    {
      id: "v-2",
      title: "AI as an Addition",
      titleRu: "ИИ как дополнение",
      text: "Why a \"human-neural network\" duo is stronger than solo neural networks",
      textRu: "Почему дуэт \"человек - нейросеть\" сильнее соло-нейронки",
      url: "https://youtu.be/ZSzZw7AmOzE?si=54_5GsxoAf0cyxRF"
    },
    {
      id: "v-3",
      title: "Minimalism as a Style",
      titleRu: "Минимализм в качестве стиля",
      text: "A good video doesn't always have to be visually complex.",
      textRu: "Хорошее видео не всегда должно быть визуально сложным.",
      url: "https://youtu.be/Vtl5zdUicEI?si=GUk8WE8dsgzI5-5i"
    }
  ],
  motionGraphics: [
    {
      id: "mg-1",
      title: "Animation in Static Content",
      titleRu: "Анимация в статике",
      subtitle: "At least not boring :)",
      subtitleRu: "Хотя-бы не так скучно :)",
      difficulty: "medium",
      text: "The idea for this animation came from Max.Mov's 8-hour video on setting up Windows 11, where he created a similar system presentation at the beginning.",
      textRu: "Идея этой анимации пришла из видео Max.Mov о настройке Windows 11 в течение 8 часов, где он сделал аналогичную презентацию своей системы в начале.",
      url: "https://youtu.be/Vu2K-jwWQys"
    },
    {
      id: "mg-2",
      title: "MacOS Game Launch Style",
      titleRu: "MacOS стиль запуска игры",
      subtitle: "Systems Can Be Visually Beautiful",
      subtitleRu: "И системы можно красиво визуализировать",
      difficulty: "easy",
      text: "I've been a fan of system interfaces for a long time. So creating an animation of some system component was just a matter of time.",
      textRu: "Я давно являюсь фанатом системных интерфейсов. Так что для меня анимация какого-то системного компонента была лишь вопросом времени.",
      url: "https://youtu.be/3cccfWBxXHg"
    }
  ]
};

// Encapsulated workspace layer that handles its own open/close window animations
interface WorkspaceLayerProps {
  isActive: boolean;
  activeSection: SectionType | null;
  onClose: () => void;
  onSectionChange: (section: SectionType | null) => void;
  videoData: VideoData | null;
}

const WorkspaceLayer: React.FC<WorkspaceLayerProps> = ({ isActive, activeSection, onClose, onSectionChange, videoData }) => {
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
        return <AboutSection key="about" onContactClick={() => onSectionChange('Contact Me')} />;
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
          title={
            renderedSection === 'Terminal' 
              ? <LocalizedText en="alacritty" ru="alacritty" />
              : <LocalizedText en={renderedSection} ru={SECTION_NAMES_RU[renderedSection]} />
          } 
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSectionChange = (section: SectionType | null) => {
    setWorkspaceSections(prev => ({ ...prev, [currentWorkspace]: section }));
  };

  const handleOpenTerminal = () => {
    setWorkspaceSections(prev => ({ ...prev, [currentWorkspace]: 'Terminal' }));
  };

  // Auto-open About Me section on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setWorkspaceSections(prev => ({ ...prev, [1]: 'About Me' }));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Standard Desktop App Render
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col font-text text-slate-200">
      {isMobile ? (
        <MobileView videoData={staticVideoData} />
      ) : (
        <>
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
                  onSectionChange={handleSectionChange}
                  videoData={staticVideoData}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;