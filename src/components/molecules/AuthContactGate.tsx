import React, { useState } from 'react';
import { Copy, Check, Mail, Phone, Lock, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AppLanguage, AppTheme } from '../../types';

interface AuthContactGateProps {
  language: AppLanguage;
  theme: AppTheme;
}

export const AuthContactGate: React.FC<AuthContactGateProps> = ({ language, theme }) => {
  const { isAuthenticated, user, contact, signInWithGoogle, signOut } = useAuth();
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);

  const isPT = language === 'PT';
  const email = contact?.email || '';
  const phone = contact?.phone || '';

  const handleCopy = (text: string, field: 'email' | 'phone') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div data-nosnippet="true" className="space-y-3 select-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              theme === 'dark'
                ? 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400'
                : 'bg-slate-100/70 border-slate-200 text-slate-500'
            }`}
          >
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 opacity-60">
                <Mail className="w-3 h-3" />
                <span>{isPT ? 'E-mail Direto' : 'Direct Email'}</span>
              </div>
              <div className="text-xs font-mono tracking-widest mt-1 opacity-50 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                <span>••••••••••••••••••••</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold shrink-0">
              {isPT ? 'Protegido' : 'Protected'}
            </span>
          </div>

          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              theme === 'dark'
                ? 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400'
                : 'bg-slate-100/70 border-slate-200 text-slate-500'
            }`}
          >
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 opacity-60">
                <Phone className="w-3 h-3" />
                <span>{isPT ? 'Telefone / WhatsApp' : 'Phone / WhatsApp'}</span>
              </div>
              <div className="text-xs font-mono tracking-widest mt-1 opacity-50 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                <span>••••••••••••••••••••</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold shrink-0">
              {isPT ? 'Protegido' : 'Protected'}
            </span>
          </div>
        </div>

        <div
          className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            theme === 'dark'
              ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
              : 'bg-white border-slate-300 text-slate-700 shadow-2xs'
          }`}
        >
          <div className="space-y-0.5 text-xs">
            <div className="font-mono font-bold flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{isPT ? 'Proteção em nuvem contra robôs e spammers' : 'Cloud protected against scrapers'}</span>
            </div>
            <p className="text-[11px] opacity-70 font-sans">
              {isPT
                ? 'Autentique-se com Google para carregar os contatos diretos.'
                : 'Sign in with Google to load verified direct contacts.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="h-9 px-4 rounded-lg text-xs font-mono font-bold bg-white text-zinc-900 hover:bg-slate-100 border border-slate-300 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-2xs transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{isPT ? 'Liberar com Google' : 'Unlock with Google'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-nosnippet="true" className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* E-MAIL CARREGADO DA NUVEM */}
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
            theme === 'dark'
              ? 'bg-zinc-900/60 border-zinc-800 text-zinc-200'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="min-w-0 pr-2">
            <div className="text-[10px] font-mono opacity-50 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
              <span>{isPT ? 'E-mail Direto' : 'Direct Email'}</span>
            </div>
            <a
              href={`mailto:${email}`}
              className="text-xs font-mono font-semibold truncate block text-blue-600 dark:text-cyan-400 mt-1 hover:underline select-all"
            >
              {email || 'Carregando...'}
            </a>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(email, 'email')}
            className={`p-2 rounded-lg border transition-colors shrink-0 cursor-pointer ${
              theme === 'dark'
                ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-2xs'
            }`}
            title={isPT ? 'Copiar e-mail' : 'Copy email'}
          >
            {copiedField === 'email' ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 opacity-60" />
            )}
          </button>
        </div>

        {/* TELEFONE CARREGADO DA NUVEM */}
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
            theme === 'dark'
              ? 'bg-zinc-900/60 border-zinc-800 text-zinc-200'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="min-w-0 pr-2">
            <div className="text-[10px] font-mono opacity-50 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-emerald-500" />
              <span>{isPT ? 'Telefone / WhatsApp' : 'Phone / WhatsApp'}</span>
            </div>
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono font-semibold truncate block text-blue-600 dark:text-cyan-400 mt-1 hover:underline select-all"
            >
              {phone || 'Carregando...'}
            </a>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(phone, 'phone')}
            className={`p-2 rounded-lg border transition-colors shrink-0 cursor-pointer ${
              theme === 'dark'
                ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-2xs'
            }`}
            title={isPT ? 'Copiar telefone' : 'Copy phone'}
          >
            {copiedField === 'phone' ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 opacity-60" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-1 text-[11px] font-mono opacity-60 pt-1">
        <span className="truncate">
          {isPT ? 'Conectado como' : 'Verified as'} {user?.displayName || user?.email || 'Recruiter'}
        </span>
        <button
          type="button"
          onClick={() => signOut()}
          className="hover:underline text-rose-500 flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
        >
          <LogOut className="w-3 h-3" />
          <span>{isPT ? 'Sair' : 'Sign out'}</span>
        </button>
      </div>
    </div>
  );
};
