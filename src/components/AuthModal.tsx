import React, { useState } from 'react';
import { X, User, Mail, Lock, Shield, Check, Cloud, ArrowRight, LogOut, Sparkles } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { SitrLogo } from './SitrLogo';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, userProfile, login, signup, logout, currentStreak } = useSitrStore();

  const [mode, setMode] = useState<'login' | 'signup'>(userProfile.isLoggedIn ? 'login' : 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [syncCloud, setSyncCloud] = useState(true);
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 4) {
      setError('Password should be at least 4 characters.');
      return;
    }

    if (mode === 'signup') {
      signup(email, name || email.split('@')[0]);
    } else {
      login(email, name || email.split('@')[0]);
    }
  };

  const handleQuickDemoGoogle = () => {
    login('syedshahnawaz1519@gmail.com', 'Shahnawaz (Fixxells)');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-sm rounded-3xl bg-[#061D14] border border-amber-500/35 p-6 shadow-[0_20px_60px_rgba(4,20,14,0.7)] text-white overflow-hidden">
        {/* Luminous top background glow */}
        <div className="absolute -top-14 inset-x-0 h-32 bg-emerald-500/20 blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#04160E] text-amber-300 hover:text-white flex items-center justify-center transition-colors border border-amber-500/30 cursor-pointer"
          type="button"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-5">
          {/* Circular avatar icon */}
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full bg-[#0D3827] text-amber-300 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] border-2 border-amber-400/60">
              <User className="w-8 h-8 fill-amber-300 text-amber-300" />
            </div>
            {userProfile.isLoggedIn && (
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-[#061D14] shadow-sm">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-amber-50 tracking-tight">
            {userProfile.isLoggedIn ? 'Your SITR Account' : 'Sign In or Create Account'}
          </h2>
          <p className="text-xs text-emerald-200/80 mt-1 font-sans">
            {userProfile.isLoggedIn
              ? 'Your Taqwa streak and digital wellbeing data are synced.'
              : 'Safeguard your Taqwa streak and nafs score across devices.'}
          </p>
        </div>

        {/* If Already Logged In: Profile Card & Actions */}
        {userProfile.isLoggedIn ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#08261A] border border-amber-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-200/80 font-medium">Account Name</span>
                <span className="text-xs font-bold text-white">{userProfile.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-200/80 font-medium">Email</span>
                <span className="text-xs text-amber-200/90 font-mono">{userProfile.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-200/80 font-medium">Taqwa Streak Backup</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Cloud className="w-3.5 h-3.5" />
                  <span>{currentStreak} Days Synced</span>
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-amber-500/20">
                <span className="text-xs text-emerald-200/80 font-medium">Status</span>
                <div className="flex items-center gap-1 text-amber-300 text-xs font-semibold">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Founder • Lifetime</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  logout();
                  setMode('login');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#08261A] hover:bg-[#0B3322] text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 border border-amber-500/30 transition-all cursor-pointer"
                type="button"
              >
                <LogOut className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign Out</span>
              </button>
              <button
                onClick={() => setAuthModalOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold transition-all shadow-[0_4px_16px_rgba(16,185,129,0.4)] cursor-pointer"
                type="button"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div>
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#08261A] border border-amber-500/25 mb-4">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-emerald-200/80 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-emerald-200/80 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-medium text-emerald-200 mb-1">
                    Your Name / Kunya
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Shahnawaz"
                      className="w-full bg-[#04160E] border border-amber-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-emerald-400/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-emerald-200 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-[#04160E] border border-amber-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-emerald-400/40 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-emerald-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#04160E] border border-amber-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-emerald-400/40 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Cloud Sync Checkbox */}
              <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={syncCloud}
                  onChange={(e) => setSyncCloud(e.target.checked)}
                  className="mt-0.5 rounded border-amber-500/40 text-emerald-600 focus:ring-0 accent-emerald-600"
                />
                <span className="text-[11px] text-emerald-200/90 leading-tight">
                  Sync Taqwa streaks & daily dhikr progress to encrypted cloud
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-[0_4px_16px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>{mode === 'signup' ? 'Create Account & Sync' : 'Sign In to SITR'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick 1-click Google / Fast Login */}
            <div className="mt-3.5 pt-3.5 border-t border-amber-500/20 text-center">
              <button
                type="button"
                onClick={handleQuickDemoGoogle}
                className="w-full py-2 px-3 rounded-xl bg-[#08261A] hover:bg-[#0B3322] border border-amber-500/30 text-[11px] font-medium text-emerald-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[9px] font-bold text-blue-600">
                  G
                </span>
                <span>Continue with Google Account</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
