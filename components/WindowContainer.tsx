import React, { ReactNode, useState, useEffect, useLayoutEffect, useRef } from 'react';

interface WindowContainerProps {
  children: ReactNode;
  title: string;
  onClose: () => void;
  isClosing?: boolean;
  resizable?: boolean;
  initialHeight?: string;
}

const WindowContainer: React.FC<WindowContainerProps> = ({ children, title, onClose, isClosing = false, resizable = false, initialHeight = '65vh' }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState<string | number>(initialHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Track initial mouse/touch positions and window offset
  const dragStart = useRef({ mouseX: 0, mouseY: 0, windowX: 0, windowY: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle position resetting cleanly before the browser paints
  useLayoutEffect(() => {
    if (isClosing) {
      // If it starts closing, just cancel dragging but keep it exactly where it was dragged
      setIsDragging(false);
      setIsResizing(false);
    } else {
      // Once it finishes closing and re-opens (or initially mounts), abruptly center it
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
      setIsResizing(false);
      setHeight(initialHeight);
    }
  }, [title, isClosing, initialHeight]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (isMobile) return;

      if (isDragging) {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  
        const deltaX = clientX - dragStart.current.mouseX;
        const deltaY = clientY - dragStart.current.mouseY;
  
        setPosition({
          x: dragStart.current.windowX + deltaX,
          y: dragStart.current.windowY + deltaY,
        });
      } else if (isResizing) {
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const deltaY = clientY - dragStart.current.mouseY;
        const newHeight = Math.max(40, dragStart.current.height + deltaY); // Min height 40px (header height)
        setHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, isResizing, isMobile]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isMobile) return;

    // Prevent dragging if interacting with the window control buttons
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'button' || (e.target as HTMLElement).closest('button')) {
      return;
    }

    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragStart.current = {
      ...dragStart.current,
      mouseX: clientX,
      mouseY: clientY,
      windowX: position.x,
      windowY: position.y,
    };
  };

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isMobile) return;
    e.stopPropagation();
    setIsResizing(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStart.current = {
      ...dragStart.current,
      mouseY: clientY,
      height: containerRef.current?.offsetHeight || 0,
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`
        ${isMobile ? 'fixed inset-x-0 bottom-0 top-8 z-50' : 'w-full max-w-7xl mx-auto relative'}
        ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}
        pointer-events-auto
      `}
      style={!isMobile ? { height: typeof height === 'number' ? `${height}px` : height } : undefined}
    >
      <div 
        className={`
          w-full h-full bg-windowBg/90 backdrop-blur-xl flex flex-col overflow-hidden relative
          ${isMobile ? 'rounded-none border-t border-white/10' : 'rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'}
          ${isDragging ? 'shadow-[0_30px_80px_-10px_rgba(0,0,0,0.8)]' : ''} 
          ${(isDragging || isResizing) ? 'select-none' : ''}
        `}
        style={!isMobile ? { 
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: (isDragging || isResizing) ? 'none' : 'box-shadow 0.2s ease-in-out'
        } : undefined}
      >
        {/* Window Title Bar - Drag Handle */}
        <div 
          className={`
            h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 shrink-0 select-none
            ${!isMobile ? 'cursor-grab active:cursor-grabbing' : ''}
          `}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="flex space-x-2">
            {/* Hooked up onClose to the red close button */}
            <button 
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 shadow-inner flex items-center justify-center group transition-colors focus:outline-none cursor-pointer"
              title="Close Window"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold leading-none select-none pointer-events-none">×</span>
            </button>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer shadow-inner"></div>
          </div>
          <div className="font-mono text-xs text-slate-400 tracking-wider">
            {title}
          </div>
          <div className="w-16"></div> {/* Spacer to balance title */}
        </div>
        
        {/* Window Content */}
        <div className={`flex-1 overflow-hidden relative p-6 ${(isDragging || isResizing) ? 'pointer-events-none select-none' : ''}`}>
          {children}
        </div>

        {/* Resize Handle */}
        {resizable && (
          <div 
            className="h-4 w-full absolute bottom-0 left-0 cursor-s-resize flex items-center justify-center group hover:bg-white/5 transition-colors z-50"
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
          >
            <div className="w-12 h-1 bg-white/10 rounded-full group-hover:bg-white/30 transition-colors"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WindowContainer;