import React from 'react';
import { Menu, HelpCircle } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { SitrLogo } from './SitrLogo';

export const Header: React.FC = () => {
  const { setMenuDrawerOpen, setTechnicalNoteOpen } = useSitrStore();

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-[#04140E]/95 backdrop-blur-xl border-b border-amber-500/20 px-4 py-2.5 shadow-sm shadow-emerald-950/40">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5">
          <SitrLogo size="md" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-lg tracking-wider text-amber-50">SITR</span>
              <span className="font-arabic text-2xl text-amber-400 font-bold leading-none select-none drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                سِتْر
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-300/80 font-semibold font-metric mt-0.5">
              Guard Your Gaze
            </span>
          </div>
        </div>

        {/* Right Action Icons: Help + 3 Lines Menu Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTechnicalNoteOpen(true)}
            title="SITR Architecture Note"
            className="w-7 h-7 rounded-full bg-[#082318] border border-amber-500/25 text-emerald-300/80 hover:text-amber-300 flex items-center justify-center transition-colors"
            type="button"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setMenuDrawerOpen(true)}
            aria-label="Open Navigation Drawer"
            className="w-8 h-8 rounded-full bg-[#0E3525] border border-amber-500/35 text-amber-200 hover:text-white flex items-center justify-center transition-colors active:scale-95 shadow-sm shadow-emerald-950/60"
            type="button"
          >
            <Menu className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </header>
  );
};

