import React from 'react';
import LocalizedText from '../LocalizedText';

interface AboutSectionProps {
  onContactClick?: () => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ onContactClick }) => {
  return (
    <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-start md:justify-center gap-6 md:gap-12 p-0 md:p-4 overflow-y-auto overflow-x-visible md:overflow-hidden animate-fade-in pb-12 md:pb-4 scrollbar-hide">
      {/* Copyright */}
      <div className="absolute top-0 right-0 p-6 z-20 pointer-events-none">
        <span className="font-mono text-[10px] text-slate-500/70 tracking-widest uppercase hidden sm:block text-right">
          © Fare 2026. All rights reserved.
        </span>
      </div>

      {/* Left: Avatar */}
      <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-accent1/50 shadow-[0_0_30px_rgba(0,112,187,0.3)] shrink-0 relative group mt-8 md:mt-0">
        <img 
          src="/pic/logo.webp" 
          alt="Eugene Avatar" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparenty pointer-events-none"></div>
      </div>

      {/* Right: Info */}
      <div className="flex flex-col max-w-lg overflow-visible">
        <h2 className="text-5xl font-heading text-white mb-2 tracking-tight">
          <LocalizedText en="I'm" ru="Меня зовут" /> <span className="text-accent1 drop-shadow-[0_0_10px_rgba(0,112,187,0.5)]"><LocalizedText en="Eugene" ru="Евгений" /></span>
        </h2>
        <h3 className="text-2xl font-subheading text-slate-300 mb-6 font-medium">
          <LocalizedText en="I'm an editor, but you already know that." ru="Я монтажёр, но ты и так это знаешь" />
        </h3>
        
        <div className="prose prose-invert border-l-2 border-accent2 pl-4">
          <div className="text-slate-300 leading-relaxed font-text text-lg">
            <LocalizedText 
              en="I believe that the final product reflects who made it. If a viewer doesn't feel the effort and passion in your video, then whoever created it didn't meet the quality standards. I'm here to fix that misunderstanding." 
              ru="Я считаю, что конечный продукт отражает того кто его делал. Если зритель не чувствует отдачу при просмотре вашего видео, значит, тот кто его создавал, не справился со своей задачей по созданию качества. Я здесь, чтобы исправить это недопонимание."
              inline={false}
            />
          </div>
          <div className="text-slate-400 mt-4 leading-relaxed font-text text-base">
            <LocalizedText 
              en="For me, videos are more than just visuals - they're investments, not financial ones, but spiritual ones. Three years of professional editing have taught me that I pour my soul into every video so that it takes the viewer's breath away." 
              ru="Для меня видео — это не просто визуал, который что-то показывает. Три года профессионального опыта монтажа научили меня: каждое видео — это инвестиция. Не финансовая, а духовная. И я вкладываю всю душу в каждое видео, чтобы у зрителя захватило дух от просмотра."
              inline={false}
            />
          </div>
        </div>

        <div className="mt-8 flex gap-4 justify-center md:justify-start">
          <div className="p-6 -m-6 overflow-visible">
            <button 
              onClick={onContactClick}
              className="flex items-center gap-2 font-mono text-xs text-accent1 bg-accent1/20 px-3 py-1.5 rounded border border-accent1/40 hover:bg-accent1/30 transition-all cursor-pointer animate-blink md:animate-glow md:shadow-[0_0_15px_rgba(0,168,255,0.3)]"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-accent1 animate-pulse md:shadow-[0_0_8px_rgba(0,168,255,0.8)]"></span>
              <LocalizedText en="AVAILABLE FOR WORK" ru="ГОТОВ К СОТРУДНИЧЕСТВУ" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;