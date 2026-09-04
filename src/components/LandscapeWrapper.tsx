import React, { useState, useEffect } from 'react';
import { Smartphone, Maximize2, Minimize2 } from 'lucide-react';
import villageBg from '../assets/images/village_background_1785251927006.jpg';

interface LandscapeWrapperProps {
  children: React.ReactNode;
}

export const LandscapeWrapper: React.FC<LandscapeWrapperProps> = ({ children }) => {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window !== 'undefined') {
        const portrait = window.innerHeight > window.innerWidth;
        setIsPortrait(portrait);
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Request native landscape lock on supported mobile browsers
    try {
      const orientation = screen.orientation as ScreenOrientation & { lock?: (type: string) => Promise<void> };
      if (orientation && orientation.lock) {
        orientation.lock('landscape').catch(() => {});
      }
    } catch {
      // Ignore orientation lock rejection
    }

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div
      id="landscape-root-container"
      className="relative w-screen h-screen h-[100dvh] max-h-[100dvh] overflow-hidden bg-slate-900 select-none touch-none"
    >
      {/* Main Game Container - 1:1 Clean Coordinates Without CSS 90deg Coordinate Inversion */}
      <div
        id="landscape-inner-stage"
        className="relative w-full h-full max-h-full overflow-hidden flex flex-col justify-between text-slate-900 bg-cover bg-center bg-no-repeat pb-[env(safe-area-inset-bottom,0px)]"
        style={{ backgroundImage: `url(${villageBg})` }}
      >
        {children}

        {/* Mobile Portrait Guidance Banner */}
        {isPortrait && (
          <div
            id="mobile-portrait-banner"
            className="fixed top-2 left-1/2 -translate-x-1/2 z-50 bg-black/85 text-yellow-300 border-2 border-yellow-400 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xl animate-pulse pointer-events-none"
          >
            <Smartphone className="w-4 h-4 rotate-90 text-yellow-300" />
            <span>Rotate phone to Landscape for full view</span>
          </div>
        )}

        {/* Fullscreen Floating Toggle Button - positioned in top right corner to prevent obscuring bottom controls */}
        <button
          id="btn-fullscreen-toggle"
          onClick={toggleFullscreen}
          className="fixed top-1.5 right-1.5 sm:top-auto sm:bottom-2 sm:right-2 z-40 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-black/60 hover:bg-black/90 text-white border border-white/30 shadow-lg text-xs font-bold active:scale-95 cursor-pointer backdrop-blur-xs opacity-75 hover:opacity-100 transition-opacity"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-yellow-300" /> : <Maximize2 className="w-3.5 h-3.5 text-white" />}
        </button>
      </div>
    </div>
  );
};



