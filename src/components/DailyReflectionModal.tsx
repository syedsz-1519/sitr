import React from 'react';
import { X } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { MuhasabahJournal } from './MuhasabahJournal';

export const DailyReflectionModal: React.FC = () => {
  const { dailyReflectionModalOpen, setDailyReflectionModalOpen } = useSitrStore();

  if (!dailyReflectionModalOpen) return null;

  return (
    <div
      id="muhasabah-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setDailyReflectionModalOpen(false);
        }
      }}
    >
      <div className="relative w-full max-w-2xl my-6 sm:my-10 animate-scaleUp">
        {/* Close Button */}
        <button
          type="button"
          id="close-muhasabah-modal-btn"
          onClick={() => setDailyReflectionModalOpen(false)}
          className="absolute -top-3 -right-3 z-30 w-8 h-8 rounded-full bg-[#061D14] border border-amber-500/50 text-amber-300 hover:text-white flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-transform hover:scale-110 cursor-pointer"
          aria-label="Close Daily Reflection Modal"
        >
          <X className="w-4 h-4" />
        </button>

        <MuhasabahJournal onEntrySaved={() => setDailyReflectionModalOpen(false)} />
      </div>
    </div>
  );
};
