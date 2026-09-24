import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Github,
  Linkedin,
  FileDown,
  Copy,
  Check,
  Send,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { PROFILE_DATA } from '../../data/curriculumData';
import { playSound } from '../../utils/audio';
import { AppLanguage, AppTheme } from '../../types';
import { t } from '../../i18n/translations';
import { Button } from '../atoms/Button';

interface HandshakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume: () => void;
  soundEnabled: boolean;
  language: AppLanguage;
  theme: AppTheme;
}

export const HandshakeModal: React.FC<HandshakeModalProps> = ({
  isOpen,
  onClose,
  onOpenResume,
  soundEnabled,
  language,
  theme,
}) => {
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);
  const [inquirySubject, setInquirySubject] = useState(t(language, 'handshake.subjectDefault'));
  const [inquiryNote, setInquiryNote] = useState('');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    setCopiedField(type);
    playSound('click', soundEnabled);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSendDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultBody = t(language, 'handshake.defaultBody');
    const mailtoUrl = `mailto:${PROFILE_DATA.email}?subject=${encodeURIComponent(
      inquirySubject
    )}&body=${encodeURIComponent(inquiryNote || defaultBody)}`;
    window.location.href = mailtoUrl;
    playSound('success', soundEnabled);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="handshake-modal-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden my-auto border transition-colors ${
          theme === 'dark'
            ? 'bg-zinc-950 border-zinc-700/90 text-zinc-100'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded border ${
                theme === 'dark'
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono opacity-70">
                {t(language, 'handshake.subtitle')}
              </div>
              <h2
                id="handshake-modal-title"
                className={`text-base font-mono font-bold ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-blue-700'
                }`}
              >
                {t(language, 'handshake.title')}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded transition-colors ${
              theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-200 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          <div
            className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
              theme === 'dark'
                ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div
              className={`flex items-center gap-2 font-mono font-bold mb-1 ${
                theme === 'dark' ? 'text-cyan-400' : 'text-blue-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t(language, 'handshake.availabilityTitle')}</span>
            </div>
            <p>{t(language, 'handshake.availabilityDesc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              className={`p-3.5 rounded-lg border flex items-center justify-between ${
                theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="text-[11px] font-mono opacity-60">{t(language, 'handshake.emailLabel')}</div>
                <div
                  className={`text-xs font-mono font-semibold truncate ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-blue-700'
                  }`}
                >
                  {PROFILE_DATA.email}
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(PROFILE_DATA.email, 'email')}
                className={`p-2 rounded border transition-colors shrink-0 ${
                  theme === 'dark'
                    ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                }`}
                title="Copiar e-mail"
              >
                {copiedField === 'email' ? (
                  <Check className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div
              className={`p-3.5 rounded-lg border flex items-center justify-between ${
                theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="text-[11px] font-mono opacity-60">
                  {t(language, 'handshake.phoneLabel')}
                </div>
                <div
                  className={`text-xs font-mono font-semibold truncate ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-blue-700'
                  }`}
                >
                  {PROFILE_DATA.phone}
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(PROFILE_DATA.phone, 'phone')}
                className={`p-2 rounded border transition-colors shrink-0 ${
                  theme === 'dark'
                    ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                }`}
                title="Copiar telefone"
              >
                {copiedField === 'phone' ? (
                  <Check className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={PROFILE_DATA.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono transition-colors ${
                theme === 'dark'
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-cyan-400'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-blue-700'
              }`}
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href={PROFILE_DATA.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono transition-colors ${
                theme === 'dark'
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <Button
              variant="secondary"
              size="sm"
              icon={<FileDown className="w-3.5 h-3.5" />}
              onClick={() => {
                onClose();
                onOpenResume();
              }}
              className={`ml-auto ${theme === 'dark' ? 'border-cyan-500/40 text-cyan-300 bg-cyan-600/10 hover:bg-cyan-600/20' : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'}`}
            >
              {t(language, 'handshake.viewResume')}
            </Button>
          </div>

          <form onSubmit={handleSendDraft} className="space-y-3 pt-2 border-t dark:border-zinc-800 border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-mono opacity-80">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>{t(language, 'handshake.rapidDispatch')}</span>
            </div>

            <div>
              <input
                type="text"
                value={inquirySubject}
                onChange={(e) => setInquirySubject(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border text-xs font-mono focus:outline-hidden focus:ring-1 ${
                  theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-cyan-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-600'
                }`}
                required
              />
            </div>

            <div>
              <textarea
                rows={3}
                value={inquiryNote}
                onChange={(e) => setInquiryNote(e.target.value)}
                placeholder={t(language, 'handshake.notePlaceholder')}
                className={`w-full px-3 py-2 rounded-md border text-xs font-sans focus:outline-hidden focus:ring-1 ${
                  theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-cyan-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-600'
                }`}
              />
            </div>

            <Button
              type="submit"
              variant={theme === 'dark' ? 'danger' : 'primary'}
              size="md"
              icon={<Send className="w-3.5 h-3.5" />}
              className={`w-full shadow-md ${theme === 'dark' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : ''}`}
            >
              {t(language, 'handshake.sendButton')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
