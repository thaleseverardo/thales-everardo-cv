import React from 'react';
import { Lock, Unlock, LogOut, Check, Copy } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AppLanguage, AppTheme } from '../../types';

interface AuthContactGateProps {
  type: 'email' | 'phone';
  language: AppLanguage;
  theme: AppTheme;
  onCopySuccess?: () => void;
}

export const AuthContactGate: React.FC<AuthContactGateProps> = ({
  type,
  language,
  theme,
  onCopySuccess,
}) => {
  const { user, isAuthenticated, contact, signInWithGoogle, signInWithGithub, signOut } = useAuth();
  const [copied, setCopied] = React.useState(false);

  const value = type === 'email' ? contact.email : contact.phone;
  const label = type === 'email' ? (language === 'PT' ? 'E-MAIL DIRETO' : 'DIRECT EMAIL') : (language === 'PT' ? 'TELEFONE / WHATSAPP' : 'PHONE / WHATSAPP');

  const handleCopy = () => {
    if (!isAuthenticated) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    if (onCopySuccess) onCopySuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div
        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          theme === 'dark'
            ? 'bg-zinc-900/90 border-zinc-800 text-zinc-300'
            : 'bg-slate-50 border-slate-300 text-slate-800'
        }`}
      >
        <div className="space-y-0.5">
          <div className="text-[10px] font-mono uppercase tracking-wider opacity-60 flex items-center gap-1.5 font-bold">
            <Lock className="w-3 h-3 text-amber-500 shrink-0" />
            <span>{label}</span>
          </div>
          <div className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
            🔒 {language === 'PT' ? 'Protegido contra robôs e spammers' : 'Protected against bots & harvesters'}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white text-zinc-900 hover:bg-slate-100 border border-slate-300 shadow-xs transition-colors"
            title="Login com Google"
          >
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => signInWithGithub()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 shadow-xs transition-colors"
            title="Login com GitHub"
          >
            <span>GitHub</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
        theme === 'dark' ? 'bg-zinc-900/80 border-emerald-500/30' : 'bg-emerald-50/70 border-emerald-300'
      }`}
    >
      <div className="min-w-0 pr-2">
        <div className="text-[10px] font-mono uppercase tracking-wider opacity-70 flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
          <Unlock className="w-3 h-3" />
          <span>{label} ({language === 'PT' ? 'DESBLOQUEADO' : 'UNLOCKED'})</span>
        </div>
        <div className="text-xs font-mono font-bold truncate text-zinc-900 dark:text-zinc-100 mt-0.5 select-all">
          {value}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleCopy}
          className={`p-2 rounded-lg border transition-colors ${
            theme === 'dark'
              ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
          }`}
          title="Copiar"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={() => signOut()}
          className="p-2 rounded-lg border border-transparent hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 transition-colors"
          title="Encerrar sessão"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
