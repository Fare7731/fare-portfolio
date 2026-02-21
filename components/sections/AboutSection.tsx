import React from 'react';

const avatarImg = new URL('./pic/logo.jpg', import.meta.url).href;

const AboutSection: React.FC = () => {
  return (
    <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-start md:justify-center gap-6 md:gap-12 p-0 md:p-4 overflow-y-auto md:overflow-hidden animate-fade-in pb-12 md:pb-4 scrollbar-hide">
      {/* Copyright */}
      <div className="absolute top-0 right-0 p-6 z-20 pointer-events-none">
        <span className="font-mono text-[10px] text-slate-500/70 tracking-widest uppercase hidden sm:block text-right">
          © Fare 2026. All rights reserved.
        </span>
      </div>

      {/* Left: Avatar */}
      <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-accent1/50 shadow-[0_0_30px_rgba(0,112,187,0.3)] shrink-0 relative group">
        <img 
          src={avatarImg} 
          alt="Eugene Avatar" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-accent2/40 to-transparent mix-blend-overlay pointer-events-none"></div>
      </div>

      {/* Right: Info */}
      <div className="flex flex-col max-w-lg">
        <h2 className="text-4xl md:text-5xl font-heading text-white mb-2 tracking-tight">
          I'm <span className="text-accent1 drop-shadow-[0_0_10px_rgba(0,112,187,0.5)]">Eugene</span>
        </h2>
        <h3 className="text-xl md:text-2xl font-subheading text-slate-300 mb-6 font-medium">
          Professional Video Editor & Motion Designer
        </h3>
        
        <div className="prose prose-invert border-l-2 border-accent2 pl-4">
          <p className="text-slate-300 leading-relaxed font-text text-lg">
            Video is a reflection of the author's soul. If the viewer doesn't feel you when watching your video, it means the editor didn't do a good job of creating quality. I'm here to correct this misunderstanding.
          </p>
          <p className="text-slate-400 mt-4 leading-relaxed font-text">
            For me, video isn't just a shell that shows something. Three years of professional editing experience have taught me: every video is a piece of my soul, including yours as the editor. And I put my whole soul into each video, so the viewer will hold their breath.
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <div className="flex items-center gap-2 font-mono text-xs text-accent1 bg-accent1/10 px-3 py-1.5 rounded border border-accent1/20">
            <span className="w-2 h-2 rounded-full bg-accent1 animate-pulse"></span>
            AVAILABLE FOR WORK
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;