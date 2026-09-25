import React, { useState } from 'react';
import { X, ShieldCheck, LogIn, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { AppLanguage, AppTheme } from '../../types';
import { t } from '../../i18n/translations';
import { useAuth } from '../../hooks/useAuth';
import { signInWithEmail, signUpWithEmail } from '../../services/firebaseAuth';
import { useSoundEffects } from '../../hooks/useSoundEffects';

interface ContactAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  language: AppLanguage;
  theme: AppTheme;
  soundEnabled: boolean;
}

export const ContactAuthModal: React.FC<ContactAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language,
  theme,
  soundEnabled,
}) => {
  const { signInWithGoogle } = useAuth();
  const { play } = useSoundEffects(soundEnabled);

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const error = err as { message?: string };
      setErrorMsg(error?.message || 'Falha na autenticação Google');
      play('alert');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

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
        setErrorMsg('Senha incorreta ou credenciais inválidas.');
      } else if (error?.code === 'auth/user-not-found') {
        setErrorMsg('Usuário não encontrado. Crie seu cadastro.');
      } else if (error?.code === 'auth/email-already-in-use') {
        setErrorMsg('Este e-mail já está cadastrado. Alterne para Entrar.');
      } else if (error?.code === 'auth/weak-password') {
        setErrorMsg('A senha deve conter no mínimo 6 caracteres.');
      } else {
        setErrorMsg(error?.message || 'Erro ao processar autenticação.');
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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border transition-colors ${
          theme === 'dark'
            ? 'bg-zinc-950 border-zinc-800 text-zinc-100 shadow-black/80'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/25'
        }`}
      >
        {/* CABEÇALHO */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600/10 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-mono font-bold">
              {t(language, 'auth.modalTitle')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CORPO */}
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-xs font-sans opacity-75 leading-relaxed">
            {t(language, 'auth.modalSubtitle')}
          </p>

          {errorMsg && (
            <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* BOTÃO GOOGLE OAUTH */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className={`w-full py-2.5 px-4 rounded-xl border font-sans text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer ${
              theme === 'dark'
                ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-100'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>{t(language, 'auth.continueWithGoogle')}</span>
          </button>

          {/* DIVISOR */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t dark:border-zinc-800 border-slate-200" />
            <span
              className={`absolute px-2.5 text-[10px] font-mono uppercase tracking-wider ${
                theme === 'dark' ? 'bg-zinc-950 text-zinc-500' : 'bg-white text-slate-400'
              }`}
            >
              {t(language, 'auth.orEmail')}
            </span>
          </div>

          {/* FORMULÁRIO EMAIL / SENHA */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            <div>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t(language, 'auth.emailPlaceholder')}
                  required
                  className={`w-full pl-9 pr-3 h-9 rounded-lg border text-xs font-mono focus:outline-hidden ${
                    theme === 'dark'
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-cyan-400'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t(language, 'auth.passwordPlaceholder')}
                  required
                  minLength={6}
                  className={`w-full pl-9 pr-3 h-9 rounded-lg border text-xs font-mono focus:outline-hidden ${
                    theme === 'dark'
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-cyan-400'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{mode === 'signin' ? t(language, 'auth.signIn') : t(language, 'auth.signUp')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* ALTERNADOR DE MODO */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
                setErrorMsg(null);
              }}
              className="text-[11px] font-mono text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              {mode === 'signin' ? t(language, 'auth.noAccount') : t(language, 'auth.haveAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
