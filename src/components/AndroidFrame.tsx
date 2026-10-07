import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  ChevronLeft,
  Circle,
  Square,
  Smartphone,
  Maximize2,
  Sparkles,
  Sun,
  Moon,
  MessageCircle,
  Bell
} from 'lucide-react';
import { useSocial, MaterialThemeColor } from '../context/SocialContext';

export const AndroidFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    usePhoneFrame,
    setUsePhoneFrame,
    androidNavType,
    setAndroidNavType,
    themeColor,
    setThemeColor,
    darkMode,
    setDarkMode,
    activeTab,
    setActiveTab,
    unreadNotificationsCount,
    unreadMessagesCount,
    setActiveChatId,
  } = useSocial();

  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBackGesture = () => {
    if (activeTab !== 'home') {
      setActiveTab('home');
      setActiveChatId(null);
    }
  };

  const themeColors: { id: MaterialThemeColor; name: string; bg: string }[] = [
    { id: 'indigo', name: 'Pixel Indigo', bg: 'bg-indigo-500' },
    { id: 'violet', name: 'Material Violet', bg: 'bg-violet-500' },
    { id: 'emerald', name: 'Forest Emerald', bg: 'bg-emerald-500' },
    { id: 'amber', name: 'Warm Amber', bg: 'bg-amber-500' },
    { id: 'cyan', name: 'Ocean Cyan', bg: 'bg-cyan-500' },
  ];

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-start ${darkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-100 text-neutral-900'} p-2 sm:p-4 transition-colors duration-300`}>
      {/* Top Device Toolbar for Prototyping Controls */}
      <header
        id="android-emulator-bar"
        className="w-full max-w-4xl mb-3 py-2 px-3 sm:px-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-neutral-200 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center font-bold text-white text-[11px]">
            A15
          </div>
          <span className="font-semibold text-neutral-200 hidden sm:inline">Android OS 15</span>
          <span className="text-neutral-500 hidden sm:inline">•</span>
          <span className="text-neutral-400">Social Network</span>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Material You Colors */}
          <div className="flex items-center gap-1 bg-neutral-800/80 px-2 py-1 rounded-full border border-neutral-700/50">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400 mr-0.5" />
            {themeColors.map(c => (
              <button
                key={c.id}
                id={`theme-color-${c.id}`}
                onClick={() => setThemeColor(c.id)}
                title={c.name}
                className={`w-3.5 h-3.5 rounded-full ${c.bg} transition-transform ${themeColor === c.id ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-neutral-900' : 'opacity-70 hover:opacity-100'}`}
              />
            ))}
          </div>

          {/* Navigation Type Toggle */}
          <button
            id="toggle-nav-type"
            onClick={() => setAndroidNavType(androidNavType === 'gesture' ? 'buttons' : 'gesture')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 transition border border-neutral-700/60 text-neutral-300"
            title="Toggle between Android Gesture Pill & 3-Button Navigation"
          >
            <span>Nav:</span>
            <span className="font-medium text-indigo-400 capitalize">{androidNavType}</span>
          </button>

          {/* Frame Toggle */}
          <button
            id="toggle-phone-frame"
            onClick={() => setUsePhoneFrame(!usePhoneFrame)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 transition border border-neutral-700/60 text-neutral-300"
            title="Toggle Android Device Frame"
          >
            {usePhoneFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{usePhoneFrame ? 'Full View' : 'Device Frame'}</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            id="toggle-dark-mode"
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 transition border border-neutral-700/60 text-neutral-300"
            title="Toggle Dark / Light Mode"
            aria-label="Toggle Dark or Light Mode"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          </button>
        </div>
      </header>

      {/* Main Container - Phone Shell or Full Mobile */}
      <div className="relative w-full flex items-center justify-center flex-1 pb-4">
        <div
          id="android-device-container"
          className={`relative overflow-hidden transition-all duration-300 flex flex-col ${
            usePhoneFrame
              ? 'w-full max-w-[430px] h-[890px] rounded-[50px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-[10px] border-neutral-800 ring-1 ring-neutral-700/50'
              : 'w-full max-w-lg h-[92vh] rounded-3xl shadow-xl border border-neutral-800'
          } ${darkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-900 text-neutral-100'}`}
        >
          {/* Side Hardware Buttons (Pure visual on phone frame) */}
          {usePhoneFrame && (
            <>
              {/* Volume Rocker */}
              <div className="absolute -left-[14px] top-28 w-[4px] h-16 bg-neutral-700 rounded-l-md" />
              {/* Power Button */}
              <div className="absolute -right-[14px] top-24 w-[4px] h-10 bg-neutral-700 rounded-r-md" />
            </>
          )}

          {/* Android Status Bar */}
          <div
            id="android-status-bar"
            className="w-full shrink-0 h-9 px-6 flex items-center justify-between text-xs font-medium text-neutral-300 select-none z-40 bg-neutral-950/80 backdrop-blur-sm"
          >
            {/* Clock & Notification icons */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-200 tracking-tight">{currentTime}</span>
              <div className="flex items-center gap-1.5 opacity-80">
                {unreadMessagesCount > 0 && (
                  <MessageCircle className="w-3 h-3 text-indigo-400 fill-indigo-400/20" />
                )}
                {unreadNotificationsCount > 0 && (
                  <Bell className="w-3 h-3 text-pink-400 fill-pink-400/20" />
                )}
              </div>
            </div>

            {/* Front Camera Punch-hole Cutout (Centered Pixel Style) */}
            <div className="w-4 h-4 rounded-full bg-neutral-950 border border-neutral-800 shadow-inner flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 ring-1 ring-blue-500/20" />
            </div>

            {/* Status indicators (5G, Wifi, Battery) */}
            <div className="flex items-center gap-2 text-neutral-300">
              <span className="text-[10px] font-bold tracking-tighter text-neutral-400">5G</span>
              <Wifi className="w-3.5 h-3.5 text-neutral-300" />
              <div className="flex items-center gap-1">
                <span className="text-[10px]">98%</span>
                <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              </div>
            </div>
          </div>

          {/* Application Screen Body */}
          <div className="relative flex-1 w-full overflow-hidden flex flex-col">
            {children}
          </div>

          {/* Android Bottom Navigation (Gesture Pill or 3-Button) */}
          <div
            id="android-system-navigation"
            className="w-full shrink-0 h-7 bg-neutral-950 flex items-center justify-center select-none z-40"
          >
            {androidNavType === 'gesture' ? (
              // Gesture Navigation Pill
              <button
                id="android-gesture-pill"
                onClick={handleBackGesture}
                title="Swipe or tap gesture bar to navigate home"
                className="w-36 h-1.5 bg-neutral-400/70 hover:bg-neutral-200 rounded-full transition-all active:scale-95"
                aria-label="Android Gesture Pill"
              />
            ) : (
              // Classic 3-Button Navigation
              <div className="flex items-center justify-around w-full max-w-xs px-6">
                {/* Back button (Triangle) */}
                <button
                  id="android-nav-back"
                  onClick={handleBackGesture}
                  className="p-1.5 text-neutral-400 hover:text-white transition active:scale-90"
                  aria-label="Back"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Home button (Circle) */}
                <button
                  id="android-nav-home"
                  onClick={() => {
                    setActiveTab('home');
                    setActiveChatId(null);
                  }}
                  className="p-1.5 text-neutral-400 hover:text-white transition active:scale-90"
                  aria-label="Home"
                >
                  <Circle className="w-3.5 h-3.5" />
                </button>

                {/* Recents button (Square) */}
                <button
                  id="android-nav-recents"
                  onClick={() => setActiveTab('explore')}
                  className="p-1.5 text-neutral-400 hover:text-white transition active:scale-90"
                  aria-label="Recent Apps"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
