import React from 'react';

const telegramQr = new URL('./qr/telegram.svg', import.meta.url).href;
const twitterQr = new URL('./qr/twitter.svg', import.meta.url).href;
const instagramQr = new URL('./qr/instagram.svg', import.meta.url).href;

const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"/></svg>
);

const SocialCard = ({ name, url, delay, imgSrc, icon }: { name: string, url: string, delay: number, imgSrc: string, icon: React.ReactNode }) => (
  <div 
    className="flex flex-col items-center gap-4 animate-slide-up"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
  >
    <div className="hidden md:block w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border border-white/10 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,112,187,0.3)] hover:border-accent1/50 bg-white/5 p-3">
      <img 
        src={imgSrc}
        alt={`${name} QR`}
        className="w-full h-full object-cover p-2 bg-white rounded-lg"
      />
    </div>
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent1/50 text-slate-200 font-mono text-sm uppercase tracking-widest rounded-md transition-all duration-300 hover:text-white group flex items-center gap-2"
    >
      {name}
      <span className="text-slate-400 group-hover:text-white transition-colors">{icon}</span>
    </a>
  </div>
);

const ContactSection: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      {/* Copyright */}
      <div className="absolute top-0 right-0 p-6 z-20 pointer-events-none">
        <span className="font-mono text-[10px] text-slate-500/70 tracking-widest uppercase hidden sm:block text-right">
          © Fare 2026. All rights reserved.
        </span>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-heading text-white mb-2">Ready to update your videos?</h2>
        <p className="text-slate-400 font-mono text-sm hidden md:block">So go ahead, scan and let's get started.</p>
        <p className="text-slate-400 font-mono text-sm md:hidden">Or you can click on the buttons</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-24 mb-16">
        <SocialCard name="Telegram" url="https://t.me/fareeditor" delay={100} imgSrc={telegramQr} icon={<TelegramIcon />} />
        <SocialCard name="X (Twitter)" url="https://x.com/FareEditor" delay={200} imgSrc={twitterQr} icon={<XIcon />} />
        <SocialCard name="Instagram" url="https://www.instagram.com/fareeditor/" delay={300} imgSrc={instagramQr} icon={<InstagramIcon />} />
      </div>

      <a 
        href="https://t.me/fare_tgc" 
        target="_blank" 
        rel="noopener noreferrer"
        className="relative inline-block group px-8 py-4 bg-gradient-to-r from-accent1 to-accent2 rounded-lg font-heading text-white shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
        <span className="relative z-10 flex items-center gap-2">
          Join My Community
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </span>
      </a>
    </div>
  );
};

export default ContactSection;