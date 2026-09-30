import React, { useState } from 'react';
import { X, AlertCircle, Shield, ExternalLink, Linkedin } from 'lucide-react';
import { AppLanguage, AppTheme } from '../../types';
import { t } from '../../i18n/translations';
import { useAuth } from '../../hooks/useAuth';
import { GoogleLogo, GithubLogo } from '../atoms/SocialIcons';
import thalesAvatar from '../../assets/images/thales_avatar_250x250.webp';

interface ContactAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  language: AppLanguage;
  theme: AppTheme;
}

export const ContactAuthModal: React.FC<ContactAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language,
  theme,
}) => {
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setErrorMsg(null);
      await signInWithGoogle();
            onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error?.code === 'auth/popup-closed-by-user') return;
      if (error?.code === 'auth/account-exists-with-different-credential') {
        setErrorMsg(t(language, 'auth.errorAccountExists'));
      } else {
        setErrorMsg(t(language, 'auth.errorGoogle'));
      }
          }
  };

  const handleGithubLogin = async () => {
    try {
      setErrorMsg(null);
      await signInWithGithub();
            onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error?.code === 'auth/popup-closed-by-user') return;
      if (error?.code === 'auth/account-exists-with-different-credential') {
        setErrorMsg(t(language, 'auth.errorAccountExists'));
      } else {
        setErrorMsg(t(language, 'auth.errorGeneric'));
      }
          }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 md:backdrop-blur-xs flex items-center justify-center p-0 md:p-4 font-sans animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full h-dvh md:h-auto md:max-h-[92vh] md:max-w-105 rounded-none md:rounded-2xl shadow-2xl flex flex-col border-0 md:border transition-all relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-zinc-950 md:bg-zinc-900 md:border-zinc-800 text-zinc-100 shadow-black/80'
            : 'bg-white md:border-slate-200 text-slate-900 shadow-slate-300/40'
        }`}
      >
        {/* CABEÇALHO SUPERIOR PADRONIZADO COM SAFE-AREA */}
        <div className="px-4 md:px-6 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-3 md:py-3.5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold font-mono tracking-wider uppercase opacity-60">
            {t(language, 'auth.modalTitle')}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer active:scale-95"
            aria-label={t(language, 'auth.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-7 flex-1 overflow-y-auto flex flex-col justify-center max-w-sm mx-auto w-full">
          {/* CABEÇALHO */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 dark:border-zinc-700 shadow-xs mb-3">
              <img
                src={thalesAvatar}
                alt="Thales Everardo"
                width={56}
                height={56}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              {t(language, 'auth.modalTitle')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-xs leading-relaxed">
              {t(language, 'auth.modalSubtitle')}
            </p>
          </div>

          {/* ÁREA DE AÇÃO OAUTH */}
          <div className="mt-5 space-y-2.5">
            {errorMsg && (
              <div className="p-3 rounded-xl border border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              className={`w-full h-11 px-4 rounded-xl border font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs active:scale-[0.98] ${
                theme === 'dark'
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700/80 text-zinc-100'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-400'
              }`}
            >
              <GoogleLogo />
              <span>{t(language, 'auth.continueWithGoogle')}</span>
            </button>

            <button
              type="button"
              onClick={handleGithubLogin}
              className={`w-full h-11 px-4 rounded-xl border font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs active:scale-[0.98] ${
                theme === 'dark'
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700/80 text-zinc-100'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-400'
              }`}
            >
              <GithubLogo />
              <span>{t(language, 'auth.continueWithGithub')}</span>
            </button>
          </div>

          {/* DIVISOR: ALTERNATIVA IMEDIATA SEM LOGIN */}
          <div className="relative flex items-center justify-center my-4">
            <div className="w-full border-t border-slate-200 dark:border-zinc-800" />
            <span className="absolute px-3 text-[10px] font-mono font-bold tracking-wider uppercase bg-white dark:bg-zinc-950 sm:dark:bg-zinc-900 text-slate-400 dark:text-zinc-500">
              {t(language, 'auth.orLinkedIn')}
            </span>
          </div>

          {/* BOTÃO LINKEDIN SEM LOGIN (PADRÃO AAA INTEGRADO COM GOOGLE/GITHUB) */}
          <a
            href="https://br.linkedin.com/in/thaleseverardo"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              onClose();
            }}
            className={`w-full h-11 px-4 rounded-xl border font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs active:scale-[0.98] ${
              theme === 'dark'
                ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700/80 text-zinc-100 hover:border-zinc-600'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            <Linkedin className="w-4 h-4 text-[#0A66C2] shrink-0" />
            <span>{t(language, 'auth.connectLinkedIn')}</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 ml-0.5" />
          </a>

          {/* BLINDAGEM LGPD / GDPR */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-zinc-800/80 text-left space-y-2">
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400 font-sans">
              {t(language, 'auth.lgpdNotice')}
            </p>

            <button
              type="button"
              onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
              className="text-[11px] font-sans font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>{t(language, 'auth.privacyPolicyLink')}</span>
            </button>

            {/* MODAL IN-APP DE POLÍTICA */}
            {showPrivacyPolicy && (
              <div className="p-3 rounded-xl border dark:bg-zinc-950 dark:border-zinc-800 bg-slate-50 border-slate-200 text-[10px] font-sans leading-relaxed space-y-1.5 animate-in fade-in duration-150">
                <div className="font-bold text-slate-900 dark:text-zinc-100">
                  {t(language, 'auth.privacyPolicyTitle')}
                </div>
                <div>{t(language, 'auth.privacyController')}</div>
                <div>{t(language, 'auth.privacyDataCollected')}</div>
                <div>{t(language, 'auth.privacyPurpose')}</div>
                <div>{t(language, 'auth.privacyRetention')}</div>
                <div className="font-semibold text-blue-600 dark:text-cyan-400 pt-0.5">
                  {t(language, 'auth.privacyRights')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
