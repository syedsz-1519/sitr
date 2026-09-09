import React from 'react';
import {
  Shield,
  LayoutDashboard,
  CheckCircle,
  Timer,
  Heart,
  Diamond,
  Repeat,
  Moon,
  Brain,
  Award,
  Zap,
  BarChart3,
  LineChart,
  Users,
  Bell,
  Trophy,
  X,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { ExtendedView } from '../types';

interface MenuDrawerProps {
  currentView: ExtendedView;
  onSelectView: (view: ExtendedView) => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  currentView,
  onSelectView,
}) => {
  const {
    menuDrawerOpen,
    setMenuDrawerOpen,
    salahLock,
    toggleSalahLock,
    nightGuard,
    toggleNightGuard,
    setUrgentRescueOpen,
    userName,
    currentStreak,
    rules,
    customRules,
    customBlockModeEnabled,
  } = useSitrStore();

  if (!menuDrawerOpen) return null;

  const navigateTo = (view: ExtendedView) => {
    onSelectView(view);
    setMenuDrawerOpen(false);
  };

  const handleStruggling = () => {
    setMenuDrawerOpen(false);
    setUrgentRescueOpen(true, 'Self-reported urge check-in');
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={() => setMenuDrawerOpen(false)}
        className="fixed inset-0 bg-[#0B0714]/80 backdrop-blur-md transition-opacity"
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 w-[85%] max-w-[340px] bg-[#100C19] border-r border-purple-900/30 h-full flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div className="p-5 space-y-6">
          {/* Header Brand */}
          <div className="flex items-center justify-between pb-3 border-b border-purple-900/30">
            <div className="flex items-center gap-3">
              <img
                src="/sitr-logo.jpg"
                alt="SITR Royal Shield"
                className="w-10 h-10 rounded-xl object-cover border border-purple-500/40 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
              />
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-extrabold text-lg tracking-wider text-white">SITR</span>
                  <span className="font-arabic text-xl text-amber-400 leading-none select-none">سِتْر</span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-purple-300/70 font-semibold font-metric">
                  Guard Your Gaze
                </span>
              </div>
            </div>

            <button
              onClick={() => setMenuDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-[#1E1433] text-purple-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section: CORE */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-metric tracking-widest text-purple-300/60 font-semibold px-2">
              Core
            </span>

            <button
              onClick={() => navigateTo('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                currentView === 'dashboard'
                  ? 'bg-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]'
                  : 'text-purple-200/80 hover:bg-[#1E1433] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => navigateTo('custom_block_mode')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                currentView === 'custom_block_mode'
                  ? 'bg-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]'
                  : 'text-purple-200/80 hover:bg-[#1E1433] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Custom Block Mode</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-metric ${
                customBlockModeEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-purple-950/60 border border-purple-800/40 text-purple-300'
              }`}>
                {customBlockModeEnabled ? 'ACTIVE' : `${customRules.length} rules`}
              </span>
            </button>

            <button
              onClick={() => navigateTo('sessions_log')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                currentView === 'sessions_log'
                  ? 'bg-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]'
                  : 'text-purple-200/80 hover:bg-[#1E1433] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Blocked Apps</span>
              </div>
              <span className="text-[10px] bg-purple-950/60 border border-purple-800/40 text-purple-300 px-2 py-0.5 rounded-full font-metric">
                {rules.length} active
              </span>
            </button>
          </div>

          {/* Section: NAFS TOOLS */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-metric tracking-widest text-purple-300/60 font-semibold px-2">
              Nafs Tools
            </span>

            {/* Emergency Action */}
            <button
              onClick={handleStruggling}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full bg-rose-950/40 border border-rose-600/40 text-rose-300 hover:bg-rose-900/30 transition-all text-sm font-semibold shadow-[0_0_15px_rgba(225,29,72,0.15)] active:scale-98"
            >
              <Heart className="w-4 h-4 text-rose-400 fill-rose-500/40" />
              <span>I'm Struggling — Bhai, Help Karo</span>
            </button>

            <button
              onClick={() => navigateTo('dhikr_settings')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                currentView === 'dhikr_settings'
                  ? 'bg-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]'
                  : 'text-purple-200/80 hover:bg-[#1E1433] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Diamond className="w-4 h-4 text-amber-400" />
                <span>Dhikr Counter & Config</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full font-metric">
                33×
              </span>
            </button>

            <button
              onClick={() => navigateTo('ayah_reflections')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                currentView === 'ayah_reflections'
                  ? 'bg-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]'
                  : 'text-purple-200/80 hover:bg-[#1E1433] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Quranic Reflections</span>
              </div>
              <span className="text-[10px] bg-purple-950/60 border border-purple-800/40 text-purple-300 px-2 py-0.5 rounded-full font-metric">
                40 Verses
              </span>
            </button>

            <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm text-purple-200/80">
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Night Guard (11pm–5am)</span>
              </div>
              <button
                onClick={toggleNightGuard}
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-metric font-bold transition-colors ${
                  nightGuard
                    ? 'bg-purple-600/40 border border-purple-500/50 text-purple-200'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {nightGuard ? 'AUTO ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Section: INSIGHTS */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-metric tracking-widest text-purple-300/60 font-semibold px-2">
              Insights
            </span>

            <button
              onClick={() => navigateTo('nafs_score')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                currentView === 'nafs_score'
                  ? 'bg-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]'
                  : 'text-purple-200/80 hover:bg-[#1E1433] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Nafs Score</span>
              </div>
              <span className="text-xs text-purple-300 font-bold font-metric">46/100</span>
            </button>

            <button
              onClick={() => navigateTo('taqwa_streak')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                currentView === 'taqwa_streak'
                  ? 'bg-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]'
                  : 'text-purple-200/80 hover:bg-[#1E1433] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Taqwa Streak</span>
              </div>
              <span className="text-xs text-amber-300 font-bold font-metric">{currentStreak}d clean</span>
            </button>

            <button
              onClick={() => navigateTo('temptation_map')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                currentView === 'temptation_map'
                  ? 'bg-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]'
                  : 'text-purple-200/80 hover:bg-[#1E1433] hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Temptation Map</span>
            </button>

            <button
              onClick={() => navigateTo('weekly_report')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                currentView === 'weekly_report'
                  ? 'bg-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]'
                  : 'text-purple-200/80 hover:bg-[#1E1433] hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Weekly Report</span>
            </button>
          </div>

          {/* Section: GROWTH */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-metric tracking-widest text-purple-300/60 font-semibold px-2">
              Growth
            </span>

            <button
              onClick={() => navigateTo('accountability')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                currentView === 'accountability'
                  ? 'bg-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]'
                  : 'text-purple-200/80 hover:bg-[#1E1433] hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Accountability</span>
            </button>

            <button
              onClick={() => navigateTo('smart_alerts')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                currentView === 'smart_alerts'
                  ? 'bg-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]'
                  : 'text-purple-200/80 hover:bg-[#1E1433] hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4 text-purple-400" />
              <span>Smart Alerts</span>
            </button>

            <button
              onClick={() => navigateTo('challenges')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                currentView === 'challenges'
                  ? 'bg-purple-600 text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]'
                  : 'text-purple-200/80 hover:bg-[#1E1433] hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Jihad al-Nafs Challenges</span>
            </button>
          </div>

          {/* Salah Lock Toggle Card */}
          <div className="p-3.5 rounded-2xl bg-[#170F26] border border-purple-900/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300">
                <Moon className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block leading-tight">Salah Lock</span>
                <span className="text-xs text-purple-300/80 flex items-center gap-1 font-arabic">
                  {salahLock ? 'Active — مَاشَاءَ اللّٰه' : 'Inactive'}
                </span>
              </div>
            </div>

            <button
              onClick={toggleSalahLock}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${
                salahLock ? 'bg-purple-600' : 'bg-zinc-800'
              }`}
              type="button"
            >
              <span
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                  salahLock ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Founder Status Card */}
          <div className="p-4 rounded-2xl bg-[#170F26] border border-purple-900/40 flex flex-col items-center text-center">
            <span className="text-[10px] font-metric uppercase tracking-widest text-purple-300/70 mb-0.5">
              Founder Status
            </span>
            <span className="text-sm font-bold text-white">{userName}</span>
            <div className="mt-1.5 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Lifetime Shield</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
