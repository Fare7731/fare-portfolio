import React, { useState, useEffect } from 'react';
import { 
  TerminalIcon, 
  CpuIcon, 
  WifiIcon, 
  BatteryIcon, 
  LargeBatteryIcon, 
  PieChartIcon, 
  SunIcon,
  WifiSignalIcon,
  CheckIcon,
  SolidLockIcon
} from './Icons';

interface TopPanelProps {
  activeWorkspace: number;
  onWorkspaceChange: (ws: number) => void;
  onOpenTerminal?: () => void;
}

type WidgetType = 'calendar' | 'system' | 'wifi' | 'battery' | null;

const TopPanel: React.FC<TopPanelProps> = ({ activeWorkspace, onWorkspaceChange, onOpenTerminal }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  
  const [activeWidget, setActiveWidget] = useState<WidgetType>(null);
  const [renderedWidget, setRenderedWidget] = useState<WidgetType>(null);
  const [isWidgetClosing, setIsWidgetClosing] = useState(false);

  // System status simulation states
  const [cpuUsage, setCpuUsage] = useState(14);
  const [ramUsage, setRamUsage] = useState(3.2);
  const batteryLevel = 86; // Static for presentation
  const brightnessLevel = 45; // Static for presentation
  const [isWifiOn, setIsWifiOn] = useState(true);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate CPU and RAM fluctuations
  useEffect(() => {
    const sysTimer = setInterval(() => {
      // CPU: fluctuate between 8% and 25%
      setCpuUsage(Math.floor(Math.random() * 18) + 8);
      
      // RAM: fluctuate by ~0.5GB around a base of 3.2GB (2.7G to 3.7G)
      const newRam = 3.2 + (Math.random() * 1.0 - 0.5);
      setRamUsage(+(newRam.toFixed(1)));
    }, 2500);
    return () => clearInterval(sysTimer);
  }, []);

  // Handle widget closing animation state
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (activeWidget === renderedWidget) {
      return; 
    }

    if (renderedWidget !== null) {
      setIsWidgetClosing(true);
      timeoutId = setTimeout(() => {
        setRenderedWidget(activeWidget);
        setIsWidgetClosing(false);
      }, 150); 
    } else {
      setRenderedWidget(activeWidget);
      setIsWidgetClosing(false);
      // Reset calendar view to current month when opening
      if (activeWidget === 'calendar') {
        setCalendarDate(new Date());
      }
    }

    return () => clearTimeout(timeoutId);
  }, [activeWidget, renderedWidget]);

  // Handle clicking outside widgets
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((event.target as Element).closest('.widget-container')) {
        return;
      }
      setActiveWidget(null);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleWidget = (widget: WidgetType) => {
    setActiveWidget(prev => prev === widget ? null : widget);
  };

  // Clock variables
  const topBarTime = currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const topBarDate = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  
  const hours = currentTime.getHours() % 12 || 12;
  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = currentTime.getMinutes().toString().padStart(2, '0');
  const ampm = currentTime.getHours() >= 12 ? 'PM' : 'AM';
  const weekday = currentTime.toLocaleDateString('en-US', { weekday: 'long' });

  // Calendar logic
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const monthName = calendarDate.toLocaleDateString('en-US', { month: 'long' });
  
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  
  const daysArray = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarDate(new Date(calYear, calMonth - 1, 1));
  };
  
  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarDate(new Date(calYear, calMonth + 1, 1));
  };
  
  const prevYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarDate(new Date(calYear - 1, calMonth, 1));
  };
  
  const nextYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarDate(new Date(calYear + 1, calMonth, 1));
  };

  // Wi-Fi mock data
  const wifiNetworks = [
    { name: 'OnePlus Nord 5', strength: 5, connected: true },
    { name: 'Xiaomi Pad 7', strength: 4, connected: false },
    { name: 'iPhone (Fare)', strength: 2, connected: false },
    { name: 'Arch my beloved', strength: 1, connected: false },
    { name: 'Windows Haram', strength: 1, connected: false },
  ];

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden w-full h-8 bg-windowBg/90 backdrop-blur-md border-b border-white/10 flex items-center justify-center px-4 text-xs font-mono select-none z-50 relative shadow-sm">
        <div className="relative widget-container">
          <div 
            className={`flex items-center space-x-2 font-bold cursor-pointer px-3 py-1 rounded-md transition-colors ${activeWidget === 'calendar' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-slate-200'}`}
            onClick={() => toggleWidget('calendar')}
          >
            <span>{topBarDate}</span>
            <span className="text-accent1">{topBarTime}</span>
          </div>

          {renderedWidget === 'calendar' && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50">
              <div className={`w-[340px] bg-[#2D323E]/95 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] cursor-default origin-top ${isWidgetClosing ? 'animate-widget-out' : 'animate-widget-in'}`}>
                
                {/* Top: Clock Section */}
                <div className="flex justify-between items-stretch px-6 pt-6 pb-4">
                  <div className="flex items-baseline font-mono font-bold tracking-tighter">
                    <span className="text-[64px] text-[#8AB9F1] leading-[0.8]">{paddedHours}</span>
                    <span className="text-[42px] text-[#8AB9F1] leading-[0.8] ml-1.5 opacity-90">{paddedMinutes}</span>
                  </div>
                  <div className="flex flex-col justify-between items-end py-1">
                    <span className="text-[22px] font-mono font-bold text-[#A3BE8C] leading-none tracking-wide">{ampm}</span>
                    <span className="text-[15px] font-mono text-[#EBCB8B] leading-none mb-1">{weekday}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="px-6">
                  <div className="w-full h-px bg-white/10"></div>
                </div>

                {/* Bottom: Calendar Section */}
                <div className="px-6 py-5">
                  {/* Calendar Header */}
                  <div className="flex justify-between items-center text-[#8AB9F1] font-mono text-sm mb-5 px-1 font-bold">
                    <div className="flex items-center gap-2">
                      <button onClick={prevMonth} className="px-1 hover:text-white transition-colors cursor-pointer">&lt;</button>
                      <span className="w-20 text-center">{monthName}</span>
                      <button onClick={nextMonth} className="px-1 hover:text-white transition-colors cursor-pointer">&gt;</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={prevYear} className="px-1 hover:text-white transition-colors cursor-pointer">&lt;</button>
                      <span className="w-10 text-center">{calYear}</span>
                      <button onClick={nextYear} className="px-1 hover:text-white transition-colors cursor-pointer">&gt;</button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center text-xs font-mono">
                    {/* Days of Week */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="text-slate-400 mb-1">{d}</div>
                    ))}
                    
                    {/* Dates */}
                    {daysArray.map((day, i) => {
                      if (!day) return <div key={`empty-${i}`} />;
                      
                      const isToday = day === currentTime.getDate() && 
                                      calMonth === currentTime.getMonth() && 
                                      calYear === currentTime.getFullYear();
                                      
                      return (
                        <div 
                          key={day} 
                          className={`w-7 h-7 mx-auto flex items-center justify-center rounded-md transition-colors ${
                            isToday 
                              ? 'bg-[#8AB9F1]/20 text-[#8AB9F1] font-bold border border-[#8AB9F1]/30' 
                              : 'text-slate-200 hover:bg-white/10 cursor-pointer'
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex w-full h-8 bg-windowBg/90 backdrop-blur-md border-b border-white/10 items-center justify-between px-4 text-xs font-mono select-none z-50 relative shadow-sm">
      {/* Left side: Workspaces */}
      <div className="flex items-center space-x-3 text-slate-400">
        <div className="flex space-x-1">
          {[1, 2, 3].map((ws) => (
            <span
              key={ws}
              onClick={() => onWorkspaceChange(ws)}
              className={`w-5 h-5 rounded-sm flex items-center justify-center cursor-pointer transition-colors ${
                activeWorkspace === ws
                  ? 'bg-accent1 text-white font-bold'
                  : 'hover:bg-white/10'
              }`}
            >
              {ws}
            </span>
          ))}
        </div>
        <div className="h-3 w-px bg-white/20 mx-2"></div>
        {/* EASTER EGG TRIGGER */}
        <div 
          className="flex items-center space-x-1 text-accent1 cursor-pointer hover:text-white transition-colors group px-2 py-1 rounded hover:bg-white/5"
          onClick={onOpenTerminal}
          title="Open Terminal (Easter Egg)"
        >
          <TerminalIcon className="w-3 h-3 group-hover:scale-110 transition-transform" />
          <span>FareOS</span>
        </div>
      </div>

      {/* Center: Time/Date */}
      <div className="absolute left-1/2 -translate-x-1/2 h-full flex items-center widget-container z-50">
        <div 
          className={`flex items-center space-x-2 font-bold cursor-pointer px-3 py-1 rounded-md transition-colors ${activeWidget === 'calendar' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-slate-200'}`}
          onClick={() => toggleWidget('calendar')}
        >
          <span>{topBarDate}</span>
          <span className="text-accent1">{topBarTime}</span>
        </div>

        {/* Combined Clock & Calendar Widget */}
        {renderedWidget === 'calendar' && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2">
            <div className={`w-[340px] bg-[#2D323E]/95 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] cursor-default origin-top ${isWidgetClosing ? 'animate-widget-out' : 'animate-widget-in'}`}>
              
              {/* Top: Clock Section */}
              <div className="flex justify-between items-stretch px-6 pt-6 pb-4">
                <div className="flex items-baseline font-mono font-bold tracking-tighter">
                  <span className="text-[64px] text-[#8AB9F1] leading-[0.8]">{paddedHours}</span>
                  <span className="text-[42px] text-[#8AB9F1] leading-[0.8] ml-1.5 opacity-90">{paddedMinutes}</span>
                </div>
                <div className="flex flex-col justify-between items-end py-1">
                  <span className="text-[22px] font-mono font-bold text-[#A3BE8C] leading-none tracking-wide">{ampm}</span>
                  <span className="text-[15px] font-mono text-[#EBCB8B] leading-none mb-1">{weekday}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="px-6">
                <div className="w-full h-px bg-white/10"></div>
              </div>

              {/* Bottom: Calendar Section */}
              <div className="px-6 py-5">
                {/* Calendar Header */}
                <div className="flex justify-between items-center text-[#8AB9F1] font-mono text-sm mb-5 px-1 font-bold">
                  <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="px-1 hover:text-white transition-colors cursor-pointer">&lt;</button>
                    <span className="w-20 text-center">{monthName}</span>
                    <button onClick={nextMonth} className="px-1 hover:text-white transition-colors cursor-pointer">&gt;</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={prevYear} className="px-1 hover:text-white transition-colors cursor-pointer">&lt;</button>
                    <span className="w-10 text-center">{calYear}</span>
                    <button onClick={nextYear} className="px-1 hover:text-white transition-colors cursor-pointer">&gt;</button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center text-xs font-mono">
                  {/* Days of Week */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-slate-400 mb-1">{d}</div>
                  ))}
                  
                  {/* Dates */}
                  {daysArray.map((day, i) => {
                    if (!day) return <div key={`empty-${i}`} />;
                    
                    const isToday = day === currentTime.getDate() && 
                                    calMonth === currentTime.getMonth() && 
                                    calYear === currentTime.getFullYear();
                                    
                    return (
                      <div 
                        key={day} 
                        className={`w-7 h-7 mx-auto flex items-center justify-center rounded-md transition-colors ${
                          isToday 
                            ? 'bg-[#8AB9F1]/20 text-[#8AB9F1] font-bold border border-[#8AB9F1]/30' 
                            : 'text-slate-200 hover:bg-white/10 cursor-pointer'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Right side: Status mock */}
      <div className="flex items-center space-x-1 text-slate-400 h-full">
        
        {/* System Widget Trigger (Combined CPU/RAM) */}
        <div className="relative flex items-center h-full widget-container">
          <div 
            className={`flex items-center space-x-3 cursor-pointer px-2 py-1 rounded-md transition-colors ${activeWidget === 'system' ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-slate-200'}`}
            onClick={() => toggleWidget('system')}
          >
            <div className="flex items-center space-x-1 min-w-[40px]">
              <CpuIcon className="w-3.5 h-3.5" />
              <span>{cpuUsage}%</span>
            </div>
            <div className="flex items-center space-x-1 min-w-[50px]">
              <span className="text-[10px]">RAM</span>
              <span>{ramUsage.toFixed(1)}G</span>
            </div>
          </div>

          {/* System Overlay Widget (CPU, RAM, Brightness, Battery bars) */}
          {renderedWidget === 'system' && (
            <div className="absolute top-10 right-0 z-50">
              <div className={`w-[280px] bg-[#2D323E]/95 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] p-6 cursor-default origin-top-right ${isWidgetClosing ? 'animate-widget-out' : 'animate-widget-in'}`}>
                <div className="flex flex-col gap-6">
                  
                  {/* CPU Bar */}
                  <div className="flex items-center gap-4">
                    <CpuIcon className="w-[22px] h-[22px] text-[#C66B6D] shrink-0" />
                    <div className="flex-1 h-[18px] bg-[#1E222A]/80 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-[#C66B6D] rounded-full transition-all duration-700 ease-out" style={{ width: `${cpuUsage}%` }} />
                    </div>
                  </div>

                  {/* RAM Bar */}
                  <div className="flex items-center gap-4">
                    <PieChartIcon className="w-[22px] h-[22px] text-[#A3BE8C] shrink-0" />
                    <div className="flex-1 h-[18px] bg-[#1E222A]/80 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-[#A3BE8C] rounded-full transition-all duration-700 ease-out" style={{ width: `${(ramUsage / 16) * 100}%` }} />
                    </div>
                  </div>

                  {/* Brightness Bar */}
                  <div className="flex items-center gap-4">
                    <SunIcon className="w-[22px] h-[22px] text-[#EBCB8B] shrink-0" />
                    <div className="flex-1 h-[18px] bg-[#1E222A]/80 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-[#EBCB8B] rounded-full transition-all duration-300" style={{ width: `${brightnessLevel}%` }} />
                    </div>
                  </div>

                  {/* Battery Bar */}
                  <div className="flex items-center gap-4">
                    <BatteryIcon className="w-[22px] h-[22px] text-[#8AB9F1] shrink-0" />
                    <div className="flex-1 h-[18px] bg-[#1E222A]/80 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-[#8AB9F1] rounded-full transition-all duration-300" style={{ width: `${batteryLevel}%` }} />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-3 w-px bg-white/20 mx-1"></div>

        {/* WiFi Widget Trigger */}
        <div className="relative flex items-center h-full widget-container">
          <div 
            className={`flex items-center cursor-pointer px-2 py-1 rounded-md transition-colors ${activeWidget === 'wifi' ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-slate-200'}`}
            onClick={() => toggleWidget('wifi')}
          >
            <WifiIcon className={`w-3.5 h-3.5 transition-opacity duration-300 ${isWifiOn ? 'opacity-100' : 'opacity-40'}`} />
          </div>

          {/* WiFi Widget */}
          {renderedWidget === 'wifi' && (
            <div className="absolute top-10 right-0 z-50">
              <div className={`w-[360px] bg-[#2D323E]/95 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] p-5 cursor-default origin-top-right ${isWidgetClosing ? 'animate-widget-out' : 'animate-widget-in'}`}>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-white font-heading font-bold text-[17px]">Wi-Fi</span>
                  {/* Toggle */}
                  <div 
                    className={`w-11 h-6 rounded-full flex items-center p-0.5 cursor-pointer transition-colors duration-300 ${isWifiOn ? 'bg-slate-200' : 'bg-white/20'}`}
                    onClick={() => setIsWifiOn(!isWifiOn)}
                  >
                    <div className={`w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ${isWifiOn ? 'translate-x-5 bg-[#2D323E]' : 'translate-x-0 bg-slate-300'}`}></div>
                  </div>
                </div>
                
                <div className="w-full h-px bg-white/10 mb-4"></div>

                {/* Subheader */}
                <div className={`flex items-center justify-between mb-3 px-1 transition-opacity duration-300 ${isWifiOn ? 'opacity-100' : 'opacity-30'}`}>
                  <span className="text-white font-heading text-sm font-semibold tracking-wide">Wi-Fi Networks</span>
                  <span className={`font-text text-sm transition-colors ${isWifiOn ? 'text-slate-400 hover:text-white cursor-pointer' : 'text-slate-500 cursor-default pointer-events-none'}`}>Refresh</span>
                </div>

                {/* Network List */}
                <div className="relative min-h-[220px]">
                  {isWifiOn ? (
                    <div className="flex flex-col gap-1.5 font-text animate-fade-in">
                      {wifiNetworks.map((network, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer p-2.5 pl-4">
                          
                          {/* Left Area (Icon + Name) */}
                          <div className="flex items-center gap-3">
                            <WifiSignalIcon level={network.strength} className="w-[18px] h-[18px] text-slate-300" />
                            <span className={`text-[15px] ${network.connected ? 'text-white' : 'text-slate-300'}`}>
                              {network.name}
                            </span>
                          </div>
                          
                          {/* Right Area (Status) */}
                          <div className="flex items-center gap-3 pr-2">
                            {network.connected ? (
                              <CheckIcon className="w-[18px] h-[18px] text-slate-400" />
                            ) : (
                              <SolidLockIcon className="w-[15px] h-[15px] text-slate-400" />
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
                      <span className="text-slate-400 font-text text-[15px]">Wi-Fi is turned off</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Battery Widget Trigger */}
        <div className="relative flex items-center h-full widget-container">
          <div 
            className={`flex items-center space-x-1 cursor-pointer px-2 py-1 rounded-md transition-colors ${activeWidget === 'battery' ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-slate-200'}`}
            onClick={() => toggleWidget('battery')}
          >
            <span>{batteryLevel}%</span>
            <BatteryIcon className="w-4 h-4" />
          </div>

          {/* Battery Widget */}
          {renderedWidget === 'battery' && (
            <div className="absolute top-10 right-0 z-50">
              <div className={`bg-[#2D323E]/95 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] px-6 py-5 flex items-center gap-6 cursor-default origin-top-right ${isWidgetClosing ? 'animate-widget-out' : 'animate-widget-in'}`}>
                <LargeBatteryIcon className="w-14 h-14 text-[#B890B3] shrink-0" />
                <div className="flex flex-col whitespace-nowrap text-left">
                  <span className="text-[28px] font-mono font-bold text-slate-100 leading-none">9 hours</span>
                  <span className="text-[20px] font-mono text-slate-200 leading-none mt-2">55 minutes</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default TopPanel;