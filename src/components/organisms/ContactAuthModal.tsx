import React, { useState } from 'react';
import { X, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { AppLanguage, AppTheme } from '../../types';
import { t } from '../../i18n/translations';
import { useAuth } from '../../hooks/useAuth';
import { signInWithEmail, signUpWithEmail } from '../../services/firebaseAuth';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import thalesAvatar from '../../assets/images/thales_avatar_250x250.webp?inline';

interface ContactAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  language: AppLanguage;
  theme: AppTheme;
  soundEnabled: boolean;
}

const GoogleLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const GithubLogo = () => (
  <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export const ContactAuthModal: React.FC<ContactAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language,
  theme,
  soundEnabled,
}) => {
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const { play } = useSoundEffects(soundEnabled);

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setErrorMsg(null);
      await signInWithGoogle();
      play('success');
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
      play('alert');
    }
  };

  const handleGithubLogin = async () => {
    try {
      setErrorMsg(null);
      await signInWithGithub();
      play('success');
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
      play('alert');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Validação de confirmação de senha apenas no cadastro quando a senha estiver oculta
    if (mode === 'signup' && !showPassword) {
      if (password !== confirmPassword) {
        setErrorMsg(t(language, 'auth.errorPasswordMismatch'));
        play('alert');
        return;
      }
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      play('success');
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error?.code === 'auth/wrong-password' || error?.code === 'auth/invalid-credential') {
        setErrorMsg(t(language, 'auth.errorWrongPassword'));
      } else if (error?.code === 'auth/user-not-found') {
        setErrorMsg(t(language, 'auth.errorUserNotFound'));
      } else if (error?.code === 'auth/email-already-in-use') {
        setErrorMsg(t(language, 'auth.errorEmailInUse'));
      } else if (error?.code === 'auth/weak-password') {
        setErrorMsg(t(language, 'auth.errorWeakPassword'));
      } else if (error?.code === 'auth/invalid-email') {
        setErrorMsg(t(language, 'auth.errorInvalidEmail'));
      } else {
        setErrorMsg(t(language, 'auth.errorGeneric'));
      }
      play('alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 overflow-y-auto font-sans animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full min-h-[100dvh] sm:min-h-0 sm:h-auto sm:max-w-[420px] rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl flex flex-col justify-center overflow-y-auto border-0 sm:border transition-all relative ${
          theme === 'dark'
            ? 'bg-zinc-950 sm:bg-zinc-900 border-zinc-800 text-zinc-100 shadow-black/80'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/40'
        }`}
      >
        {/* BOTÃO FECHAR FIXO NO TOPO DIREITO */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer active:scale-95 z-20"
          aria-label={t(language, 'auth.close')}
        >
          <X className="w-5 h-5 sm:w-4 sm:h-4" />
        </button>

        {/* CONTEÚDO INTEGRADO E CENTRALIZADO NO MOBILE */}
        <div className="w-full max-w-sm mx-auto p-6 sm:p-8 my-auto flex flex-col justify-center">
          {/* CABEÇALHO COM AVATAR */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-14 h-14 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-slate-200 dark:border-zinc-700 shadow-xs mb-3">
              <img
                src={thalesAvatar}
                alt="Thales Everardo"
                width={56}
                height={56}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h2 className="text-xl sm:text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              {t(language, 'auth.modalTitle')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-xs leading-relaxed">
              {t(language, 'auth.modalSubtitle')}
            </p>
          </div>

          {/* CORPO DO FORMULÁRIO */}
          <div className="mt-6 space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-xl border border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {/* BOTÕES SOCIAIS DE 1 CLIQUE (GOOGLE & GITHUB) */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className={`w-full h-11 px-4 rounded-xl border font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-3 cursor-pointer shadow-2xs active:scale-[0.98] ${
                  theme === 'dark'
                    ? 'bg-zinc-900/90 hover:bg-zinc-800/90 border-zinc-800 hover:border-zinc-700 text-zinc-100 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                <GoogleLogo />
                <span>{t(language, 'auth.continueWithGoogle')}</span>
              </button>

              <button
                type="button"
                onClick={handleGithubLogin}
                className={`w-full h-11 px-4 rounded-xl border font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-3 cursor-pointer shadow-2xs active:scale-[0.98] ${
                  theme === 'dark'
                    ? 'bg-zinc-900/90 hover:bg-zinc-800/90 border-zinc-800 hover:border-zinc-700 text-zinc-100 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                <GithubLogo />
                <span>{t(language, 'auth.continueWithGithub')}</span>
              </button>
            </div>

            {/* DIVISOR DISCRETO */}
            <div className="relative flex items-center justify-center my-3.5">
              <div className="w-full border-t border-slate-200 dark:border-zinc-800" />
              <span
                className={`absolute px-3 text-[11px] font-medium ${
                  theme === 'dark' ? 'bg-zinc-950 sm:bg-zinc-900 text-zinc-500' : 'bg-white text-slate-400'
                }`}
              >
                {t(language, 'auth.orEmailPassword')}
              </span>
            </div>

            {/* FORMULÁRIO DE E-MAIL E SENHA */}
            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  {t(language, 'auth.emailLabel')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t(language, 'auth.emailPlaceholder')}
                  required
                  className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-hidden ${
                    theme === 'dark'
                      ? 'bg-zinc-900/80 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:bg-zinc-950 shadow-inner'
                      : 'bg-slate-50 hover:bg-white border-slate-300/90 hover:border-slate-400 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 focus:bg-white shadow-2xs'
                  }`}
                />
              </div>

              {/* CAMPO SENHA PRINCIPAL */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    {t(language, 'auth.passwordLabel')}
                  </label>
                  {mode === 'signup' && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700/60">
                      {t(language, 'auth.passwordHint')}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t(language, 'auth.passwordPlaceholder')}
                    required
                    minLength={6}
                    className={`w-full h-11 pl-3.5 pr-11 rounded-xl border text-sm transition-all focus:outline-hidden ${
                      theme === 'dark'
                        ? 'bg-zinc-900/80 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:bg-zinc-950 shadow-inner'
                        : 'bg-slate-50 hover:bg-white border-slate-300/90 hover:border-slate-400 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 focus:bg-white shadow-2xs'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-none"
                    tabIndex={-1}
                    aria-label={showPassword ? t(language, 'auth.hidePassword') : t(language, 'auth.showPassword')}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* CAMPO DE CONFIRMAÇÃO DE SENHA (APENAS CADASTRO COM SENHA OCULTA) */}
              {mode === 'signup' && !showPassword && (
                <div className="animate-in fade-in slide-in-from-top-1.5 duration-200">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                    {t(language, 'auth.confirmPasswordLabel')}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t(language, 'auth.confirmPasswordPlaceholder')}
                    required
                    minLength={6}
                    className={`w-full h-11 px-3.5 rounded-xl border text-sm transition-all focus:outline-hidden ${
                      theme === 'dark'
                        ? 'bg-zinc-900/80 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:bg-zinc-950 shadow-inner'
                        : 'bg-slate-50 hover:bg-white border-slate-300/90 hover:border-slate-400 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 focus:bg-white shadow-2xs'
                    }`}
                  />
                </div>
              )}

              {/* BOTÃO PRIMÁRIO COM GRADIENTE, ANEL ESPECULAR E SOMBRA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-900/25 ring-1 ring-inset ring-white/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 active:scale-[0.98]"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{mode === 'signin' ? t(language, 'auth.signIn') : t(language, 'auth.signUp')}</span>
              </button>
            </form>

            {/* ALTERNADOR DE MODO (PERGUNTA EM CINZA + AÇÃO EM DESTAQUE) */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
                  setErrorMsg(null);
                  setConfirmPassword('');
                }}
                className="text-xs font-medium text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-zinc-200"
              >
                <span>{mode === 'signin' ? t(language, 'auth.noAccount').split('?')[0] + '?' : t(language, 'auth.haveAccount').split('?')[0] + '?'}</span>
                <span className="font-semibold text-blue-600 dark:text-cyan-400 hover:underline">
                  {mode === 'signin' ? t(language, 'auth.noAccount').split('?')[1] : t(language, 'auth.haveAccount').split('?')[1]}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
