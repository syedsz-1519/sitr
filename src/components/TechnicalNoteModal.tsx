import React from 'react';
import { ShieldCheck, Smartphone, X, AlertTriangle, Play, Sparkles } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';

export const TechnicalNoteModal: React.FC = () => {
  const { technicalNoteOpen, setTechnicalNoteOpen, simulateBlockPrompt } = useSitrStore();

  if (!technicalNoteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0714]/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#160E25] border border-purple-800/40 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => setTechnicalNoteOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1E1433] text-purple-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-600/40 flex items-center justify-center text-purple-300">
            <Smartphone className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">SITR Architecture Note</h3>
            <span className="text-xs text-purple-300/70 font-metric uppercase tracking-wider">
              Web Companion + Native Shield
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 text-xs text-purple-200/90 leading-relaxed">
          <p>
            <strong className="text-white">Assalamu Alaikum, bhai.</strong> SITR is built with an Islamic-first intentionality framework.
          </p>
          <p>
            This web app serves as your <strong>full companion cockpit</strong>: it logs rules, tracks your 24-hour temptation heatmap, calculates your live <strong>Nafs Score</strong>, guides your 33× dhikr sessions, and builds taqwa accountability with your partner.
          </p>
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/30 text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Native OS Block Enforcement</span>
            </div>
            <p className="text-purple-200/80">
              Web browsers cannot forcefully terminate other native apps (like Instagram or TikTok) on Android/iOS due to sandboxing.
              Full OS-level background kill is powered when wrapped with <strong>Capacitor</strong> via:
            </p>
            <ul className="list-disc list-inside text-purple-300 pl-1 space-y-0.5 font-metric">
              <li><strong>Android:</strong> AccessibilityService API + UsageStatsManager</li>
              <li><strong>iOS:</strong> FamilyControls & DeviceActivity frameworks</li>
            </ul>
          </div>
          <p>
            To test the emergency slip interception and 33× dhikr redirection flow right now, tap the test button below:
          </p>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => {
              setTechnicalNoteOpen(false);
              simulateBlockPrompt();
            }}
            className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs uppercase tracking-wider font-metric flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Simulate App Intercept Now</span>
          </button>
          <button
            onClick={() => setTechnicalNoteOpen(false)}
            className="w-full py-2.5 px-4 rounded-full bg-[#1E1433] hover:bg-[#251940] text-purple-300 text-xs font-medium"
          >
            Understood, JazaakAllahu Khayran
          </button>
        </div>
      </div>
    </div>
  );
};
