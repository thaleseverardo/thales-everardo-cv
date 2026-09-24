import React, { useState } from 'react';
import { Copy, Check, Mail, Phone } from 'lucide-react';
import { AppLanguage, AppTheme } from '../../types';
import { PROFILE_DATA } from '../../data/curriculumData';

interface AuthContactGateProps {
  language: AppLanguage;
  theme: AppTheme;
}

export const AuthContactGate: React.FC<AuthContactGateProps> = ({ language, theme }) => {
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);

  const email = PROFILE_DATA?.email || 'thales.everardo@gmail.com';
  const phone = PROFILE_DATA?.phone || '+55 (11) 94944-7774';

  const handleCopy = (text: string, field: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isPT = language === 'PT';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* E-MAIL DIRETO */}
      <div
        className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
          theme === 'dark'
            ? 'bg-zinc-900/50 border-zinc-800 text-zinc-200'
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
            {email}
          </a>
        </div>
        <button
          type="button"
          onClick={() => handleCopy(email, 'email')}
          className={`p-2 rounded-lg border transition-colors shrink-0 ${
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

      {/* TELEFONE / WHATSAPP */}
      <div
        className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
          theme === 'dark'
            ? 'bg-zinc-900/50 border-zinc-800 text-zinc-200'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}
      >
        <div className="min-w-0 pr-2">
          <div className="text-[10px] font-mono opacity-50 uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-emerald-500" />
            <span>{isPT ? 'Telefone / WhatsApp' : 'Phone / WhatsApp'}</span>
          </div>
          <a
            href="https://wa.me/5511949447774"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono font-semibold truncate block text-blue-600 dark:text-cyan-400 mt-1 hover:underline select-all"
          >
            {phone}
          </a>
        </div>
        <button
          type="button"
          onClick={() => handleCopy(phone, 'phone')}
          className={`p-2 rounded-lg border transition-colors shrink-0 ${
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
  );
};