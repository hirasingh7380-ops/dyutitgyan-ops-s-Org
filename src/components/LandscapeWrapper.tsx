import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, RotateCw } from 'lucide-react';
import villageBg from '../assets/images/village_background_1785251927006.jpg';

interface LandscapeWrapperProps {
  children: React.ReactNode;
}

export const LandscapeWrapper: React.FC<LandscapeWrapperProps> = ({ children }) => {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const updateOrientation = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDimensions({ width: w, height: h });
      setIsPortrait(h > w);
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    // Try auto-locking orientation to landscape if supported
    const tryOrientationLock = async () => {
      try {
        const screenOrientation = (window.screen.orientation || (window.screen as unknown as { mozOrientation?: string; msOrientation?: string }));
        if (screenOrientation && 'lock' in screenOrientation) {
          await (screenOrientation as unknown as { lock: (orientation: string) => Promise<void> }).lock('landscape');
        }
      } catch {
        // Silently catch if not allowed by browser permissions
      }
    };

    tryOrientationLock();

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        try {
          const screenOrientation = (window.screen.orientation || (window.screen as unknown as { mozOrientation?: string; msOrientation?: string }));
          if (screenOrientation && 'lock' in screenOrientation) {
            (screenOrientation as unknown as { lock: (orientation: string) => Promise<void> }).lock('landscape').catch(() => {});
          }
        } catch {
          // ignore
        }
      }).catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Container that rotates 90 deg automatically on portrait screens */}
      <div
        id="landscape-viewport-container"
        style={
          isPortrait
            ? {
                width: `${dimensions.height}px`,
                height: `${dimensions.width}px`,
                position: 'absolute',
                top: `${(dimensions.height - dimensions.width) / 2}px`,
                left: `${(dimensions.width - dimensions.height) / 2}px`,
                transform: 'rotate(90deg)',
                transformOrigin: 'center center',
              }
            : {
                width: '100vw',
                height: '100vh',
                position: 'relative',
              }
        }
        className="overflow-hidden flex flex-col justify-between text-[#2C2C2C] bg-cover bg-center bg-no-repeat shadow-2xl"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url(${villageBg})` }}
        />

        {/* Floating Quick Fullscreen / Landscape Enhancer */}
        <button
          id="btn-fullscreen-toggle"
          onClick={toggleFullscreen}
          className="fixed bottom-3 right-3 z-50 p-2.5 rounded-full bg-white/90 hover:bg-[#F0EDE5] text-[#5D4037] border border-[#D8CFC4] shadow-xl text-xs font-bold backdrop-blur-xs transition-transform active:scale-90 flex items-center gap-1.5 cursor-pointer"
          title="Fullscreen Mode"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          {isPortrait && <RotateCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />}
        </button>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};