import React, { useState, useEffect, useCallback } from 'react';
import { RotateCw, Maximize2, Minimize2 } from 'lucide-react';
import villageBg from '../assets/images/village_background_1785251927006.jpg';

interface LandscapeWrapperProps {
  children: React.ReactNode;
}

export const LandscapeWrapper: React.FC<LandscapeWrapperProps> = ({ children }) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600,
  });
  const [forceLandscapeRotate, setForceLandscapeRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const updateDimensions = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    // Try to lock orientation to landscape if supported by browser/Android
    try {
      const orientation = screen.orientation as ScreenOrientation & { lock?: (type: string) => Promise<void> };
      if (orientation && orientation.lock) {
        orientation.lock('landscape').catch(() => {
          // Ignore if user interaction is needed or not allowed in iframe
        });
      }
    } catch {
      // Ignore orientation lock errors
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, [updateDimensions]);

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

  const isPortrait = windowSize.height > windowSize.width;
  const shouldRotate = isPortrait && forceLandscapeRotate;

  return (
    <div
      id="landscape-root-container"
      className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none touch-none"
    >
      {/* Inner Game Container with Auto-Landscape for Portrait Viewports */}
      <div
        id="landscape-inner-stage"
        className="overflow-hidden flex flex-col justify-between text-slate-900 bg-cover bg-center bg-no-repeat transition-all duration-300"
        style={
          shouldRotate
            ? {
                position: 'absolute',
                width: `${windowSize.height}px`,
                height: `${windowSize.width}px`,
                left: `${windowSize.width}px`,
                top: 0,
                transformOrigin: '0 0',
                transform: 'rotate(90deg)',
                backgroundImage: `url(${villageBg})`,
              }
            : {
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundImage: `url(${villageBg})`,
              }
        }
      >
        {children}

        {/* Floating Controls (Orientation Switch & Fullscreen) */}
        <div className="fixed bottom-2 right-2 z-50 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
          {isPortrait && (
            <button
              id="btn-toggle-landscape-orientation"
              onClick={() => setForceLandscapeRotate((prev) => !prev)}
              className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-yellow-300 border border-white/30 shadow-lg text-[11px] font-bold flex items-center gap-1 active:scale-95 cursor-pointer backdrop-blur-xs"
              title="Toggle Landscape Rotation"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{forceLandscapeRotate ? 'Landscape ON' : 'Normal'}</span>
            </button>
          )}

          <button
            id="btn-fullscreen-toggle"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white border border-white/30 shadow-lg text-xs font-bold active:scale-95 cursor-pointer backdrop-blur-xs"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-yellow-300" /> : <Maximize2 className="w-3.5 h-3.5 text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
};


