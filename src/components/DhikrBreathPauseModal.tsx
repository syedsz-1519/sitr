import React from 'react';
import { X, ArrowLeft, Wind, Sparkles } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { DhikrBreathPause } from './DhikrBreathPause';

export const DhikrBreathPauseModal: React.FC = () => {
  const { breathPauseModalOpen, setBreathPauseModalOpen } = useSitrStore();

  if (!breathPauseModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#04140E]/95 backdrop-blur-2xl flex flex-col overflow-y-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-[#04140E]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBreathPauseModalOpen(false)}
            aria-label="Back to App"
            className="w-10 h-10 rounded-full bg-[#061D14] text-amber-300 hover:text-white flex items-center justify-center transition-colors border border-amber-500/20 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-amber-50 leading-tight">Dhikr Breath Pause</h1>
            <span className="text-[10px] uppercase font-metric tracking-widest text-amber-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              SITR 30s Mindful Reset
            </span>
          </div>
        </div>

        <button
          onClick={() => setBreathPauseModalOpen(false)}
          className="w-9 h-9 rounded-full bg-[#061D14] text-amber-300 hover:text-white flex items-center justify-center transition-colors border border-amber-500/20 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-md mx-auto w-full px-4 py-6 flex-1 flex flex-col justify-center">
        <DhikrBreathPause
          onClose={() => setBreathPauseModalOpen(false)}
          standalone={false}
        />
      </div>
    </div>
  );
};
