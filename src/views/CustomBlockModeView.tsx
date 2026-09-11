import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Plus,
  Trash2,
  Play,
  Smartphone,
  Globe,
  Tag,
  CheckCircle2,
  X,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { RuleType, BlockRule } from '../types';

export const CustomBlockModeView: React.FC = () => {
  const {
    customBlockModeEnabled,
    toggleCustomBlockMode,
    customRules,
    addCustomRule,
    toggleCustomRule,
    deleteCustomRule,
    simulateBlockPrompt,
    setTechnicalNoteOpen,
  } = useSitrStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [ruleType, setRuleType] = useState<RuleType>('app');
  const [ruleLabel, setRuleLabel] = useState('');
  const [ruleTarget, setRuleTarget] = useState('');
  const [error, setError] = useState('');

  const totalRules = customRules.length;
  const activeBlocks = customRules.filter((r) => r.enabled).length;

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleLabel.trim() || !ruleTarget.trim()) {
      setError('Please provide both a label and a target.');
      return;
    }

    addCustomRule({
      label: ruleLabel.trim(),
      target: ruleTarget.trim(),
      type: ruleType,
    });

    setRuleLabel('');
    setRuleTarget('');
    setError('');
    setIsAddOpen(false);
  };

  const handleQuickPreset = (preset: { label: string; target: string; type: RuleType }) => {
    addCustomRule(preset);
  };

  const quickPresets: { label: string; target: string; type: RuleType }[] = [
    { label: 'YouTube Shorts', target: 'youtube.com/shorts', type: 'website' },
    { label: 'Instagram Reels', target: 'com.instagram.android', type: 'app' },
    { label: 'TikTok', target: 'com.zhiliaoapp.musically', type: 'app' },
    { label: 'Reddit NSFW / Feed', target: 'reddit.com', type: 'website' },
    { label: 'Trigger Keywords', target: 'nsfw, thirst trap, gossip', type: 'keyword' },
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* Top Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="text-amber-400">
            <Shield className="w-7 h-7 fill-emerald-900/30" />
          </div>
          <h1 className="text-2xl font-extrabold text-amber-50 tracking-tight">
            Custom Block Mode
          </h1>
        </div>
        <p className="text-xs text-emerald-200/80 mt-1">
          Block any app, site, or keyword — your rules, akhi.
        </p>
      </div>

      {/* Mode Toggle Button / Pill */}
      <button
        onClick={toggleCustomBlockMode}
        type="button"
        className={`w-full py-3.5 px-6 rounded-full border transition-all duration-300 flex items-center justify-center gap-2.5 font-metric text-xs uppercase tracking-widest font-bold select-none cursor-pointer ${
          customBlockModeEnabled
            ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 border-amber-400/80 text-white shadow-[0_0_24px_rgba(16,185,129,0.4)] ring-1 ring-amber-300/40'
            : 'bg-[#061D14] border-amber-500/30 text-emerald-200/80 hover:border-amber-500/60 hover:text-white'
        }`}
      >
        <Zap
          className={`w-4 h-4 ${
            customBlockModeEnabled ? 'fill-amber-300 text-amber-300 animate-pulse' : 'text-amber-400'
          }`}
        />
        <span>{customBlockModeEnabled ? 'MODE ACTIVE (ON)' : 'MODE OFF'}</span>
      </button>

      {/* 3 Metric Stat Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Card 1: TOTAL RULES */}
        <div className="bg-[#061D14] border border-amber-500/25 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-metric">
            {totalRules}
          </span>
          <span className="text-[9px] uppercase font-metric tracking-wider text-emerald-200/70 font-semibold mt-1">
            TOTAL RULES
          </span>
        </div>

        {/* Card 2: ACTIVE BLOCKS */}
        <div className="bg-[#061D14] border border-amber-500/25 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-metric">
            {activeBlocks}
          </span>
          <span className="text-[9px] uppercase font-metric tracking-wider text-emerald-200/70 font-semibold mt-1">
            ACTIVE BLOCKS
          </span>
        </div>

        {/* Card 3: MODE STATUS */}
        <div className="bg-[#061D14] border border-amber-500/25 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                customBlockModeEnabled ? 'bg-emerald-400 shadow-[0_0_8px_#22c55e]' : 'border border-amber-300/60'
              }`}
            />
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-metric">
              {customBlockModeEnabled ? 'On' : 'Off'}
            </span>
          </div>
          <span className="text-[9px] uppercase font-metric tracking-wider text-emerald-200/70 font-semibold mt-1">
            MODE
          </span>
        </div>
      </div>

      {/* Action Header Card: Add New Block Rule */}
      <div className="bg-[#061D14] border border-amber-500/25 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
        <span className="text-sm sm:text-base font-bold text-amber-50">
          Add New Block Rule
        </span>
        <button
          onClick={() => setIsAddOpen(!isAddOpen)}
          type="button"
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-[0_2px_12px_rgba(16,185,129,0.35)] cursor-pointer"
        >
          {isAddOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isAddOpen ? 'Close' : '+ Add Rule'}</span>
        </button>
      </div>

      {/* Expandable Add Rule Form */}
      {isAddOpen && (
        <form
          onSubmit={handleAddRule}
          className="bg-[#08261A] border border-amber-500/35 rounded-2xl p-5 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
            <span className="text-xs font-bold uppercase font-metric tracking-wider text-amber-50">
              Create Custom Rule
            </span>
            <span className="text-[10px] text-emerald-200/70 font-metric">
              Instant local shield
            </span>
          </div>

          {/* Rule Type Tabs */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRuleType('app')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold font-metric flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                ruleType === 'app'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'bg-[#04160E] text-emerald-200/70 border border-amber-500/25 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>App</span>
            </button>

            <button
              type="button"
              onClick={() => setRuleType('website')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold font-metric flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                ruleType === 'website'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'bg-[#04160E] text-emerald-200/70 border border-amber-500/25 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Website</span>
            </button>

            <button
              type="button"
              onClick={() => setRuleType('keyword')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold font-metric flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                ruleType === 'keyword'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'bg-[#04160E] text-emerald-200/70 border border-amber-500/25 hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Keyword</span>
            </button>
          </div>

          {/* Label Input */}
          <div className="space-y-1">
            <label className="text-[11px] text-emerald-200/80 font-medium block">
              Rule Display Name
            </label>
            <input
              type="text"
              value={ruleLabel}
              onChange={(e) => setRuleLabel(e.target.value)}
              placeholder={
                ruleType === 'app'
                  ? 'e.g. Instagram Explore / Reels'
                  : ruleType === 'website'
                  ? 'e.g. Celebrity Gossip Blog'
                  : 'e.g. Lustful phrases, NSFW triggers'
              }
              className="w-full bg-[#04160E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-emerald-400/40 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Target Input */}
          <div className="space-y-1">
            <label className="text-[11px] text-emerald-200/80 font-medium block">
              Target ({ruleType === 'app' ? 'Package / Identifier' : ruleType === 'website' ? 'Domain URL' : 'Keywords separated by comma'})
            </label>
            <input
              type="text"
              value={ruleTarget}
              onChange={(e) => setRuleTarget(e.target.value)}
              placeholder={
                ruleType === 'app'
                  ? 'com.instagram.android'
                  : ruleType === 'website'
                  ? 'example.com or reddit.com'
                  : 'nsfw, thirst, adult'
              }
              className="w-full bg-[#04160E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-emerald-400/40 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {error && <p className="text-[11px] text-rose-400">{error}</p>}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs uppercase tracking-wider font-metric transition-colors shadow-md cursor-pointer"
            >
              Add Block Rule
            </button>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="py-2.5 px-4 rounded-xl bg-[#04160E] hover:bg-[#08261A] text-emerald-200 text-xs font-semibold border border-amber-500/25 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Main Container / Empty State or Rule List */}
      {customRules.length === 0 ? (
        <div className="bg-[#061D14] border border-amber-500/25 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm min-h-[220px]">
          {/* Islamic Gold/Emerald Shield Icon */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#0D3827] via-[#08261A] to-[#061D14] border border-amber-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.2)]">
              <Shield className="w-9 h-9 text-amber-300 fill-amber-300/20 drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]" />
            </div>
          </div>

          <div className="space-y-1 max-w-[280px]">
            <h2 className="text-base font-bold text-amber-50 tracking-tight">
              No custom rules yet
            </h2>
            <p className="text-xs text-emerald-200/60 leading-relaxed">
              Add any app, website, or keyword above to protect your eyes and focus.
            </p>
          </div>

          {/* Quick presets shortcut */}
          <div className="pt-2 w-full max-w-[320px]">
            <span className="text-[10px] uppercase font-metric tracking-widest text-amber-300/80 font-semibold block mb-2">
              Popular Quick Presets
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {quickPresets.slice(0, 3).map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleQuickPreset(preset)}
                  className="px-3 py-1 rounded-full bg-[#08261A] hover:bg-[#0B3824] border border-amber-500/30 text-amber-200 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  + {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase font-metric tracking-wider text-amber-50">
              Your Custom Rules ({customRules.length})
            </span>
            <span className="text-[10px] text-amber-400 font-metric">
              {customBlockModeEnabled ? 'Rules Active' : 'Enable Mode to Enforce'}
            </span>
          </div>

          <div className="space-y-2.5">
            {customRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-[#061D14] border border-amber-500/25 hover:border-amber-500/50 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#08261A] border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                    {rule.type === 'app' ? (
                      <Smartphone className="w-4 h-4 text-amber-400" />
                    ) : rule.type === 'website' ? (
                      <Globe className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Tag className="w-4 h-4 text-amber-300" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate block">
                        {rule.label}
                      </span>
                      <span className="text-[9px] uppercase font-metric px-1.5 py-0.5 rounded bg-[#04160E] text-amber-300 border border-amber-500/30">
                        {rule.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-200/60 truncate block font-metric">
                      {rule.target}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Test Intercept Simulation */}
                  <button
                    onClick={() => simulateBlockPrompt(rule)}
                    className="p-1.5 rounded-lg bg-[#08261A] hover:bg-[#0B3824] text-amber-300 hover:text-white transition-colors cursor-pointer"
                    title="Simulate block screen"
                    type="button"
                  >
                    <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </button>

                  {/* Toggle Active Switch */}
                  <button
                    onClick={() => toggleCustomRule(rule.id)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center cursor-pointer ${
                      rule.enabled ? 'bg-emerald-500' : 'bg-zinc-800'
                    }`}
                    type="button"
                  >
                    <span
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                        rule.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  {/* Delete Rule */}
                  <button
                    onClick={() => deleteCustomRule(rule.id)}
                    className="p-1.5 rounded-lg text-emerald-400/50 hover:text-rose-400 transition-colors cursor-pointer"
                    type="button"
                    title="Delete rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Helpful Companion Note */}
      <div className="rounded-2xl bg-[#061D14] border border-amber-500/25 p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#08261A] border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-50 block">How Custom Blocking Works</span>
            <span className="text-[10px] text-emerald-200/70 font-metric">
              Sandboxed simulation in browser • OS-level enforcement when packaged
            </span>
          </div>
        </div>

        <button
          onClick={() => setTechnicalNoteOpen(true)}
          className="text-xs text-amber-300 hover:text-white font-semibold font-metric underline shrink-0 cursor-pointer"
          type="button"
        >
          Learn More
        </button>
      </div>

      {/* Closing Ayah Anchor */}
      <div className="p-5 rounded-2xl bg-[#061D14] border border-amber-500/35 text-center space-y-1.5">
        <p className="font-arabic text-xl text-amber-50 font-bold leading-loose" dir="rtl">
          قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ وَيَحْفَظُوا فُرُوجَهُمْ
        </p>
        <p className="text-xs text-emerald-200 italic font-sans">
          “Tell the believing men to reduce [some] of their vision and guard their private parts.”
        </p>
        <span className="text-[10px] text-amber-400 font-metric block">
          — Surah An-Nur (Quran 24:30)
        </span>
      </div>
    </div>
  );
};
