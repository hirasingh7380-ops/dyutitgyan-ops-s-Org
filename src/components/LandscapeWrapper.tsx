import React, { useState, useEffect } from 'react';
import { Smartphone, Maximize2, Minimize2 } from 'lucide-react';
import villageBg from '../assets/images/village_background_1785251927006.jpg';

interface LandscapeWrapperProps {
  children: React.ReactNode;
}

export const LandscapeWrapper: React.FC<LandscapeWrapperProps> = ({ children }) => {
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth < 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsPortraitMobile(isMobile && isPortrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
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
      id="landscape-wrapper"
      className="relative w-full h-screen overflow-hidden flex flex-col justify-between text-[#2C2C2C] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${villageBg})` }}
    >
      {/* Mobile Portrait Orientation Prompt */}
      {isPortraitMobile && (
        <div id="portrait-orientation-banner" className="fixed top-2 left-1/2 -translate-x-1/2 z-40 bg-[#8B5E3C] text-white border border-[#D8CFC4] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl animate-bounce">
          <Smartphone className="w-4 h-4 rotate-90 text-[#DDE5B6]" />
          <span>Rotate phone horizontally for best Landscape Game Experience!</span>
        </div>
      )}

      {/* Fullscreen Floating Toggle */}
      <button
        id="btn-fullscreen-toggle"
        onClick={toggleFullscreen}
        className="fixed bottom-3 right-3 z-30 p-2.5 rounded-full bg-white/90 hover:bg-[#F0EDE5] text-[#5D4037] border border-[#D8CFC4] shadow-md text-xs font-bold backdrop-blur-xs transition-transform active:scale-90"
        title="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      {children}
    </div>
  );
};

