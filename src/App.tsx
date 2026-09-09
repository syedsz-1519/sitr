/**
 * SITR — Guard Your Gaze (سِتْر)
 * Islamic Digital Wellbeing & Distraction Blocker Companion App
 */

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MenuDrawer } from './components/MenuDrawer';
import { UrgentRescueModal } from './components/UrgentRescueModal';
import { TechnicalNoteModal } from './components/TechnicalNoteModal';

import { HomeDashboard } from './views/HomeDashboard';
import { DhikrSanctuaryView } from './views/DhikrSanctuaryView';
import { TaqwaStreakView } from './views/TaqwaStreakView';
import { AyahReflectionView } from './views/AyahReflectionView';
import { NafsScoreView } from './views/NafsScoreView';
import { TemptationMapView } from './views/TemptationMapView';
import { WeeklyReportView } from './views/WeeklyReportView';
import { AccountabilityView } from './views/AccountabilityView';
import { SmartAlertsView } from './views/SmartAlertsView';
import { SessionsLogView } from './views/SessionsLogView';
import { ChallengesView } from './views/ChallengesView';
import { CustomBlockModeView } from './views/CustomBlockModeView';

import { NavTab, ExtendedView } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('shield');
  const [currentExtendedView, setCurrentExtendedView] = useState<ExtendedView | null>(null);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    setCurrentExtendedView(null);
  };

  const handleSelectExtendedView = (view: ExtendedView) => {
    if (view === 'dashboard') {
      setActiveTab('shield');
      setCurrentExtendedView(null);
    } else {
      setCurrentExtendedView(view);
    }
  };

  const renderContent = () => {
    if (currentExtendedView) {
      switch (currentExtendedView) {
        case 'custom_block_mode':
          return <CustomBlockModeView />;
        case 'nafs_score':
          return <NafsScoreView />;
        case 'taqwa_streak':
          return <TaqwaStreakView />;
        case 'temptation_map':
          return <TemptationMapView />;
        case 'weekly_report':
          return <WeeklyReportView />;
        case 'accountability':
          return <AccountabilityView />;
        case 'smart_alerts':
          return <SmartAlertsView />;
        case 'sessions_log':
          return <SessionsLogView />;
        case 'dhikr_settings':
          return <DhikrSanctuaryView />;
        case 'challenges':
          return <ChallengesView />;
        case 'ayah_reflections':
          return <AyahReflectionView />;
        default:
          return <HomeDashboard onNavigate={handleSelectExtendedView} />;
      }
    }

    switch (activeTab) {
      case 'shield':
        return <HomeDashboard onNavigate={handleSelectExtendedView} />;
      case 'dhikr':
        return <DhikrSanctuaryView />;
      case 'taqwa':
        return <TaqwaStreakView />;
      case 'ayah':
        return <AyahReflectionView />;
      default:
        return <HomeDashboard onNavigate={handleSelectExtendedView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0714] text-[#F5F3FF] flex flex-col selection:bg-purple-600 selection:text-white pb-20">
      {/* Top Sticky Header */}
      <Header />

      {/* Extended View Subheader with Back Button if opened from Drawer */}
      {currentExtendedView && (
        <div className="max-w-md mx-auto w-full px-4 pt-3 pb-1 flex items-center justify-between">
          <button
            onClick={() => setCurrentExtendedView(null)}
            className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors bg-[#170F26] px-3 py-1.5 rounded-full border border-purple-900/30"
            type="button"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main</span>
          </button>
          <span className="text-[10px] uppercase font-metric tracking-widest text-purple-400 font-semibold">
            SITR Guardian
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Navigation Drawer */}
      <MenuDrawer
        currentView={currentExtendedView || 'dashboard'}
        onSelectView={handleSelectExtendedView}
      />

      {/* Urgent Rescue / Interruption Modal */}
      <UrgentRescueModal />

      {/* Technical Architecture Note Modal */}
      <TechnicalNoteModal />
    </div>
  );
}
