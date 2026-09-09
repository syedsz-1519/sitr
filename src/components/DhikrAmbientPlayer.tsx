import React, { useState, useEffect, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Headphones,
  Sliders,
  Sparkles,
  Waves,
  ChevronDown,
  Check,
} from 'lucide-react';
import {
  dhikrAmbientAudio,
  AMBIENT_PRESETS,
  AmbientSoundPreset,
} from '../utils/ambientAudioEngine';

export const DhikrAmbientPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.45);
  const [preset, setPreset] = useState<AmbientSoundPreset>('rhythmic-chant');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Sync state on mount and stop on unmount
  useEffect(() => {
    setIsPlaying(dhikrAmbientAudio.isAudioRunning());
    setPreset(dhikrAmbientAudio.getPreset());
    setVolume(dhikrAmbientAudio.getVolume());

    return () => {
      // Auto pause when navigating away from the Dhikr screen
      dhikrAmbientAudio.stop(true).catch(() => {});
    };
  }, []);

  const handleToggle = useCallback(async () => {
    if (isPlaying) {
      await dhikrAmbientAudio.stop(true);
      setIsPlaying(false);
    } else {
      const success = await dhikrAmbientAudio.start(preset);
      if (success) {
        setIsPlaying(true);
      }
    }
  }, [isPlaying, preset]);

  const handlePresetChange = useCallback(
    async (newPreset: AmbientSoundPreset) => {
      setPreset(newPreset);
      if (isPlaying) {
        await dhikrAmbientAudio.start(newPreset);
      }
    },
    [isPlaying]
  );

  const handleVolumeChange = useCallback((newVol: number) => {
    setVolume(newVol);
    dhikrAmbientAudio.setVolume(newVol);
  }, []);

  const currentPresetInfo = AMBIENT_PRESETS[preset];

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-[#1A0F2E] via-[#160B28] to-[#120722] border border-purple-800/40 p-3.5 sm:p-4 shadow-lg relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          isPlaying ? 'bg-amber-500/15 opacity-100' : 'bg-purple-900/10 opacity-30'
        }`}
      />

      <div className="flex items-center justify-between gap-3 relative z-10">
        {/* Left info & status */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleToggle}
            type="button"
            aria-label={isPlaying ? 'Mute ambient dhikr chant' : 'Play ambient dhikr chant'}
            title={isPlaying ? 'Pause Ambient Sound' : 'Play Ambient Sound'}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 relative cursor-pointer border ${
              isPlaying
                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.45)] scale-102'
                : 'bg-[#22133B] text-purple-300 border-purple-700/50 hover:border-purple-500 hover:text-white'
            }`}
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white font-metric tracking-wide truncate">
                {currentPresetInfo.name}
              </span>
              <span
                className={`text-[9px] font-metric font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border transition-colors ${
                  isPlaying
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-purple-950/60 text-purple-300/60 border-purple-800/40'
                }`}
              >
                {isPlaying ? 'Playing • Ambient Loop' : 'Muted • Offline Loop'}
              </span>
            </div>
            <p className="text-[11px] text-purple-200/70 truncate mt-0.5 font-sans">
              {currentPresetInfo.description}
            </p>
          </div>
        </div>

        {/* Right Controls: Audio Visualizer & Settings Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Animated Audio Equalizer Bars */}
          {isPlaying && (
            <div className="flex items-end gap-1 h-5 px-2 py-0.5 rounded-lg bg-[#0F071B] border border-amber-500/30">
              <span className="w-1 bg-amber-400 rounded-full animate-[pulse_1.2s_ease-in-out_infinite] h-4" />
              <span className="w-1 bg-amber-300 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2.5" />
              <span className="w-1 bg-amber-400 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] h-4.5" />
              <span className="w-1 bg-amber-200 rounded-full animate-[pulse_1.0s_ease-in-out_infinite] h-3" />
            </div>
          )}

          {/* Settings Accordion Toggle */}
          <button
            onClick={() => setShowSettings((prev) => !prev)}
            type="button"
            title="Audio Presets & Volume Controls"
            className={`p-2 rounded-xl border text-xs font-metric transition-colors flex items-center gap-1.5 ${
              showSettings
                ? 'bg-purple-800/60 text-white border-purple-500'
                : 'bg-[#180C2C] text-purple-300 hover:text-white border-purple-900/50 hover:border-purple-700/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <ChevronDown
              className={`w-3 h-3 transition-transform ${showSettings ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Expandable Audio Settings Panel */}
      {showSettings && (
        <div className="mt-3.5 pt-3.5 border-t border-purple-900/40 relative z-10 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Preset Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase font-metric tracking-wider text-purple-300/80">
                Spiritual Ambience Style
              </span>
              <span className="text-[10px] text-amber-300/90 font-arabic" dir="rtl">
                {currentPresetInfo.arabicSubtitle}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(Object.keys(AMBIENT_PRESETS) as AmbientSoundPreset[]).map((key) => {
                const item = AMBIENT_PRESETS[key];
                const isSelected = preset === key;
                return (
                  <button
                    key={key}
                    onClick={() => handlePresetChange(key)}
                    type="button"
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-purple-900/60 border-amber-400/60 text-white shadow-sm ring-1 ring-amber-400/30'
                        : 'bg-[#120822] border-purple-900/40 text-purple-300/70 hover:text-purple-200 hover:border-purple-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-metric">{item.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                    </div>
                    <span className="text-[10px] opacity-70 block mt-0.5 line-clamp-1">
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-between gap-4 bg-[#110720] border border-purple-900/40 rounded-xl p-2.5">
            <div className="flex items-center gap-2 text-xs font-metric text-purple-300 shrink-0">
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span>Ambience Volume</span>
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-amber-400 bg-purple-950 h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] font-mono text-amber-300 font-bold w-9 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
