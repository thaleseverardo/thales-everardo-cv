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

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownResume(language, isAuthenticated, email, phone));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPdfLink = () => {
    const pdfUrl = getAbsoluteDocUrl('pdf');
    navigator.clipboard.writeText(pdfUrl);
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
      setShowShareMenu(false);
    }, 1800);
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

  const handleShareEmail = () => {
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

    navigator.clipboard.writeText(pdfUrl);
    setEmailCopiedFeedback(true);
    setTimeout(() => {
      setEmailCopiedFeedback(false);
      setShowShareMenu(false);
    }, 1800);
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
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-6 pt-3 pb-20 sm:py-8 flex-1 animate-in fade-in duration-200">
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
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">PDF Oficial</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Documento Timbrado (.pdf)</div>
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
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Texto Puro</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">ATS Machine-readable (.txt)</div>
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
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Markdown</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">CommonMark Source (.md)</div>
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
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">Linha Direta</span>
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

      {/* 3. CORPO DO CV TIMBRADO (CONTAINER PURO DO DOCUMENTO EXECUTIVO TIER 3) */}
      <article
        className={`w-full font-sans leading-relaxed text-sm print:border-none print:shadow-none print:p-0 print:text-black p-4 sm:p-10 rounded-xl sm:rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-[#0c0c0f]/80 border-zinc-800/80 text-zinc-200 shadow-xs'
            : 'bg-white border-zinc-200/90 text-zinc-800 shadow-xs'
        }`}
      >
        {/* CABEÇALHO DO CURRÍCULO (NOME E CARGOS RIGOROSAMENTE EM 1 LINHA CADA) */}
        <div className="border-b pb-4 sm:pb-5 mb-6 dark:border-zinc-800 border-zinc-200 print:border-black overflow-hidden">
          <h1 className="text-[clamp(0.95rem,4.3vw,1.75rem)] font-sans font-bold tracking-tight whitespace-nowrap text-zinc-900 dark:text-zinc-100 leading-tight print:text-black">
            {PROFILE_DATA.name.toUpperCase()}
          </h1>
          <div className="text-[clamp(0.68rem,2.8vw,0.95rem)] font-sans font-semibold text-blue-600 dark:text-blue-400 mt-1 whitespace-nowrap tracking-tight leading-tight print:text-black">
            {getProfileTitle(language)}
          </div>

          {/* LINHA DE CONTATO RIGIDAMENTE TRAVADA HORIZONTALMENTE */}
          <div className="mt-3.5 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-y-1.5 sm:gap-x-3 text-xs font-mono">
            {isAuthenticated ? (
              <>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 h-7 min-h-0 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group cursor-pointer min-w-0"
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
                  <span className="hover:underline font-semibold select-all truncate leading-none">
                    {email || t(language, 'resume.loading')}
                  </span>
                </a>
                <span className="text-zinc-300 dark:text-zinc-700 select-none hidden sm:inline">•</span>
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-7 min-h-0 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group cursor-pointer min-w-0"
                >
                  <Phone className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
                  <span className="hover:underline font-semibold select-all truncate leading-none">
                    {phone || t(language, 'resume.loading')}
                  </span>
                </a>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => (onOpenContact ? onOpenContact() : signInWithGoogle())}
                  className="group inline-flex items-center gap-2 h-7 min-h-0 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer min-w-0 text-left"
                  title={t(language, 'resume.gateTitle')}
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 shrink-0" />
                  <span className="tracking-wide select-none font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 truncate leading-none">
                    thales••••••@•••••.com
                  </span>
                  <Lock className="w-3 h-3 text-zinc-400/70 dark:text-zinc-500/70 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 shrink-0" />
                </button>
                <span className="text-zinc-300 dark:text-zinc-700 select-none hidden sm:inline">•</span>
                <button
                  type="button"
                  onClick={() => (onOpenContact ? onOpenContact() : signInWithGoogle())}
                  className="group inline-flex items-center gap-2 h-7 min-h-0 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer min-w-0 text-left"
                  title={t(language, 'resume.gateTitle')}
                >
                  <Phone className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                  <span className="tracking-wide select-none font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 truncate leading-none">
                    +55 11 9••••-••••
                  </span>
                  <Lock className="w-3 h-3 text-zinc-400/70 dark:text-zinc-500/70 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 shrink-0" />
                </button>
              </>
            )}

            <span className="text-zinc-300 dark:text-zinc-700 select-none hidden sm:inline">•</span>
            <div className="inline-flex items-center gap-2 h-7 min-h-0 text-zinc-600 dark:text-zinc-400 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
              <span className="truncate leading-none">{getProfileLocation(language)}</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700 select-none hidden sm:inline">•</span>
            <div className="hidden sm:flex items-center gap-2 h-7 min-h-0 text-zinc-500 dark:text-zinc-400 min-w-0">
              <Globe className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
              <span className="truncate leading-none">{t(language, 'resume.availability')}</span>
            </div>
          </div>
        </div>

        {/* RESUMO EXECUTIVO */}
        <div className="mb-6 space-y-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-zinc-200 text-blue-600 dark:text-blue-400 print:text-black">
            {t(language, 'resume.executiveSummary')}
          </h2>
          <p className="text-sm opacity-90 leading-relaxed font-sans">
            {getProfileSummary(language)}
          </p>
        </div>

        {/* EXPERIÊNCIA ARQUITETURAL EM PRODUÇÃO */}
        <div className="mb-6 space-y-5">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-zinc-200 text-blue-600 dark:text-blue-400 print:text-black">
            {t(language, 'resume.coreExperience')}
          </h2>

          {CURRICULUM_NODES.map((node) => {
            const content = getNodeContent(node, language);

            return (
              <div key={node.id} className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between font-bold gap-1 sm:gap-4">
                  <div className="text-sm sm:text-base text-zinc-900 dark:text-zinc-100 print:text-black leading-snug">
                    <span className="inline-flex items-center gap-2 mr-2">
                      <span>{node.company}</span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 select-none"
                        title={node.location}
                      >
                        {node.location.toLowerCase().includes('canada') || node.company.includes('Summerhill') ? 'CA' : 'BR'}
                      </span>
                    </span>
                    <span className="opacity-50 font-normal mr-1.5">—</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium print:text-black">
                      {content.role}
                    </span>
                  </div>
                  <span className="font-mono text-xs opacity-70 shrink-0 sm:pt-0.5">{node.period}</span>
                </div>

                <div className="border-l-2 border-blue-600 dark:border-blue-400 pl-3 py-1 font-sans text-xs text-zinc-700 dark:text-zinc-300 print:border-gray-400">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 mr-1.5">{t(language, 'resume.businessRoi')}</span>
                  <span>{content.businessValue}</span>
                </div>

                <p className="opacity-90 leading-relaxed">
                  <strong>{t(language, 'resume.engineeringFeat')} </strong>
                  {content.engineeringFeat}
                </p>

                <p className="opacity-80 leading-relaxed">
                  <strong>{t(language, 'resume.solution')} </strong>
                  {content.architecturalSolution}
                </p>

                <div className="font-mono text-[11px] opacity-70 pt-0.5">
                  <strong>Stack:</strong> {node.technologies.join(', ')}
                </div>
              </div>
            );
          })}
        </div>

        {/* FORMAÇÃO & CERTIFICAÇÕES */}
        <div className="mb-6 space-y-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-zinc-200 text-blue-600 dark:text-blue-400 print:text-black">
            {t(language, 'academic.formalDegreesTitle')}
          </h2>

          {/* KPI HUD MÉTRICO ACADÊMICO */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 print:hidden">
            <div className={`p-3 rounded-xl border font-mono text-center ${theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
              <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">1.660h</div>
              <div className="text-[10px] font-semibold opacity-70 uppercase tracking-tight">{t(language, 'academic.kpiHours')}</div>
              <div className="text-[9px] opacity-50 truncate">{t(language, 'academic.kpiHoursSub')}</div>
            </div>

            <div className={`p-3 rounded-xl border font-mono text-center ${theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
              <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">4 Graus</div>
              <div className="text-[10px] font-semibold opacity-70 uppercase tracking-tight">{t(language, 'academic.kpiDegrees')}</div>
              <div className="text-[9px] opacity-50 truncate">{t(language, 'academic.kpiDegreesSub')}</div>
            </div>

            <div className={`p-3 rounded-xl border font-mono text-center ${theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
              <div className="text-base sm:text-lg font-bold text-emerald-500">🇨🇦 WES CA</div>
              <div className="text-[10px] font-semibold opacity-70 uppercase tracking-tight">{t(language, 'academic.kpiWes')}</div>
              <div className="text-[9px] opacity-50 truncate">{t(language, 'academic.kpiWesSub')}</div>
            </div>

            <div className={`p-3 rounded-xl border font-mono text-center ${theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
              <div className="text-base sm:text-lg font-bold text-amber-500">7 Hashes</div>
              <div className="text-[10px] font-semibold opacity-70 uppercase tracking-tight">{t(language, 'academic.kpiCredentials')}</div>
              <div className="text-[9px] opacity-50 truncate">{t(language, 'academic.kpiCredentialsSub')}</div>
            </div>
          </div>

          {/* FORMAÇÃO ACADÊMICA FORMAL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-sans">
            {PROFILE_DATA.academicDegrees.map((deg) => (
              <div
                key={deg.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  theme === 'dark'
                    ? 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                    : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 shadow-2xs'
                } print:border-gray-300`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 print:text-black text-sm leading-snug">
                      {language === 'PT' ? deg.degreeName : deg.degreeNameEN}
                    </div>
                    <span className="font-mono text-[11px] opacity-65 shrink-0 pt-0.5">{deg.period}</span>
                  </div>

                  <div className="text-blue-600 dark:text-blue-400 font-semibold text-xs mt-1 print:text-black">
                    {deg.institution}
                  </div>

                  {deg.status === 'IN_PROGRESS' && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-2 rounded-md font-mono text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      {t(language, 'academic.inProgressBadge')}
                    </span>
                  )}

                  {deg.internationalEquivalency && (
                    <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-semibold flex items-center gap-1.5">
                      <span>🇨🇦</span>
                      <span>WES Canadian Equivalency: {deg.internationalEquivalency.canadianEquivalency}</span>
                    </div>
                  )}

                  <p className="opacity-75 text-[11px] mt-2.5 leading-relaxed font-sans">
                    {language === 'PT' ? deg.focus : deg.focusEN}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/80 font-mono text-[10px]">
                  {deg.skills.map((s, sIdx) => (
                    <span key={sIdx} className="px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CERTIFICAÇÕES ACADÊMICAS OFICIAIS COM HASH */}
          <div className="pt-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-zinc-200 text-blue-600 dark:text-blue-400 print:text-black mb-3">
              {t(language, 'academic.verifiedCredentialsTitle')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              {PROFILE_DATA.verifiedCredentials.map((cred) => (
                <div
                  key={cred.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                    theme === 'dark' ? 'bg-zinc-950/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs leading-snug">
                        {language === 'PT' ? cred.title : cred.titleEN}
                      </div>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                        {cred.workloadHours}h
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">{cred.institution}</div>
                    <div className="text-[10px] opacity-60 font-mono mt-1">Disciplinas: {cred.disciplinesIncluded.join(', ')}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="font-mono text-[10px] opacity-50">{cred.issueDate}</span>
                    <a
                      href={cred.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      <span>{t(language, 'academic.verifyCredential')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TRILHAS TÉCNICAS E ESPECIALIZAÇÕES */}
          <div className="pt-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-zinc-200 text-blue-600 dark:text-blue-400 print:text-black mb-3">
              {t(language, 'academic.specializedTracksTitle')}
            </h2>
            <div className="flex flex-wrap gap-2 text-xs font-sans">
              {PROFILE_DATA.technicalCourses.map((tc) => (
                <div
                  key={tc.id}
                  className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${
                    theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100 text-xs leading-none">{tc.title}</div>
                    <div className="text-[10px] opacity-60 font-mono mt-1">
                      {tc.institution} {tc.associatedCompany ? `· ${tc.associatedCompany}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IDIOMAS */}
          <div className="pt-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-zinc-200 text-blue-600 dark:text-blue-400 print:text-black mb-3">
              {t(language, 'academic.languagesTitle')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-sans text-xs">
              {PROFILE_DATA.languages.map((langItem, lIdx) => (
                <div
                  key={lIdx}
                  className={`p-3 rounded-xl border ${
                    theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">{langItem.language}</div>
                  <div className="text-blue-600 dark:text-blue-400 text-[11px] font-medium mt-0.5">
                    {language === 'PT' ? langItem.proficiencyPT : langItem.proficiencyEN}
                  </div>
                  <div className="font-mono text-[10px] opacity-50 mt-1">Quadro Europeu: {langItem.cefrLevel}</div>
                </div>
              ))}
            </div>
          </div>

          {/* HARD SKILLS */}
          <div className="pt-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-zinc-200 text-blue-600 dark:text-blue-400 print:text-black mb-3">
              {t(language, 'skills.hardSkillsTitle')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              {PROFILE_DATA.hardSkillsDomains.map((dom) => (
                <div
                  key={dom.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                    theme === 'dark' ? 'bg-zinc-950/40 border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs mb-2">
                    {language === 'PT' ? dom.categoryPT : dom.categoryEN}
                  </div>
                  <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                    {dom.skills.map((sk, skIdx) => (
                      <span
                        key={skIdx}
                        className="px-2 py-0.5 rounded-md border dark:bg-zinc-900 dark:border-zinc-800 bg-white border-zinc-200 text-zinc-700 dark:text-zinc-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOFT SKILLS */}
          <div className="pt-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-zinc-200 text-blue-600 dark:text-blue-400 print:text-black mb-3">
              {t(language, 'skills.softSkillsTitle')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              {PROFILE_DATA.softSkillsCompetencies.map((comp) => (
                <div
                  key={comp.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                    theme === 'dark' ? 'bg-zinc-950/40 border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{language === 'PT' ? comp.titlePT : comp.titleEN}</span>
                    </div>
                    <p className="opacity-75 text-[11px] mt-1.5 leading-relaxed font-sans">
                      {language === 'PT' ? comp.descriptionPT : comp.descriptionEN}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80 font-mono text-[9px] opacity-60">
                    {comp.linkedSkills.map((ls, lsIdx) => (
                      <span key={lsIdx}>#{ls}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
