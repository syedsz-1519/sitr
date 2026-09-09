import React from 'react';
import { Menu, User, HelpCircle } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';

export const Header: React.FC = () => {
  const { setMenuDrawerOpen, setTechnicalNoteOpen, userName } = useSitrStore();

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-[#0B0714]/90 backdrop-blur-xl border-b border-purple-900/20 px-4 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-0.5 bg-purple-500/30 rounded-xl blur-sm"></div>
            <img
              src="/sitr-logo.jpg"
              alt="SITR Royal Emblem"
              className="relative w-8 h-8 rounded-xl object-cover border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.35)]"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-lg tracking-wider text-white">SITR</span>
              <span className="font-arabic text-xl text-amber-400 font-bold leading-none select-none">
                سِتْر
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-purple-300/70 font-semibold font-metric mt-0.5">
              Guard Your Gaze
            </span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTechnicalNoteOpen(true)}
            title="SITR Architecture Note"
            className="w-7 h-7 rounded-full bg-[#170F26] border border-purple-900/40 text-purple-300/70 hover:text-white flex items-center justify-center transition-colors"
            type="button"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setMenuDrawerOpen(true)}
            aria-label="Open Navigation Drawer"
            className="w-8 h-8 rounded-full bg-[#1E1433] border border-purple-700/30 text-purple-200 hover:text-white flex items-center justify-center transition-colors active:scale-95"
            type="button"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* User Profile Avatar matching screenshot */}
          <div
            title={userName || 'Account'}
            className="w-8 h-8 rounded-full bg-[#DDD6FE] text-[#241344] flex items-center justify-center shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setMenuDrawerOpen(true)}
          >
            <User className="w-4 h-4 fill-[#241344] text-[#241344]" />
          </div>
        </div>
      </div>
    </header>
  );
};

