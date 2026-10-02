import React, { useState } from 'react';
import { X, Mail, Phone, MessageCircle, Linkedin, Lock, ExternalLink, LogOut, Check, Copy } from 'lucide-react';
import { AppLanguage, AppTheme } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { t } from '../../i18n/translations';
import { getTrackingUrl } from '../../utils/trackingLinks';

interface MobileContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  language: AppLanguage;
  theme: AppTheme;
}

export const MobileContactModal: React.FC<MobileContactModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  language,
  theme,
}) => {
  const { isAuthenticated, contact, user, signOut } = useAuth();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const email = contact?.email || '';
  const phone = contact?.phone || '';

  const handleCopy = async (e: React.MouseEvent, text: string, field: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {}
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 md:hidden bg-black/80 flex items-center justify-center p-0 font-sans animate-in fade-in duration-150"
    >
      <div
        className={`w-full h-dvh flex flex-col overflow-hidden ${
          theme === 'dark' ? 'bg-[#09090b] text-zinc-100' : 'bg-white text-zinc-900'
        }`}
      >
        {/* CABEÇALHO SUPERIOR PADRONIZADO COM SAFE-AREA */}
        <div className="px-5 pt-[max(1.125rem,env(safe-area-inset-top,0px))] pb-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-sans font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
              {language === 'PT'
                ? 'Canais de Contato'
                : language === 'ES'
                ? 'Canales de Contacto'
                : language === 'FR'
                ? 'Canaux de Contact'
                : 'Direct Contact Channels'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
              {isAuthenticated
                ? t(language, 'contactModal.authenticatedSubtitle')
                : t(language, 'contactModal.unauthenticatedSubtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label={t(language, 'auth.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CORPO CENTRAL COM ALINHAMENTO E ESPAÇAMENTO REFINADOS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 max-w-md mx-auto w-full">
          {/* 1. LINKEDIN */}
          <a
            href={getTrackingUrl("linkedin", "mobile_modal")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group ${
              theme === 'dark'
                ? 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700 text-zinc-200'
                : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-800 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <Linkedin className="w-5 h-5 text-[#0A66C2] shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                  LinkedIn
                </div>
                <div className="text-[11.5px] font-mono text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                  linkedin.com/in/thaleseverardo
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors shrink-0" />
          </a>

          {/* 2. WHATSAPP */}
          {isAuthenticated && phone ? (
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group ${
                theme === 'dark'
                  ? 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700 text-zinc-200'
                : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-800 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                <MessageCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                    WhatsApp
                  </div>
                  <div className="text-[11.5px] font-mono text-zinc-600 dark:text-zinc-400 truncate mt-0.5">
                    {phone}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handleCopy(e, phone, 'whatsapp')}
                className={`h-7 px-2.5 rounded-lg border text-[11px] font-mono font-medium transition-colors shrink-0 flex items-center gap-1 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-800/90 border-zinc-700/80 hover:bg-zinc-700 text-zinc-300'
                    : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                {copiedField === 'whatsapp' ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Check className="w-3 h-3" />
                    <span>{t(language, 'contactModal.copied')}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 opacity-80">
                    <Copy className="w-3 h-3" />
                    <span>{t(language, 'contactModal.copy')}</span>
                  </span>
                )}
              </button>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer text-left ${
                theme === 'dark'
                  ? 'bg-zinc-900/30 border-zinc-800/70 text-zinc-400'
                  : 'bg-zinc-50/70 border-zinc-200 text-zinc-600'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                <MessageCircle className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 leading-tight">
                    <span>WhatsApp</span>
                    <Lock className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                    {t(language, 'contactModal.tapToUnlock')}
                  </div>
                </div>
              </div>
              <span className="text-xs font-sans font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                {t(language, 'contactModal.unlock')}
              </span>
            </button>
          )}

          {/* 3. E-MAIL DIRETO */}
          {isAuthenticated && email ? (
            <div
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                theme === 'dark'
                  ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-200'
                  : 'bg-white border-zinc-200 text-zinc-800 shadow-2xs'
              }`}
            >
              <a
                href={`mailto:${email}`}
                onClick={onClose}
                className="flex items-center gap-3.5 min-w-0 flex-1 pr-2 cursor-pointer group"
              >
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                    E-mail
                  </div>
                  <div className="text-[11.5px] font-mono text-zinc-600 dark:text-zinc-400 truncate mt-0.5">
                    {email}
                  </div>
                </div>
              </a>

              <button
                type="button"
                onClick={(e) => handleCopy(e, email, 'email')}
                className={`h-7 px-2.5 rounded-lg border text-[11px] font-mono font-medium transition-colors shrink-0 flex items-center gap-1 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-800/90 border-zinc-700/80 hover:bg-zinc-700 text-zinc-300'
                    : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                {copiedField === 'email' ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Check className="w-3 h-3" />
                    <span>{t(language, 'contactModal.copied')}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 opacity-80">
                    <Copy className="w-3 h-3" />
                    <span>{t(language, 'contactModal.copy')}</span>
                  </span>
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer text-left ${
                theme === 'dark'
                  ? 'bg-zinc-900/30 border-zinc-800/70 text-zinc-400'
                  : 'bg-zinc-50/70 border-zinc-200 text-zinc-600'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                <Mail className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 leading-tight">
                    <span>E-mail</span>
                    <Lock className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                    {t(language, 'contactModal.tapToUnlock')}
                  </div>
                </div>
              </div>
              <span className="text-xs font-sans font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                {t(language, 'contactModal.unlock')}
              </span>
            </button>
          )}

          {/* 4. TELEFONE */}
          {isAuthenticated && phone ? (
            <div
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                theme === 'dark'
                  ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-200'
                  : 'bg-white border-zinc-200 text-zinc-800 shadow-2xs'
              }`}
            >
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                onClick={onClose}
                className="flex items-center gap-3.5 min-w-0 flex-1 pr-2 cursor-pointer group"
              >
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                    {language === 'PT' ? 'Telefone' : language === 'ES' ? 'Teléfono' : language === 'FR' ? 'Téléphone' : 'Phone'}
                  </div>
                  <div className="text-[11.5px] font-mono text-zinc-600 dark:text-zinc-400 truncate mt-0.5">
                    {phone}
                  </div>
                </div>
              </a>

              <button
                type="button"
                onClick={(e) => handleCopy(e, phone, 'phone')}
                className={`h-7 px-2.5 rounded-lg border text-[11px] font-mono font-medium transition-colors shrink-0 flex items-center gap-1 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-800/90 border-zinc-700/80 hover:bg-zinc-700 text-zinc-300'
                    : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                {copiedField === 'phone' ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Check className="w-3 h-3" />
                    <span>{t(language, 'contactModal.copied')}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 opacity-80">
                    <Copy className="w-3 h-3" />
                    <span>{t(language, 'contactModal.copy')}</span>
                  </span>
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer text-left ${
                theme === 'dark'
                  ? 'bg-zinc-900/30 border-zinc-800/70 text-zinc-400'
                  : 'bg-zinc-50/70 border-zinc-200 text-zinc-600'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                <Phone className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 leading-tight">
                    <span>{language === 'PT' ? 'Telefone' : language === 'ES' ? 'Teléfono' : language === 'FR' ? 'Téléphone' : 'Phone'}</span>
                    <Lock className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                    {t(language, 'contactModal.tapToUnlock')}
                  </div>
                </div>
              </div>
              <span className="text-xs font-sans font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                {t(language, 'contactModal.unlock')}
              </span>
            </button>
          )}

          {/* 5. CARD ELEGANTE DE SESSÃO DO USUÁRIO INTEGRADO AO FLUXO (SEM VAZIO) */}
          {isAuthenticated && (
            <div
              className={`mt-6 p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                theme === 'dark'
                  ? 'bg-zinc-900/30 border-zinc-800/60 text-zinc-300'
                  : 'bg-zinc-50/80 border-zinc-200/80 text-zinc-700'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold">
                  {t(language, 'contactModal.activeSession')}
                </div>
                <div className="text-xs font-semibold truncate text-zinc-800 dark:text-zinc-200 mt-0.5">
                  {user?.displayName || user?.email}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-500 flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t(language, 'contactModal.signOut')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
