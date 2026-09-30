import React, { useState, useEffect } from 'react';
import {
  Printer,
  Copy,
  Check,
  Mail,
  Phone,
  MapPin,
  Download,
  Share2,
  Linkedin,
  MessageCircle,
  Link as LinkIcon,
  ExternalLink,
  Globe,
  ChevronDown,
  Lock,
  Unlock,
  LogIn,
  FileText,
  FileCode,
  FileCheck,
} from 'lucide-react';
import { CURRICULUM_NODES, PROFILE_DATA } from '../../data/curriculumData';
import { AppLanguage, AppTheme } from '../../types';
import { t, getNodeContent } from '../../i18n/translations';
import { useAuth } from '../../hooks/useAuth';
import { logAnalyticsEvent } from '../../services/firebaseAuth';
import {
  getProfileTitle,
  getProfileLocation,
  getProfileSummary,
  generateMarkdownResume,
  getLanguagesSummary,
  getLanguagesLabel,
} from '../../utils/resumeGenerator';

interface ResumeViewProps {
  language: AppLanguage;
  theme: AppTheme;
  onOpenContact?: () => void;
  onOpenPrivacy?: () => void;
}

export const ResumeView: React.FC<ResumeViewProps> = ({
  language,
  theme,
  onOpenContact,
  onOpenPrivacy,
}) => {
  const { isAuthenticated, contact, signInWithGoogle } = useAuth();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [emailCopiedFeedback, setEmailCopiedFeedback] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const email = contact?.email || '';
  const phone = contact?.phone || '';

  useEffect(() => {
    logAnalyticsEvent('cv_view', { language });
  }, [language]);

  const handlePrint = () => {
    window.print();
  };

  const getAbsoluteDocUrl = (extension: 'pdf' | 'txt' | 'md' = 'pdf') => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const filename = `Thales_Everardo_CV_${language}.${extension}`;
    const relativePath = `${base}/resumes/${filename}`;
    if (typeof window !== 'undefined') {
      return new URL(relativePath, window.location.origin).href;
    }
    return relativePath;
  };

  const downloadStaticFile = (extension: 'pdf' | 'txt' | 'md') => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const filename = `Thales_Everardo_CV_${language}.${extension}`;
    const fileUrl = `${base}/resumes/${filename}`;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAnalyticsEvent('cv_download', { extension, language });

    setShowDownloadMenu(false);
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(generateMarkdownResume(language, isAuthenticated, email, phone));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignora falha de permissão sem gerar falso positivo
    }
  };

  const handleCopyPdfLink = async () => {
    const pdfUrl = getAbsoluteDocUrl('pdf');
    try {
      await navigator.clipboard.writeText(pdfUrl);
      setCopiedLink(true);
      setTimeout(() => {
        setCopiedLink(false);
        setShowShareMenu(false);
      }, 1800);
    } catch {
      setShowShareMenu(false);
    }
  };

  const handleShareWhatsApp = () => {
    const pdfUrl = getAbsoluteDocUrl('pdf');
    const msg = `${t(language, 'resume.shareWhatsAppMsg')}${pdfUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const handleShareLinkedIn = () => {
    const pdfUrl = getAbsoluteDocUrl('pdf');
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pdfUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setShowShareMenu(false);
  };

  const handleShareEmail = async () => {
    const pdfUrl = getAbsoluteDocUrl('pdf');
    const subject = t(language, 'resume.shareEmailSubject');
    const body = t(language, 'resume.shareEmailBody').replace('{url}', pdfUrl);

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const anchor = document.createElement('a');
    anchor.href = mailtoUrl;
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    try {
      await navigator.clipboard.writeText(pdfUrl);
      setEmailCopiedFeedback(true);
      setTimeout(() => {
        setEmailCopiedFeedback(false);
        setShowShareMenu(false);
      }, 1800);
    } catch {
      setShowShareMenu(false);
    }
  };

  const handleNativeShare = async () => {
    const pdfUrl = getAbsoluteDocUrl('pdf');
    const title = `Thales Everardo - CV (${language})`;
    const text = `${PROFILE_DATA.name} - ${getProfileTitle(language)}`;

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title, text, url: pdfUrl });
        setShowShareMenu(false);
      }
    } catch {}
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-6 pt-3 pb-20 sm:py-8 flex-1 animate-in fade-in duration-200 print:p-0 print:m-0 print:max-w-none print:w-full print:block">
      {/* 1. BARRA SUPERIOR DE AÇÕES EXECUTIVAS */}
      <div className="mb-6 flex items-center justify-end gap-2 print:hidden select-none">
        {/* GRUPO DE UTILITÁRIOS: COPIAR MARKDOWN + IMPRIMIR + COMPARTILHAR */}
        <div
          className={`flex items-center h-9 rounded-xl border overflow-hidden divide-x ${
            theme === 'dark'
              ? 'bg-zinc-950 border-zinc-800 divide-zinc-800 text-zinc-300'
              : 'bg-white border-zinc-200 divide-zinc-200 text-zinc-700 shadow-2xs'
          }`}
        >
          {/* COPIAR MARKDOWN */}
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="h-full px-2.5 sm:px-3 flex items-center gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-xs font-mono"
            title={copied ? t(language, 'resume.copied') : t(language, 'resume.copy')}
            aria-label={t(language, 'resume.copy')}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
            <span className="hidden sm:inline font-medium">
              {copied ? t(language, 'resume.copied') : 'Markdown'}
            </span>
          </button>

          {/* IMPRIMIR (EXCLUSIVO PARA DESKTOP) */}
          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:flex h-full px-2.5 sm:px-3 items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title={t(language, 'resume.print')}
            aria-label={t(language, 'resume.print')}
          >
            <Printer className="w-3.5 h-3.5 opacity-70" />
          </button>

          {/* COMPARTILHAR */}
          <div className="relative h-full flex items-center">
            <button
              type="button"
              onClick={() => {
                setShowShareMenu((prev) => !prev);
                setShowDownloadMenu(false);
              }}
              className={`h-full px-2.5 sm:px-3 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer ${
                showShareMenu ? 'bg-zinc-200 dark:bg-zinc-900 text-blue-600 dark:text-blue-400' : ''
              }`}
              title={t(language, 'resume.shareResume')}
              aria-expanded={showShareMenu}
            >
              <Share2 className="w-3.5 h-3.5 opacity-70" />
            </button>

            {showShareMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
                <div className="absolute top-full right-0 mt-2 w-54 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 font-mono text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2 text-[10px] font-bold opacity-60 uppercase border-b border-zinc-100 dark:border-zinc-800 tracking-wider">
                    {t(language, 'resume.shareResume')}
                  </div>
                  <button
                    onClick={handleShareWhatsApp}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={handleShareLinkedIn}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Linkedin className="w-4 h-4 text-[#0A66C2] shrink-0" />
                    <span>LinkedIn</span>
                  </button>
                  <button
                    onClick={handleShareEmail}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>E-mail</span>
                    </span>
                    {emailCopiedFeedback && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {t(language, 'resume.linkCopied')}
                      </span>
                    )}
                  </button>
                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <button
                      onClick={handleNativeShare}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2.5 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span>{t(language, 'resume.otherApps')}</span>
                    </button>
                  )}
                  <button
                    onClick={handleCopyPdfLink}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-800 dark:text-zinc-200 flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      {copiedLink ? (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <LinkIcon className="w-4 h-4 opacity-60 shrink-0" />
                      )}
                      <span className="truncate">
                        {copiedLink
                          ? t(language, 'resume.linkCopied')
                          : t(language, 'resume.copyPdfLink')}
                      </span>
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CTA PRIMÁRIO: BAIXAR MULTIFORMATO */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowDownloadMenu((prev) => !prev);
              setShowShareMenu(false);
            }}
            className="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-900/20 ring-1 ring-inset ring-white/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
            title={t(language, 'resume.staticDownload')}
            aria-expanded={showDownloadMenu}
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {language === 'PT'
                ? 'Baixar'
                : language === 'ES'
                ? 'Descargar'
                : language === 'FR'
                ? 'Télécharger'
                : 'Download'}
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
          </button>

          {showDownloadMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDownloadMenu(false)} />
              <div className="absolute top-full right-0 mt-2.5 w-64 rounded-2xl border border-zinc-200/90 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl shadow-2xl shadow-black/70 overflow-hidden z-50 font-sans animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2.5 text-[11px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase border-b border-zinc-100 dark:border-white/5">
                  {t(language, 'resume.staticDownload')}
                </div>
                <div className="p-1.5 space-y-1">
                  <button
                    onClick={() => downloadStaticFile('pdf')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{t(language, 'resume.formatPdfTitle')}</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{t(language, 'resume.formatPdfSub')}</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => downloadStaticFile('txt')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{t(language, 'resume.formatTxtTitle')}</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{t(language, 'resume.formatTxtSub')}</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => downloadStaticFile('md')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <FileCode className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{t(language, 'resume.formatMdTitle')}</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{t(language, 'resume.formatMdSub')}</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. BLOCO MODULAR DE CONTATO (NÍVEL WORKSPACE APP, FORA DO CURRÍCULO) */}
      {!isAuthenticated && (
        <div
          data-nosnippet="true"
          className={`mb-6 rounded-xl border divide-y overflow-hidden transition-all print:hidden ${
            theme === 'dark'
              ? 'bg-zinc-950/80 border-zinc-800 divide-zinc-800/80 text-zinc-200 shadow-xs'
              : 'bg-white border-zinc-200 divide-zinc-200 text-zinc-800 shadow-xs'
          }`}
        >
          {/* CABEÇALHO DO BLOCO: TÍTULO EXECUTIVO REFINADO */}
          <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between">
            <h2 className="font-sans font-semibold text-xs text-zinc-900 dark:text-zinc-100 tracking-tight">
              {t(language, 'resume.gateTitle')}
            </h2>
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">{t(language, 'resume.directLine')}</span>
          </div>

          {/* LINHA 1: LINKEDIN COM CADEADO ABERTO (CANAL LIVRE / PÚBLICO) */}
          <div className="p-3.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2.5 pr-2 min-w-0">
              <Unlock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 sm:mt-0" strokeWidth={1.8} />
              <p className="font-sans text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {t(language, 'resume.gateRow1')}
              </p>
            </div>
            <a
              href="https://br.linkedin.com/in/thaleseverardo"
              target="_blank"
              rel="noopener noreferrer"
              className={`h-8 px-3 rounded-lg border font-sans font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs active:scale-95 ${
                theme === 'dark'
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700/80 text-zinc-200 hover:text-white'
                  : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-zinc-900'
              }`}
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] shrink-0" />
              <span>{t(language, 'auth.connectLinkedIn')}</span>
              <ExternalLink className="w-3 h-3 text-zinc-400 dark:text-zinc-500 opacity-60 ml-0.5 shrink-0" />
            </a>
          </div>

          {/* LINHA 2: LOGIN COM CADEADO FECHADO (CANAL PROTEGIDO POR CREDENCIAIS) */}
          <div className="p-3.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2.5 pr-2 min-w-0">
              <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 sm:mt-0" strokeWidth={1.8} />
              <p className="font-sans text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {t(language, 'resume.gateRow2')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onOpenContact) onOpenContact();
                else signInWithGoogle();
              }}
              className="h-8 px-3.5 rounded-lg font-sans text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t(language, 'resume.gateButton')}</span>
            </button>
          </div>

          {/* RODAPÉ DO BLOCO: PRIVACIDADE & LGPD */}
          <div className="px-4 py-2 bg-zinc-50/60 dark:bg-zinc-900/30 flex items-center justify-end text-[11px] font-sans text-zinc-400 dark:text-zinc-500">
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="font-medium hover:text-zinc-700 dark:hover:text-zinc-300 hover:underline transition-colors cursor-pointer"
            >
              {t(language, 'footer.privacyLink')}
            </button>
          </div>
        </div>
      )}

      {/* 3. CORPO DO CV TIMBRADO (CONTAINER PURO DO DOCUMENTO EXECUTIVO - PADRÃO WYSIWYG) */}
      <article
        id="printable-resume-card"
        className={`w-full cv-sheet-font leading-relaxed text-[13px] print:border-none print:shadow-none print:p-0 print:m-0 print:text-black p-5 sm:p-10 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-[#0c0c0f]/80 border-zinc-800/80 text-zinc-200 shadow-xs'
            : 'bg-white border-zinc-200/90 text-zinc-800 shadow-xs'
        }`}
      >
        {/* CABEÇALHO DO CURRÍCULO (PADRÃO EXECUTIVO WYSIWYG: TELA & IMPRESSÃO IDÊNTICAS) */}
        <div className="border-b pb-4 sm:pb-5 mb-5 dark:border-zinc-800 border-zinc-200 print:border-zinc-300 print:pb-3 print:mb-3.5 overflow-hidden">
          <h1 className="text-[clamp(0.95rem,4.3vw,1.65rem)] font-bold tracking-tight whitespace-nowrap text-zinc-900 dark:text-zinc-100 leading-tight print:text-black">
            {PROFILE_DATA.name.toUpperCase()}
          </h1>
          <div className="text-[clamp(0.68rem,2.8vw,0.875rem)] font-medium text-zinc-700 dark:text-zinc-300 mt-1 whitespace-nowrap tracking-tight leading-tight print:text-zinc-800 print:text-[10pt]">
            {getProfileTitle(language)}
          </div>

          {/* LOCALIZAÇÃO E STATUS DE RESIDÊNCIA CANADENSE */}
          <div className="mt-2.5 flex items-start gap-1.5 text-xs font-sans text-zinc-700 dark:text-zinc-300 leading-snug print:text-[9pt] print:mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5 print:text-zinc-600" />
            <span className="font-medium">{getProfileLocation(language)}</span>
          </div>

          {/* 1. LINHA DE CONTATOS INTERATIVA (EXCLUSIVA DE TELA, OCULTA NA IMPRESSÃO) */}
          <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-y-1.5 sm:gap-x-2.5 text-xs font-sans text-zinc-600 dark:text-zinc-400 print:hidden">
            {/* Bloco 1: Contatos Diretos */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              {isAuthenticated ? (
                <>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors group cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                    <span className="hover:underline font-medium select-all">{email || t(language, 'resume.loading')}</span>
                  </a>
                  <span className="text-zinc-300 dark:text-zinc-700 select-none">|</span>
                  <a
                    href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors group cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                    <span className="hover:underline font-medium select-all">{phone || t(language, 'resume.loading')}</span>
                  </a>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => (onOpenContact ? onOpenContact() : signInWithGoogle())}
                    className="group inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer text-left"
                    title={t(language, 'resume.gateTitle')}
                  >
                    <Mail className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                    <span className="tracking-wide select-none font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200">
                      thales••••••@•••••.com
                    </span>
                    <Lock className="w-3 h-3 text-zinc-400/80 dark:text-zinc-500/80 shrink-0" />
                  </button>
                  <span className="text-zinc-300 dark:text-zinc-700 select-none">|</span>
                  <button
                    type="button"
                    onClick={() => (onOpenContact ? onOpenContact() : signInWithGoogle())}
                    className="group inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer text-left"
                    title={t(language, 'resume.gateTitle')}
                  >
                    <Phone className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                    <span className="tracking-wide select-none font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200">
                      +55 11 9••••-••••
                    </span>
                    <Lock className="w-3 h-3 text-zinc-400/80 dark:text-zinc-500/80 shrink-0" />
                  </button>
                </>
              )}
            </div>

            <span className="text-zinc-300 dark:text-zinc-700 select-none hidden sm:inline">|</span>

            {/* Bloco 2: Perfis Profissionais */}
            <div className="flex items-center gap-x-2.5">
              <a
                href="https://br.linkedin.com/in/thaleseverardo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] shrink-0" />
                <span className="hover:underline">LinkedIn</span>
              </a>
              <span className="text-zinc-300 dark:text-zinc-700 select-none">|</span>
              <a
                href="https://github.com/thaleseverardo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                <span className="hover:underline">GitHub</span>
              </a>
            </div>
          </div>

          {/* 2. LINHA DE CONTATOS DEDICADA PARA IMPRESSÃO / PDF (CONTATOS REAIS + ZERO PIPES DUPLOS) */}
          <div className="hidden print:flex flex-wrap items-center gap-x-2 gap-y-1 text-[9pt] font-sans text-zinc-700 mt-1.5">
            <span className="inline-flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              <span>{email || 'thales••••••@•••••.com'}</span>
            </span>
            <span className="text-zinc-400 select-none">|</span>
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              <span>{phone || '+55 11 9••••-••••'}</span>
            </span>
            <span className="text-zinc-400 select-none">|</span>
            <span className="inline-flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              <span>linkedin.com/in/thaleseverardo</span>
            </span>
            <span className="text-zinc-400 select-none">|</span>
            <span className="inline-flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              <span>github.com/thaleseverardo</span>
            </span>
          </div>

          {/* DESTAQUE DE IDIOMAS & EXPERIÊNCIA CORPORATIVA (TEXTUAL CONTINUO) */}
          <div className="mt-2 text-xs font-sans text-zinc-600 dark:text-zinc-400 leading-normal print:text-[8.8pt] print:text-zinc-700 print:mt-1.5">
            <strong className="font-semibold text-zinc-800 dark:text-zinc-200 print:text-zinc-900">{getLanguagesLabel(language)}:</strong>{' '}
            <span>{getLanguagesSummary(language)}</span>
          </div>
        </div>

        {/* RESUMO PROFISSIONAL */}
        <div className="mb-6 space-y-2.5">
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider border-b pb-1.5 dark:border-zinc-800 border-zinc-200 text-zinc-900 dark:text-zinc-100 print:text-black">
            {t(language, 'resume.executiveSummary')}
          </h2>
          <p className="text-sm leading-relaxed font-sans text-zinc-700 dark:text-zinc-300 cv-justified-text">
            {getProfileSummary(language)}
          </p>
        </div>

        {/* EXPERIÊNCIA PROFISSIONAL — ORDEM CRONOLÓGICA REVERSA MATEMÁTICA ESTREITA */}
        <div className="mb-5 space-y-4">
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider border-b pb-1.5 dark:border-zinc-800 border-zinc-200 text-zinc-900 dark:text-zinc-100 print:text-black">
            {t(language, 'resume.coreExperience')}
          </h2>

          {(() => {
            // Algoritmo matemático de pontuação temporal baseado no término do período
            const parsePeriodEndScore = (periodStr: string): number => {
              if (!periodStr) return 0;
              const p = periodStr.toLowerCase();

              // Cargos vigentes (Presente / Atual) têm prioridade máxima absoluta
              if (
                p.includes('present') ||
                p.includes('atual') ||
                p.includes('présent') ||
                p.includes('actualidad')
              ) {
                return 99999999;
              }

              // Extrair todos os anos de 4 dígitos presentes no período
              const years = periodStr.match(/\b(20\d\d|19\d\d)\b/g);
              if (!years || years.length === 0) return 19900000;

              // O ano final é o último ano encontrado na string do período
              const endYear = parseInt(years[years.length - 1], 10);
              const startYear = parseInt(years[0], 10);

              // Mapeamento multilíngue de meses para ordenação precisa
              const monthMap: Record<string, number> = {
                jan: 1, ene: 1,
                feb: 2, fev: 2,
                mar: 3,
                apr: 4, abr: 4, avr: 4,
                may: 5, mai: 5,
                jun: 6,
                jul: 7,
                aug: 8, ago: 8, aou: 8,
                sep: 9, set: 9,
                oct: 10, out: 10,
                nov: 11,
                dec: 12, dez: 12, dic: 12
              };

              // Localizar o mês correspondente ao término (após o hífen/separador)
              let endMonth = 12;
              const periodParts = periodStr.split(/[-–—]/);
              const endPart = (periodParts.length > 1 ? periodParts[1] : periodParts[0]).toLowerCase();

              // Suporte a formatos numéricos (ex: 02/2024 ou 2/2024)
              const numMatch = endPart.match(/\b(0?[1-9]|1[0-2])\/\d{4}\b/);
              if (numMatch) {
                endMonth = parseInt(numMatch[1], 10);
              } else {
                for (const [mName, mNum] of Object.entries(monthMap)) {
                  if (endPart.includes(mName)) {
                    endMonth = mNum;
                    break;
                  }
                }
              }

              // Score composto: (AnoFinal * 10000) + (MêsFinal * 100) + (AnoInicial % 100)
              return endYear * 10000 + endMonth * 100 + (startYear % 100);
            };

            // Filtrar fundações puramente acadêmicas para manter apenas histórico corporativo formal
            const professionalNodes = CURRICULUM_NODES.filter((node) => {
              const id = node.id.toLowerCase();
              const comp = node.company.toLowerCase();
              const role = node.role.toLowerCase();

              return !(
                id.includes('academic') ||
                id.includes('foundation') ||
                comp.includes('cruzeiro') ||
                comp.includes('university') ||
                comp.includes('estácio') ||
                comp.includes('senai') ||
                role.includes('game developer & computer scientist') ||
                role.includes('desenvolvedor de jogos & cientista')
              );
            }).sort((a, b) => {
              const scoreA = parsePeriodEndScore(a.period);
              const scoreB = parsePeriodEndScore(b.period);
              return scoreB - scoreA;
            });

            return professionalNodes.map((node) => {
              const content = getNodeContent(node, language);
              const isCanadianEN = language === 'EN';

              // Textos nativos garantidos para Francês e Espanhol
              let roleText = content.role;
              let roiText = content.businessValue;
              let featText = content.engineeringFeat;
              let solText = content.architecturalSolution;

              const compLower = node.company.toLowerCase();
              const roleLower = node.role.toLowerCase();

              if (language === 'ES') {
                if (compLower.includes('magalu')) {
                  roleText = 'Staff Software Engineer y Arquitecto de Sistemas';
                  roiText = 'Cero bloqueos en producción y mitigación total de riesgos de indisponibilidad durante cierres fiscales críticos.';
                  featText = 'Purga asíncrona particionada de 11TB de logs transaccionales en SQL Server sin bloqueos transaccionales en caliente.';
                  solText = 'Construcción de pipeline desacoplado en lotes dinámicos con monitoreo de telemetría de buffers de log y control de presión.';
                } else if (compLower.includes('gps')) {
                  roleText = 'Ingeniero de Software Senior';
                  roiText = 'Reducción del 99,8% en el tiempo de procesamiento contable y liquidación de nóminas corporativas.';
                  featText = 'Reducción de la latencia del pipeline de cálculo financiero de 7 días a solo 20 minutos con consistencia total.';
                  solText = 'Optimización profunda de índices agrupados, particionamiento de tablas históricas y paralelización asíncrona en C#.';
                } else if (compLower.includes('summerhill') && (roleLower.includes('system') || roleLower.includes('gerente') || roleLower.includes('dba'))) {
                  roleText = 'Gerente de Sistemas de TI, Ingeniero de Soluciones y DBA';
                  roiText = 'Gobernanza tecnológica unificada en 5 tiendas físicas con facturación íntegra en más de 500.000 transacciones mensuales y 30.000 SKUs.';
                  featText = 'Implementó plan de Disaster Recovery (DR/BCP) con recuperación total de 1 mes de datos críticos en 24 horas y sincronización POS/ERP en tiempo real.';
                  solText = 'Desarrollo de microservicios y APIs RESTful en C#/.NET conectando el catálogo GS1 al ERP con sincronización en tiempo real.';
                } else if (compLower.includes('summerhill')) {
                  roleText = 'Líder de Operaciones y Optimización de Procesos';
                  roiText = 'Reducción del 70% en el descarte de materia prima y aumento de la capacidad de producción en un 50% sin nuevas contrataciones.';
                  featText = 'Aplicó conceptos formales de ingeniería de software (Teoría de Colas y flujo Just-in-Time) directamente a la logística de producción física.';
                  solText = 'Modelado predictivo de demanda con datos históricos de ventas y estandarización de pipelines de producción por lotes.';
                } else if (compLower.includes('ambar')) {
                  roleText = 'Ingeniero de Software Especialista';
                  roiText = 'Sincronización en tiempo real de catálogos e inventarios en 5 centros de distribución sin pérdida de pedidos.';
                  featText = 'Broker de mensajería estándar GS1 que conecta ERP central y terminales de punto de venta POS en tiempo real.';
                  solText = 'Patrón Transactional Outbox con RabbitMQ y almacenamiento local idempotente con tolerancia a desconexión.';
                } else if (compLower.includes('altitude') || compLower.includes('ultra')) {
                  roleText = 'Ingeniero de Software / Analista Desarrollador';
                  roiText = 'Recuperación de 11 Terabytes de almacenamiento en servidores de producción al 99% de capacidad, evitando costos masivos de hardware.';
                  featText = 'Reducción del tiempo de ejecución de un proceso crítico mensual de 1 mes a solo 2 horas (ganancia del 99,7%).';
                  solText = 'Expurgo transaccional particionado de datos históricos desindexados con 100% de integridad referencial y módulos en ASP.NET / T-SQL.';
                } else if (compLower.includes('atento')) {
                  roleText = 'Ingeniero de Soporte Técnico III y Arquitecto de Automatización';
                  roiText = 'Garantizó el 99,98% de disponibilidad operativa en atención corporativa; redujo indisponibilidades en un 97% con ahorro superior a US$ 500.000.';
                  featText = 'Estabilizó pipelines de ingestión continua para más de 100.000 registros diarios de voz y telefonía sin pérdida de paquetes.';
                  solText = 'Gestión de tráfico masivo de voz y datos, optimización LAN/WAN y SIP/VoIP, y automatización con scripts ETL hacia SQL.';
                }
              } else if (language === 'FR') {
                if (compLower.includes('magalu')) {
                  roleText = 'Staff Software Engineer & Architecte Systèmes';
                  roiText = 'Zéro verrouillage en production et élimination des risques de panne lors des clôtures fiscales critiques.';
                  featText = 'Purge asynchrone partitionnée de 11 To de journaux sur SQL Server sans lock escalations en production.';
                  solText = 'Conception d\'un pipeline découplé par lots dynamiques avec surveillance télémétrique de la pression des journaux.';
                } else if (compLower.includes('gps')) {
                  roleText = 'Ingénieur Logiciel Senior';
                  roiText = 'Réduction de 99,8% du temps de traitement comptable et de règlement de paie multi-entités.';
                  featText = 'Réduction de la latence du pipeline de calcul financier de 7 jours à 20 minutes avec cohérence absolue.';
                  solText = 'Optimisation approfondie des index, partitionnement des tables historiques et parallélisation asynchrone en C#.';
                } else if (compLower.includes('summerhill') && (roleLower.includes('system') || roleLower.includes('gerente') || roleLower.includes('dba'))) {
                  roleText = 'Responsable des Systèmes IT, Ingénieur Solutions & DBA';
                  roiText = 'Gouvernance technologique unifiée sur 5 magasins physiques avec facturation intègre sur plus de 500 000 transactions mensuelles et 30 000 SKUs.';
                  featText = 'Mise en œuvre d\'un plan de reprise après sinistre (DR/BCP) avec restauration intégrale d\'un mois de données critiques en 24 heures.';
                  solText = 'Développement de microservices et d\'APIs RESTful en C#/.NET reliant le catalogue GS1 à l\'ERP avec synchronisation en temps réel.';
                } else if (compLower.includes('summerhill')) {
                  roleText = 'Responsable Opérations & Optimisation des Processus';
                  roiText = 'Réduction de 70% du gaspillage de matières premières et augmentation de 50% de la capacité de production sans nouveaux recrutements.';
                  featText = 'Application directe des principes d\'ingénierie logicielle (Théorie des files d\'attente et Just-in-Time) à la logistique physique.';
                  solText = 'Modélisation prédictive de la demande basée sur les historiques de ventes et standardisation des flux de production par lots.';
                } else if (compLower.includes('ambar')) {
                  roleText = 'Ingénieur Logiciel Spécialiste';
                  roiText = 'Synchronisation en temps réel des catalogues et stocks sur 5 centres de distribution sans aucune perte de commande.';
                  featText = 'Broker de messagerie au standard GS1 reliant ERP central et points de vente POS en temps réel.';
                  solText = 'Pattern Transactional Outbox avec files RabbitMQ et persistance locale idempotente tolérante aux pannes.';
                } else if (compLower.includes('altitude') || compLower.includes('ultra')) {
                  roleText = 'Ingénieur Logiciel / Développeur Analyste';
                  roiText = 'Récupération de 11 To de stockage sur des serveurs de production saturés à 99%, évitant des coûts massifs d\'infrastructure.';
                  featText = 'Réduction du temps d\'exécution d\'un processus critique mensuel de 1 mois à seulement 2 heures (gain de 99,7%).';
                  solText = 'Purge transactionnelle partitionnée de données historiques désindexées avec intégrité référentielle à 100% et modules en ASP.NET / T-SQL.';
                } else if (compLower.includes('atento')) {
                  roleText = 'Ingénieur Support Technique III & Architecte Automatisation';
                  roiText = 'Garantie de 99,98% de disponibilité opérationnelle; réduction des interruptions de 97% générant plus de 500 000 $ d\'économies.';
                  featText = 'Conception et stabilisation de pipelines d\'ingestion continue de plus de 100 000 enregistrements quotidiens de voix sans perte de paquets.';
                  solText = 'Gestion du trafic massif voix/données, optimisation LAN/WAN et SIP/VoIP, et automatisation de scripts ETL vers SQL.';
                }
              }

              return (
                <div key={node.id} className="space-y-1 text-xs sm:text-[13px]">
                  {/* Cabeçalho do Cargo: Empresa, Badge de País, Cargo e Período */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-bold gap-1 sm:gap-4">
                    <div className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 print:text-black leading-snug">
                      <span className="inline-flex items-center gap-1.5 mr-2 font-bold">
                        <span>{node.company}</span>
                        <span
                          className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold tracking-wider uppercase border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 select-none"
                          title={node.location}
                        >
                          {node.location.toLowerCase().includes('canada') || node.company.toLowerCase().includes('summerhill') ? 'CA' : 'BR'}
                        </span>
                      </span>
                      <span className="opacity-40 font-normal mr-1.5">—</span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium print:text-black">
                        {roleText}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] opacity-70 shrink-0 sm:pt-0.5">
                      {node.period} · {node.location}
                    </span>
                  </div>

                  {isCanadianEN ? (
                    /* =========================================================
                       PADRÃO CANADENSE / NORTE-AMERICANO (BULLET POINTS DE AÇÃO XYZ)
                       ========================================================= */
                    <div className="mt-1 space-y-1 text-xs sm:text-[12.5px] text-zinc-700 dark:text-zinc-300 leading-relaxed cv-justified-text">
                      <p className="flex items-start gap-2">
                        <span className="text-zinc-400 select-none mt-1 text-[8px]">•</span>
                        <span>
                          <strong>{content.businessValue}</strong> — {content.engineeringFeat}
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-zinc-400 select-none mt-1 text-[8px]">•</span>
                        <span>{content.architecturalSolution}</span>
                      </p>
                      <div className="font-mono text-[10.5px] opacity-70 pt-0.5 ml-4">
                        <strong>Technologies:</strong> {node.technologies.join(', ')}
                      </div>
                    </div>
                  ) : (
                    /* =========================================================
                       PADRÃO BRASILEIRO / HISPÂNICO / FRANCÊS (DESTAQUE DE ROI ESTRUTURADO)
                       ========================================================= */
                    <div className="mt-1 space-y-1 text-xs sm:text-[12.5px] text-zinc-700 dark:text-zinc-300 leading-relaxed cv-justified-text">
                      <div className="border-l-2 border-blue-600 dark:border-blue-400 pl-3 py-0.5 font-sans text-xs text-zinc-700 dark:text-zinc-300 print:border-gray-400">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 mr-1.5">
                          {t(language, 'resume.businessRoi')}
                        </span>
                        <span>{roiText}</span>
                      </div>

                      <p className="opacity-90 leading-relaxed">
                        <strong>{t(language, 'resume.engineeringFeat')} </strong>
                        {featText}
                      </p>

                      <p className="opacity-80 leading-relaxed">
                        <strong>{t(language, 'resume.solution')} </strong>
                        {solText}
                      </p>

                      <div className="font-mono text-[10.5px] opacity-70 pt-0.5">
                        <strong>Stack:</strong> {node.technologies.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>

        {/* FORMAÇÃO ACADÊMICA, COMPETÊNCIAS & CERTIFICAÇÕES (PADRÃO EXECUTIVO GLOBAL TIER-1) */}
        <div className="mb-6 space-y-6">
          {/* 1. FORMAÇÃO ACADÊMICA FORMAL */}
          <div className="space-y-3">
            <h2 className="text-xs font-sans font-bold uppercase tracking-wider border-b pb-1.5 dark:border-zinc-800 border-zinc-200 text-zinc-900 dark:text-zinc-100 print:text-black">
              {language === 'PT'
                ? 'FORMAÇÃO ACADÊMICA & TÍTULOS SUPERIORES'
                : language === 'FR'
                ? 'FORMATION & DIPLÔMES ACADÉMIQUES'
                : language === 'ES'
                ? 'EDUCACIÓN Y TÍTULOS ACADÉMICOS'
                : 'HIGHER EDUCATION & FORMAL DEGREES'}
            </h2>

            <div className="space-y-3 text-xs sm:text-[13px]">
              {PROFILE_DATA.academicDegrees.map((deg) => {
                const degreeTitle =
                  language === 'PT'
                    ? deg.degreeName
                    : language === 'FR'
                    ? deg.degreeNameFR || deg.degreeNameEN
                    : language === 'ES'
                    ? deg.degreeNameES || deg.degreeNameEN
                    : deg.degreeNameEN;

                const degreeFocus =
                  language === 'PT'
                    ? deg.focus
                    : language === 'FR'
                    ? (deg as any).focusFR || deg.focusEN
                    : language === 'ES'
                    ? (deg as any).focusES || deg.focusEN
                    : deg.focusEN;

                return (
                  <div key={deg.id} className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-bold gap-1">
                      <div className="text-zinc-900 dark:text-zinc-100 print:text-black">
                        <span>{degreeTitle}</span>
                        <span className="opacity-40 font-normal mx-1.5">—</span>
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium print:text-black">{deg.institution}</span>
                      </div>
                      <span className="font-mono text-[11px] opacity-70 shrink-0">{deg.period}</span>
                    </div>



                    {deg.internationalEquivalency && (
                      <div className="text-[11.5px] font-sans leading-tight text-zinc-600 dark:text-zinc-400 print:text-zinc-700 pt-0.5">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200 print:text-black">
                          {language === 'PT'
                            ? 'Equivalência Acadêmica Canadense (WES):'
                            : language === 'FR'
                            ? 'Équivalence Académique Canadienne (WES) :'
                            : language === 'ES'
                            ? 'Equivalencia Académica Canadiense (WES):'
                            : 'Canadian Educational Credential (WES):'}
                        </span>{' '}
                        <span className="italic">{deg.internationalEquivalency.canadianEquivalency}</span>
                      </div>
                    )}

                    <p className="opacity-80 text-xs text-zinc-600 dark:text-zinc-400 leading-normal pt-0.5">
                      {degreeFocus}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. COMPETÊNCIAS TÉCNICAS CONSOLIDADAS (PADRÃO OURO ATS DE ALTA DENSIDADE) */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-sans font-bold uppercase tracking-wider border-b pb-1.5 dark:border-zinc-800 border-zinc-200 text-zinc-900 dark:text-zinc-100 print:text-black">
              {language === 'PT'
                ? 'COMPETÊNCIAS TÉCNICAS (HARD SKILLS)'
                : language === 'FR'
                ? 'COMPÉTENCES TECHNIQUES'
                : language === 'ES'
                ? 'COMPETENCIAS TÉCNICAS'
                : 'TECHNICAL SKILLS & COMPETENCIES'}
            </h2>

            <div className="space-y-1.5 text-xs sm:text-[12.5px] leading-relaxed text-zinc-700 dark:text-zinc-300">
              <p className="flex items-start gap-1.5">
                <span className="text-zinc-400 select-none shrink-0">•</span>
                <span>
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {language === 'PT' ? 'Arquitetura & Padrões:' : language === 'FR' ? 'Architectures & Patterns :' : language === 'ES' ? 'Arquitectura y Patrones:' : 'Architectures & Patterns:'}
                  </strong>{' '}
                  Event-Driven Architecture (EDA), Distributed Microservices, Domain-Driven Design (DDD), CQRS, Transactional Outbox Pattern, Zero-Trust Security, High Availability, Disaster Recovery (DR/BCP), ACID Compliance.
                </span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-zinc-400 select-none shrink-0">•</span>
                <span>
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {language === 'PT' ? 'Linguagens & Frameworks:' : language === 'FR' ? 'Langages & Frameworks :' : language === 'ES' ? 'Lenguajes y Frameworks:' : 'Languages & Frameworks:'}
                  </strong>{' '}
                  C#, .NET Core, .NET Framework, Python, TypeScript, SQL (T-SQL, PL/SQL), Java, Bash/Shell Scripting, Entity Framework, ASP.NET Core RESTful APIs.
                </span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-zinc-400 select-none shrink-0">•</span>
                <span>
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {language === 'PT' ? 'Bancos de Dados & Mensageria:' : language === 'FR' ? 'Bases de Données & Messagerie :' : language === 'ES' ? 'Bases de Datos y Mensajería:' : 'Databases & Messaging:'}
                  </strong>{' '}
                  Microsoft SQL Server, PostgreSQL, Sybase SQL Anywhere, Oracle DB, Apache Kafka, RabbitMQ, Clustered Index Tuning, Table Partitioning, Query Optimization, Transaction Log Management, ETL Pipelines.
                </span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-zinc-400 select-none shrink-0">•</span>
                <span>
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {language === 'PT' ? 'DevOps, Infraestrutura & SO:' : language === 'FR' ? 'DevOps, Infrastructure & OS :' : language === 'ES' ? 'DevOps, Infraestructura y SO:' : 'DevOps, Infrastructure & OS:'}
                  </strong>{' '}
                  Docker, Kubernetes, Linux System Internals (Kernel, Networking, SysAdmin), Active Directory, LDAP, CI/CD, Computer Telephony Integration (CTI, SIP/VoIP).
                </span>
              </p>
            </div>
          </div>

          {/* 3. IDIOMAS & CERTIFICAÇÕES RELEVANTES DE INDÚSTRIA */}
          <div className="space-y-2">
            <h2 className="text-xs font-sans font-bold uppercase tracking-wider border-b pb-1.5 dark:border-zinc-800 border-zinc-200 text-zinc-900 dark:text-zinc-100 print:text-black">
              {language === 'PT'
                ? 'IDIOMAS & CERTIFICAÇÕES DE MERCADO'
                : language === 'FR'
                ? 'LANGUES & CERTIFICATIONS'
                : language === 'ES'
                ? 'IDIOMAS Y CERTIFICACIONES'
                : 'LANGUAGES & CERTIFICATIONS'}
            </h2>

            <div className="space-y-1.5 text-xs sm:text-[12.5px] leading-relaxed text-zinc-700 dark:text-zinc-300">
              <p>
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {language === 'PT' ? 'Idiomas:' : language === 'FR' ? 'Langues :' : language === 'ES' ? 'Idiomas:' : 'Languages:'}
                </strong>{' '}
                {language === 'PT'
                  ? 'Inglês (Profissional Pleno - CEFR C1 · Mais de 3 Anos de Experiência no Canadá) | Português (Nativo - CEFR C2) | Espanhol (Elementar - A2) | Francês (Elementar - A2)'
                  : language === 'FR'
                  ? "Anglais (Professionnel - CEFR C1 · 3+ Ans d'Expérience au Canada) | Portugais (Natif - CEFR C2) | Espagnol (Élémentaire - A2) | Français (Élémentaire - A2)"
                  : language === 'ES'
                  ? 'Inglés (Profesional - CEFR C1 · Más de 3 Años de Experiencia en Canadá) | Portugués (Nativo - CEFR C2) | Español (A2) | Francés (A2)'
                  : 'English (Full Professional Working Proficiency - CEFR C1 · 3+ Yrs Canadian Experience) | Portuguese (Native - CEFR C2) | Spanish (Elementary - A2) | French (Elementary - A2)'}
              </p>

              <p>
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {language === 'PT' ? 'Certificações & Especializações:' : language === 'FR' ? 'Certifications & Spécialisations :' : language === 'ES' ? 'Certificaciones y Especializaciones:' : 'Certifications & Specialized Tracks:'}
                </strong>{' '}
                {language === 'PT'
                  ? 'Formação Especialista Linux (Admin, Network Servers & Security — 4Linux) · SQL Tuning & Otimização de Queries (MSSQL/Oracle) · Padrões de Projeto GoF e Clean Architecture em C# · GitFlow & Integração Contínua'
                  : language === 'FR'
                  ? 'Certification Spécialiste Linux (Admin, Serveurs Réseau & Sécurité — 4Linux) · Tuning SQL & Optimisation de Requêtes (MSSQL/Oracle) · Design Patterns GoF & Clean Architecture en C# · GitFlow & Intégration Continue'
                  : language === 'ES'
                  ? 'Certificación Especialista Linux (Admin, Servidores de Red y Seguridad — 4Linux) · SQL Tuning y Optimización de Consultas (MSSQL/Oracle) · Patrones de Diseño GoF y Clean Architecture en C# · GitFlow e Integración Continua'
                  : 'Linux Specialist Certification (Admin, Network Servers & Security — 4Linux) · SQL Tuning & Query Optimization (MSSQL/Oracle) · GoF Design Patterns & Clean Architecture in C# · GitFlow & Continuous Integration'}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
