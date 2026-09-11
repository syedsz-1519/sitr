import React from 'react';
import { Shield, CircleDot, TrendingUp, BookOpen } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#04140E]/95 backdrop-blur-xl border-t border-amber-500/20 px-6 py-2 pb-5 max-w-md mx-auto shadow-lg shadow-emerald-950/80">
      <div className="flex items-center justify-around">
        {/* Shield Tab */}
        <button
          onClick={() => onTabChange('shield')}
          className={`flex flex-col items-center gap-1 transition-all min-w-[50px] relative ${
            activeTab === 'shield' ? 'text-amber-300 font-semibold' : 'text-emerald-200/50 hover:text-emerald-100'
          }`}
          type="button"
        >
          {activeTab === 'shield' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute -top-1 shadow-[0_0_8px_#F59E0B]"></span>
          )}
          <Shield className={`w-5 h-5 ${activeTab === 'shield' ? 'text-amber-300 stroke-[2.4]' : 'stroke-2'}`} />
          <span className="text-[10px] uppercase font-metric tracking-wider">Shield</span>
        </button>

        {/* Dhikr Tab */}
        <button
          onClick={() => onTabChange('dhikr')}
          className={`flex flex-col items-center gap-1 transition-all min-w-[50px] relative ${
            activeTab === 'dhikr' ? 'text-amber-300 font-semibold' : 'text-emerald-200/50 hover:text-emerald-100'
          }`}
          type="button"
        >
          {activeTab === 'dhikr' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute -top-1 shadow-[0_0_8px_#F59E0B]"></span>
          )}
          <CircleDot className={`w-5 h-5 ${activeTab === 'dhikr' ? 'text-amber-300 stroke-[2.4]' : 'stroke-2'}`} />
          <span className="text-[10px] uppercase font-metric tracking-wider">Dhikr</span>
        </button>

        {/* Taqwa Tab */}
        <button
          onClick={() => onTabChange('taqwa')}
          className={`flex flex-col items-center gap-1 transition-all min-w-[50px] relative ${
            activeTab === 'taqwa' ? 'text-amber-300 font-semibold' : 'text-emerald-200/50 hover:text-emerald-100'
          }`}
          type="button"
        >
          {activeTab === 'taqwa' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute -top-1 shadow-[0_0_8px_#F59E0B]"></span>
          )}
          <TrendingUp className={`w-5 h-5 ${activeTab === 'taqwa' ? 'text-amber-300 stroke-[2.4]' : 'stroke-2'}`} />
          <span className="text-[10px] uppercase font-metric tracking-wider">Taqwa</span>
        </button>

        {/* Ayah Tab */}
        <button
          onClick={() => onTabChange('ayah')}
          className={`flex flex-col items-center gap-1 transition-all min-w-[50px] relative ${
            activeTab === 'ayah' ? 'text-amber-300 font-semibold' : 'text-emerald-200/50 hover:text-emerald-100'
          }`}
          type="button"
        >
          {activeTab === 'ayah' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute -top-1 shadow-[0_0_8px_#F59E0B]"></span>
          )}
          <BookOpen className={`w-5 h-5 ${activeTab === 'ayah' ? 'text-amber-300 stroke-[2.4]' : 'stroke-2'}`} />
          <span className="text-[10px] uppercase font-metric tracking-wider">Ayah</span>
        </button>
      </div>
    </nav>
  );
};
