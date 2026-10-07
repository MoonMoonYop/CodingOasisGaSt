import React, { useState } from 'react';
import { Lock, Mail, User, X } from 'lucide-react';
import { ASSETS } from '../data/catalog';

export interface UserProfile {
  name: string;
  email: string;
  provider: 'credentials' | 'google';
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [logoError, setLogoError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Harap isi Email/Username dan Password terlebih dahulu.');
      return;
    }

    if (mode === 'register' && !fullName.trim()) {
      setErrorMsg('Harap masukkan Nama Lengkap atau Username kamu.');
      return;
    }

    const displayName =
      mode === 'register'
        ? fullName.trim()
        : identifier.includes('@')
          ? identifier.split('@')[0]
          : identifier.trim();

    onSuccessLogin({
      name: displayName,
      email: identifier.includes('@') ? identifier.trim() : `${identifier.trim()}@oasis.id`,
      provider: 'credentials',
    });
    onClose();
  };

  const handleGoogleLogin = () => {
    onSuccessLogin({
      name: 'Oasis Angler',
      email: 'angler.tropis@gmail.com',
      provider: 'google',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050D1A]/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-[#00A8E8]/30 bg-[#0D233A] p-6 text-[#F0F9FF] shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#0A192F] text-slate-300 transition-colors hover:border-[#00A8E8] hover:text-white"
          aria-label="Tutup modal login"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[#00A8E8] bg-[#0A192F]">
            <img
              src={!logoError ? 'logo.png' : ASSETS.logo}
              alt="Coding Oasis Logo"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs text-[#00A8E8]">Akun Member Coding Oasis</p>
            <h2 id="auth-modal-title" className="font-display text-xl font-bold text-white">
              {mode === 'login' ? 'Masuk ke Coding Oasis' : 'Daftar Member Baru'}
            </h2>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-[#0A192F] p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`rounded-lg py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
              mode === 'login'
                ? 'bg-[#00A8E8] text-[#0A192F]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`rounded-lg py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
              mode === 'register'
                ? 'bg-[#00A8E8] text-[#0A192F]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Daftar Akun
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Username / Nama Panggilan
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: OasisAngler"
                  className="w-full rounded-xl border border-white/15 bg-[#0A192F] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#00A8E8] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Email atau Username
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="email@domain.com atau username"
                className="w-full rounded-xl border border-white/15 bg-[#0A192F] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#00A8E8] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password akun"
                className="w-full rounded-xl border border-white/15 bg-[#0A192F] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#00A8E8] focus:outline-none"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#FFB703] px-4 py-3 text-sm font-bold text-[#0A192F] transition-colors hover:bg-[#ffca3a] whitespace-nowrap"
          >
            {mode === 'login' ? 'Masuk Sekarang' : 'Buat Akun Coding Oasis'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-slate-400">atau akses cepat</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-[#0A192F] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[#00A8E8] hover:bg-[#0A192F]/80 whitespace-nowrap"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
            />
            <path
              fill="#FBBC05"
              d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 19.9 7.4 23 12 23z"
            />
          </svg>
          <span>Masuk dengan Google</span>
        </button>
      </div>
    </div>
  );
};
