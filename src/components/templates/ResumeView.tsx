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
  Github,
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

const CanadaFlagSVG: React.FC<{ className?: string }> = ({
  className = 'w-4.5 h-3 inline-block shrink-0 rounded-[2px] shadow-2xs border border-black/10 dark:border-white/15',
}) => (
  <svg className={className} viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Canada">
    <rect width="24" height="16" fill="#D80027" />
    <rect x="6" width="12" height="16" fill="#FFFFFF" />
    <path
      d="M12 2.8L12.5 4.8L14.3 4.2L13.5 6L15.5 7.1L14 8.2L14.6 9.8L12.6 9.4L12.3 12.2H11.7L11.4 9.4L9.4 9.8L10 8.2L8.5 7.1L10.5 6L9.7 4.2L11.5 4.8L12 2.8Z"
      fill="#D80027"
    />
  </svg>
);

const BrazilFlagSVG: React.FC<{ className?: string }> = ({
  className = 'w-4.5 h-3 inline-block shrink-0 rounded-[2px] shadow-2xs border border-black/10 dark:border-white/15',
}) => (
  <svg className={className} viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Brasil">
    <rect width="24" height="16" fill="#009B3A" />
    <path d="M12 2.2L21 8L12 13.8L3 8L12 2.2Z" fill="#FEDF00" />
    <circle cx="12" cy="8" r="3.2" fill="#002776" />
    <path d="M9.1 7.2C10.2 6.5 12.5 6.6 14.8 8.1C14.7 8.3 14.5 8.5 14.3 8.7C12.3 7.4 10.3 7.3 9.3 7.8L9.1 7.2Z" fill="#FFFFFF" />
  </svg>
);

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const email = contact?.email || '';
  const phone = contact?.phone || '';

  useEffect(() => {
    logAnalyticsEvent('cv_view', { language });
  }, [language]);

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePdf = async () => {
    const card = document.getElementById('printable-resume-card');
    if (!card || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    logAnalyticsEvent('cv_download', { extension: 'pdf', language });

    const wasDark = document.documentElement.classList.contains('dark');
    if (wasDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

    // Criar container desacoplado com proporções canônicas de A4 canadense (794px x 1123px)
    const wrapper = document.createElement('div');
    wrapper.className = 'light';
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    wrapper.style.zIndex = '-9999';
    wrapper.style.backgroundColor = '#ffffff';

    try {
      const [{ default: jsPDF }, { toJpeg }] = await Promise.all([
        import('jspdf'),
        import('html-to-image'),
      ]);

      // Extração dos blocos semânticos do currículo
      const cardChildren = Array.from(card.children) as HTMLElement[];
      const headerClone = cardChildren[0].cloneNode(true) as HTMLElement;
      const summaryClone = cardChildren[1].cloneNode(true) as HTMLElement;
      const expContainer = cardChildren[2];
      const eduSkillsClone = cardChildren[3].cloneNode(true) as HTMLElement;

      const expTitle = (expContainer.querySelector('h2')?.cloneNode(true) || document.createElement('h2')) as HTMLElement;
      const expTitle2 = expTitle.cloneNode(true) as HTMLElement;
      const expContLabel = language === 'PT' ? ' (Continuação)' : language === 'FR' ? ' (Suite)' : language === 'ES' ? ' (Continuación)' : ' (Continued)';
      expTitle2.textContent = (expTitle2.textContent || '') + expContLabel;

      const jobNodes = Array.from(expContainer.children).filter(
        (el) => el.tagName !== 'H2'
      ) as HTMLElement[];

      // Divisão balanceada para padrão de 2 páginas:
      // Página 1: Primeiras 3 experiências (Summerhill & Altitude/Ultra)
      // Página 2: Experiências anteriores (Atento) + Formação + Habilidades + Idiomas
      const jobsPage1 = jobNodes.slice(0, 2).map((j) => j.cloneNode(true) as HTMLElement);
      const jobsPage2 = jobNodes.slice(2).map((j) => j.cloneNode(true) as HTMLElement);

      // Folha de estilo embutida: Margens Canônicas Canadenses 0.75" (18mm) com densidade equilibrada
      const pdfStyle = document.createElement('style');
      pdfStyle.textContent = `
        .canadian-a4-page {
          width: 794px;
          height: 1123px;
          max-height: 1123px;
          padding: 48px 64px; /* ~18mm laterais (0.72") e ~13mm verticais */
          box-sizing: border-box;
          background-color: #ffffff !important;
          color: #111827 !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-size: 8.5pt !important;
          line-height: 1.30 !important;
          letter-spacing: -0.01em !important;
        }
        .canadian-a4-page * {
          box-sizing: border-box;
        }
        .canadian-a4-page h1 {
          font-size: 14pt !important;
          line-height: 1.15 !important;
          margin-bottom: 2px !important;
          color: #111827 !important;
        }
        .canadian-a4-page h2 {
          font-size: 8.8pt !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.04em !important;
          border-bottom: 1px solid #d1d5db !important;
          padding-bottom: 2px !important;
          margin-top: 5px !important;
          margin-bottom: 4px !important;
          color: #111827 !important;
        }
        .canadian-a4-page p, .canadian-a4-page div {
          line-height: 1.30 !important;
          color: #1f2937 !important;
        }
        /* Neutralização de hifens e forçamento de alinhamento à esquerda no PDF para conformidade ATS */
        .canadian-a4-page,
        .canadian-a4-page *,
        .canadian-a4-page .cv-justified-text,
        .canadian-a4-page p {
          text-align: left !important;
          text-justify: auto !important;
          hyphens: none !important;
          -webkit-hyphens: none !important;
          -ms-hyphens: none !important;
        }
        .canadian-a4-page .mb-6, .canadian-a4-page .mb-5 {
          margin-bottom: 5px !important;
        }
        .canadian-a4-page .space-y-6 > * + * {
          margin-top: 5px !important;
        }
        .canadian-a4-page .space-y-4 > * + * {
          margin-top: 4px !important;
        }
        .canadian-a4-page .space-y-3 > * + * {
          margin-top: 2.5px !important;
        }
        .canadian-a4-page .space-y-2\.5 > * + * {
          margin-top: 2.5px !important;
        }
        .canadian-a4-page .space-y-1 > * + * {
          margin-top: 1px !important;
        }
        .canadian-a4-page .mt-2\.5 {
          margin-top: 2px !important;
        }
        .canadian-a4-page .mt-2 {
          margin-top: 2px !important;
        }
        .canadian-a4-page .pb-4, .canadian-a4-page .pb-5 {
          padding-bottom: 2px !important;
        }
        .canadian-a4-page .border-b {
          border-color: #d1d5db !important;
        }
      `;
      wrapper.appendChild(pdfStyle);

      // ESTILO CANÔNICO A4 CANADENSE: Margens laterais de 0.75" (64px / 18mm)
      const createPageContainer = (): HTMLElement => {
        const page = document.createElement('div');
        page.className = 'canadian-a4-page';
        return page;
      };

      // === MONTAGEM DA PÁGINA 1 ===
      const page1 = createPageContainer();
      page1.appendChild(headerClone);
      page1.appendChild(summaryClone);

      const expSec1 = document.createElement('div');
      expSec1.className = 'space-y-3';
      expSec1.style.marginBottom = '0px';
      expSec1.appendChild(expTitle);
      jobsPage1.forEach((job) => expSec1.appendChild(job));
      page1.appendChild(expSec1);

      // === MONTAGEM DA PÁGINA 2 ===
      const page2 = createPageContainer();

      // Running Header Canônico Canadense (Sem colisão de títulos longos)
      const runningHeader = document.createElement('div');
      runningHeader.style.display = 'flex';
      runningHeader.style.justifyContent = 'space-between';
      runningHeader.style.alignItems = 'center';
      runningHeader.style.borderBottom = '1px solid #d1d5db';
      runningHeader.style.paddingBottom = '3px';
      runningHeader.style.marginBottom = '8px';
      runningHeader.style.fontSize = '8pt';
      runningHeader.style.fontFamily = 'monospace';
      runningHeader.style.color = '#6b7280';
      runningHeader.style.letterSpacing = '0.04em';
      const pageLabel = language === 'PT' ? 'Página 2 de 2' : language === 'FR' ? 'Page 2 sur 2' : language === 'ES' ? 'Página 2 de 2' : 'Page 2 of 2';
      runningHeader.innerHTML = `<span style="font-weight: 700; color: #374151;">${PROFILE_DATA.name.toUpperCase()}</span><span>${pageLabel}</span>`;
      page2.appendChild(runningHeader);

      if (jobsPage2.length > 0) {
        const expSec2 = document.createElement('div');
        expSec2.className = 'space-y-3';
        expSec2.style.marginBottom = '8px';
        expSec2.appendChild(expTitle2);
        jobsPage2.forEach((job) => expSec2.appendChild(job));
        page2.appendChild(expSec2);
      }

      page2.appendChild(eduSkillsClone);

      wrapper.appendChild(page1);
      wrapper.appendChild(page2);
      document.body.appendChild(wrapper);

      // Renderização simultânea em alta densidade 2x DPI
      const [imgPage1, imgPage2] = await Promise.all([
        toJpeg(page1, { quality: 0.98, pixelRatio: 2, skipFonts: true, backgroundColor: '#ffffff' }),
        toJpeg(page2, { quality: 0.98, pixelRatio: 2, skipFonts: true, backgroundColor: '#ffffff' }),
      ]);

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // Mapeamento de links clicáveis (LinkedIn, GitHub, E-mail, WhatsApp) sobre as coordenadas A4
      const attachPdfLinks = (pageElement: HTMLElement, pageNumber: number) => {
        const pageRect = pageElement.getBoundingClientRect();
        if (pageRect.width === 0 || pageRect.height === 0) return;

        const scaleX = 210 / pageElement.offsetWidth;
        const scaleY = 297 / pageElement.offsetHeight;

        const links = pageElement.querySelectorAll('a');
        links.forEach((anchor) => {
          const href = anchor.getAttribute('href');
          if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

          const elRect = anchor.getBoundingClientRect();
          if (elRect.width === 0 || elRect.height === 0) return;

          // Conversão de pixels do DOM para milímetros do PDF
          const x = (elRect.left - pageRect.left) * scaleX;
          const y = (elRect.top - pageRect.top) * scaleY;
          const w = elRect.width * scaleX;
          const h = elRect.height * scaleY;

          // Área de toque com tolerância de 0.4mm e diretiva canônica para abrir em nova aba/janela
          const pad = 0.4;
          pdf.setPage(pageNumber);
          pdf.link(
            Math.max(0, x - pad),
            Math.max(0, y - pad),
            w + pad * 2,
            h + pad * 2,
            { url: href, newWindow: true } as any
          );
        });
      };

      // Página 1: imagem e injeção de links clicáveis (LinkedIn, GitHub, etc.)
      pdf.addImage(imgPage1, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      attachPdfLinks(page1, 1);

      // Página 2: imagem e injeção de links
      pdf.addPage('a4', 'p');
      pdf.addImage(imgPage2, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      attachPdfLinks(page2, 2);

      pdf.save(`Thales_Everardo_CV_${language}.pdf`);
    } catch (err) {
      console.error('Falha ao gerar arquivo PDF:', err);
    } finally {
      if (document.body.contains(wrapper)) {
        document.body.removeChild(wrapper);
      }
      if (wasDark) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
      setIsGeneratingPdf(false);
      setShowDownloadMenu(false);
    }
  };

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      const base = import.meta.env.BASE_URL.replace(/\/$/, '');
      return `${window.location.origin}${base}/?lang=${language.toLowerCase()}`;
    }
    return '';
  };

  const downloadStaticFile = (extension: 'txt' | 'md') => {
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
    const shareUrl = getShareUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
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
    const shareUrl = getShareUrl();
    const msg = `${t(language, 'resume.shareWhatsAppMsg')}${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const handleShareLinkedIn = () => {
    const shareUrl = getShareUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setShowShareMenu(false);
  };

  const handleShareEmail = async () => {
    const shareUrl = getShareUrl();
    const subject = t(language, 'resume.shareEmailSubject');
    const body = t(language, 'resume.shareEmailBody').replace('{url}', shareUrl);

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const anchor = document.createElement('a');
    anchor.href = mailtoUrl;
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    try {
      await navigator.clipboard.writeText(shareUrl);
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
    const shareUrl = getShareUrl();
    const title = `Thales Everardo - CV (${language})`;
    const text = `${PROFILE_DATA.name} - ${getProfileTitle(language)}`;

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
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
                    onClick={handleGeneratePdf}
                    disabled={isGeneratingPdf}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors flex items-center justify-between cursor-pointer group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                        {isGeneratingPdf ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FileCheck className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {isGeneratingPdf
                            ? language === 'PT'
                              ? 'Gerando arquivo...'
                              : language === 'ES'
                              ? 'Generando archivo...'
                              : language === 'FR'
                              ? 'Génération du fichier...'
                              : 'Generating file...'
                            : t(language, 'resume.formatPdfTitle')}
                        </div>
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
        lang={language === 'PT' ? 'pt-BR' : language === 'ES' ? 'es-ES' : language === 'FR' ? 'fr-FR' : 'en-US'}
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
                    <Lock className="w-3 h-3 text-amber-500 shrink-0" strokeWidth={1.8} />
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
                    <Lock className="w-3 h-3 text-amber-500 shrink-0" strokeWidth={1.8} />
                  </button>
                </>
              )}
            </div>

            <span className="text-zinc-300 dark:text-zinc-700 select-none hidden sm:inline">|</span>

            {/* Bloco 2: Perfis Profissionais (Rastreados via Bridge Pages) */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <a
                href="https://thaleseverardo.github.io/thales-everardo-cv/linkedin?src=cv_web"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                <span className="hover:underline">LinkedIn</span>
              </a>
              <span className="text-zinc-300 dark:text-zinc-700 select-none">|</span>
              <a
                href="https://thaleseverardo.github.io/thales-everardo-cv/github?src=cv_web"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                <span className="hover:underline">GitHub</span>
              </a>
              <span className="text-zinc-300 dark:text-zinc-700 select-none">|</span>
              <a
                href="https://thaleseverardo.github.io/thales-everardo-cv/portfolio?src=cv_web"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                <span className="hover:underline">{language === 'PT' ? 'Portfólio' : language === 'ES' ? 'Portafolio' : 'Portfolio'}</span>
              </a>
            </div>
          </div>

          {/* 2. LINHA DE CONTATOS DEDICADA PARA IMPRESSÃO / PDF (RASTREADOS COM ?src=cv_pdf) */}
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
            <a
              href="https://thaleseverardo.github.io/thales-everardo-cv/linkedin?src=cv_pdf"
              className="inline-flex items-center gap-1 text-inherit no-underline"
            >
              <Linkedin className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              <span>linkedin.com/in/thaleseverardo</span>
            </a>
            <span className="text-zinc-400 select-none">|</span>
            <a
              href="https://thaleseverardo.github.io/thales-everardo-cv/github?src=cv_pdf"
              className="inline-flex items-center gap-1 text-inherit no-underline"
            >
              <Github className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              <span>github.com/thaleseverardo</span>
            </a>
            <span className="text-zinc-400 select-none">|</span>
            <a
              href="https://thaleseverardo.github.io/thales-everardo-cv/portfolio?src=cv_pdf"
              className="inline-flex items-center gap-1 text-inherit no-underline"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              <span>thaleseverardo.github.io/.../portfolio</span>
            </a>
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
            const filteredNodes = CURRICULUM_NODES.filter((node) => {
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

            // Consolidação das atribuições da Summerhill Market em uma experiência unificada
            const summerhillNodes = filteredNodes.filter((n) => n.company.toLowerCase().includes('summerhill'));
            const nonSummerhillNodes = filteredNodes.filter((n) => !n.company.toLowerCase().includes('summerhill'));

            let consolidatedSummerhillNode: (typeof filteredNodes)[0] | null = null;
            if (summerhillNodes.length > 0) {
              const baseNode = summerhillNodes[0];
              const progressionText =
                language === 'PT'
                  ? 'Progressão de Carreira: Liderança Operacional (2020/21) ➔ DBA & Dados (2021/23) ➔ Gerente de Sistemas de TI & Soluções (2023/24)'
                  : language === 'FR'
                  ? 'Progression : Responsable Opérations (2020/21) ➔ DBA & Données (2021/23) ➔ Responsable Systèmes IT & Solutions (2023/24)'
                  : language === 'ES'
                  ? 'Progresión: Liderazgo Operacional (2020/21) ➔ DBA y Datos (2021/23) ➔ Gerente de Sistemas de TI y Soluciones (2023/24)'
                  : 'Career Progression: Operations Lead (2020/21) ➔ Database Administrator (2021/23) ➔ IT Systems & Solutions Manager (2023/24)';

              const unifiedRole =
                language === 'PT'
                  ? 'Gerente de Sistemas de TI, Engenheiro de Soluções & DBA'
                  : language === 'FR'
                  ? 'Responsable des Systèmes IT, Ingénieur Solutions & Lead DBA'
                  : language === 'ES'
                  ? 'Gerente de Sistemas de TI, Ingeniero de Soluciones y DBA'
                  : 'IT Systems Manager, Solutions Engineer & Lead DBA';

              const unifiedROI =
                language === 'PT'
                  ? 'Unificou a governança tecnológica de 5 lojas físicas para +500.000 transações/mês (30.000 SKUs) e reduziu descarte de insumos em 70% com +50% de produtividade fabril.'
                  : language === 'FR'
                  ? 'Gouvernance technologique et données unifiée sur 5 magasins physiques (+500 000 transactions/mois et 30 000 SKUs) et réduction de 70% du gaspillage avec +50% de productivité.'
                  : language === 'ES'
                  ? 'Gobernanza tecnológica y de datos unificada en 5 tiendas físicas (+500.000 transacciones/mes y 30.000 SKUs), reduciendo el descarte en un 70% con +50% de productividad.'
                  : 'Unified IT & data governance across 5 enterprise stores for 500,000+ monthly transactions (30,000 SKUs) while slashing physical production waste by 70% with +50% throughput.';

              const unifiedFeat =
                language === 'PT'
                  ? 'Implementou plano de Disaster Recovery (DR/BCP) com recuperação de dados críticos em 24h, eliminou retrabalho em 30k SKUs via catálogo GS1 em tempo real e aplicou Teoria das Filas à produção.'
                  : language === 'FR'
                  ? 'Mise en œuvre d\'un plan de reprise après sinistre (DR/BCP) restaurant les données en 24h, synchronisation POS/ERP en temps réel (standard GS1) et application de la Théorie des files d\'attente.'
                  : language === 'ES'
                  ? 'Implementó plan de Disaster Recovery (DR/BCP) recuperando datos críticos en 24h, logró sincronización GS1/POS en tiempo real en 30.000 SKUs y aplicó Teoría de Colas a la producción.'
                  : 'Architected Disaster Recovery (DR/BCP) restoring critical data within 24h, achieved sub-second GS1 catalog/POS sync across 30k SKUs, and applied Queueing Theory to physical factory workflows.';

              const unifiedSolution =
                language === 'PT'
                  ? 'Desenvolveu microsserviços e APIs RESTful em C#/.NET conectando o padrão GS1 ao ERP com tolerância a falhas, modelou rotinas ETL e aplicou cadência Just-in-Time com previsão de demanda.'
                  : language === 'FR'
                  ? 'Développement de microservices et APIs RESTful en C#/.NET reliant le standard GS1 à l\'ERP avec haute résilience, optimisation ETL et flux Just-in-Time.'
                  : language === 'ES'
                  ? 'Desarrolló microservicios y APIs RESTful en C#/.NET conectando el estándar GS1 al ERP con tolerancia a fallos, optimizó ETL y aplicó cadencia Just-in-Time.'
                  : 'Engineered resilient C#/.NET RESTful microservices integrating GS1 catalog standards with enterprise ERP, automated relational ETL pipelines, and enforced Just-in-Time predictive demand forecasting.';

              const unifiedTechs = Array.from(
                new Set(summerhillNodes.flatMap((n) => n.technologies))
              );

              consolidatedSummerhillNode = {
                ...baseNode,
                id: 'summerhill-consolidated-node',
                role: unifiedRole,
                company: 'Summerhill Market',
                period: 'Jul 2020 - Feb 2024',
                location: 'Toronto, ON, Canada',
                technologies: unifiedTechs,
                careerProgression: progressionText,
                businessValue: unifiedROI,
                engineeringFeat: unifiedFeat,
                architecturalSolution: unifiedSolution,
              };
            }

            // Consolidação das atribuições da Atento em uma experiência unificada com progressão
            const atentoNodes = nonSummerhillNodes.filter((n) => n.company.toLowerCase().includes('atento'));
            const nonAtentoNodes = nonSummerhillNodes.filter((n) => !n.company.toLowerCase().includes('atento'));

            let consolidatedAtentoNode: (typeof filteredNodes)[0] | null = null;
            if (atentoNodes.length > 0) {
              const baseNode = atentoNodes[0];
              const progressionText =
                language === 'PT'
                  ? 'Progressão de Carreira: Analista de Suporte (2007/08) ➔ Eng. de Suporte I (2011) ➔ Eng. de Suporte II (2014) ➔ Eng. de Suporte III (2015/16) ➔ Coordenação Técnica Interina'
                  : language === 'FR'
                  ? 'Progression : Analyste Support (2007/08) ➔ Ing. Support I (2011) ➔ Ing. Support II (2014) ➔ Ing. Support III (2015/16) ➔ Coordination Technique par intérim'
                  : language === 'ES'
                  ? 'Progresión: Analista de Soporte (2007/08) ➔ Ing. de Soporte I (2011) ➔ Ing. de Soporte II (2014) ➔ Ing. de Soporte III (2015/16) ➔ Coordinación Técnica Interina'
                  : 'Career Progression: Support Analyst (2007/08) ➔ Support Eng. I (2011) ➔ Support Eng. II (2014) ➔ Support Eng. III (2015/16) ➔ Acting Technical Coordinator';

              const unifiedRole =
                language === 'PT'
                  ? 'Engenheiro de Suporte Técnico III (Telecomunicações, CTI & Automação)'
                  : language === 'FR'
                  ? 'Ingénieur Support Technique III (Télécoms, CTI & Automatisation)'
                  : language === 'ES'
                  ? 'Ingeniero de Soporte Técnico III (Telecomunicaciones, CTI y Automatización)'
                  : 'Technical Support Engineer III (Telecom, CTI & Automation)';

              const unifiedROI =
                language === 'PT'
                  ? 'Garantia de 99,98% de disponibilidade operacional para +40.000 PAs (economia de US$ 500k+ em multas) e redução de 99,8% no tempo de processamento de relatórios gerenciais (de 7 dias para 20 minutos).'
                  : language === 'FR'
                  ? 'Garantie de 99,98% de disponibilité opérationnelle pour +40 000 postes (+500k$ d\'économies) et réduction de 99,8% du temps de traitement des rapports (de 7 jours à 20 minutes).'
                  : language === 'ES'
                  ? 'Garantizó el 99,98% de disponibilidad operativa para más de 40.000 puestos (ahorro de US$ 500k+) y reducción del 99,8% en el tiempo de procesamiento de informes (de 7 días a 20 minutos).'
                  : '99.98% operational uptime across mission-critical infrastructure for 40,000+ workstations (US$ 500k+ saved) and 99.8% reduction in reporting processing latency (from 7 days down to 20 minutes).';

              const unifiedFeat =
                language === 'PT'
                  ? 'Projetou pipelines contínuos de ingestão para +100.000 registros diários de voz e desenvolveu esteiras ETL em T-SQL e Shell Script que reduziram auditorias manuais de 1 semana para 10 segundos.'
                  : language === 'FR'
                  ? 'Conception de pipelines d\'ingestion pour +100 000 enregistrements quotidiens de voix et développement de flux ETL en T-SQL réduisant les audits d\'une semaine à 10 secondes.'
                  : language === 'ES'
                  ? 'Diseñó pipelines continuos de ingestión para más de 100.000 registros diarios de voz y esteiras ETL en T-SQL que redujeron auditorías de 1 semana a 10 segundos.'
                  : 'Engineered continuous voice ingestion pipelines for 100,000+ daily records and developed automated T-SQL/Shell ETL scripts slashing manual audit routines from 1 week to 10 seconds.';

              const unifiedSolution =
                language === 'PT'
                  ? 'Gerenciou tráfego massivo de voz e dados em topologias heterogêneas 24/7 (Windows/Linux, LAN/WAN, SIP/VoIP, discadores preditivos e CTI) combinadas a procedures T-SQL otimizadas e automação de banco de dados.'
                  : language === 'FR'
                  ? 'Gestion du trafic massif voix/données 24/7 (Windows/Linux, LAN/WAN, SIP/VoIP, CTI et composeurs prédictifs) combinée à des procédures T-SQL optimisées sans intervention manuelle.'
                  : language === 'ES'
                  ? 'Gestión de tráfico masivo de voz y datos (Windows/Linux, LAN/WAN, SIP/VoIP, CTI y marcadores predictivos) integrada con procedimientos T-SQL optimizados.'
                  : 'Administered 24/7 high-availability telecom infrastructure (Windows/Linux, LAN/WAN, SIP/VoIP, predictive dialers and CTI) combined with optimized T-SQL stored procedures and database automation.';

              const unifiedTechs = Array.from(
                new Set(atentoNodes.flatMap((n) => n.technologies))
              );

              consolidatedAtentoNode = {
                ...baseNode,
                id: 'atento-consolidated-node',
                role: unifiedRole,
                company: 'Atento',
                period: 'Jan 2008 - Dec 2016',
                location: 'São Paulo, Brazil',
                technologies: unifiedTechs,
                careerProgression: progressionText,
                businessValue: unifiedROI,
                engineeringFeat: unifiedFeat,
                architecturalSolution: unifiedSolution,
              };
            }

            const professionalNodes = [
              ...nonAtentoNodes,
              ...(consolidatedSummerhillNode ? [consolidatedSummerhillNode] : []),
              ...(consolidatedAtentoNode ? [consolidatedAtentoNode] : []),
            ].sort((a, b) => parsePeriodEndScore(b.period) - parsePeriodEndScore(a.period));

            return professionalNodes.map((node) => {
              const content = getNodeContent(node, language);
              const isCanadianEN = language === 'EN';

              const roleText = content.role;
              const roiText = content.businessValue;
              const featText = content.engineeringFeat;
              const solText = content.architecturalSolution;

              return (
                <div key={node.id} className="space-y-1 text-xs sm:text-[13px]">
                  {/* Cabeçalho do Cargo: Empresa, Cargo, Período e Badge de País no final da linha */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-bold gap-1 sm:gap-4">
                    <div className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 print:text-black leading-snug">
                      <span className="font-bold mr-2">{node.company}</span>
                      <span className="opacity-40 font-normal mr-1.5">—</span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium print:text-black">
                        {roleText}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] opacity-70 shrink-0 sm:pt-0.5 inline-flex items-center gap-1.5">
                      <span>{node.period} · {node.location}</span>
                      <span className="inline-flex items-center print:hidden" title={node.location}>
                        {node.location.toLowerCase().includes('canada') || node.company.toLowerCase().includes('summerhill') ? (
                          <CanadaFlagSVG />
                        ) : (
                          <BrazilFlagSVG />
                        )}
                      </span>
                    </span>
                  </div>

                  {node.careerProgression && (
                    <div className="text-[11px] font-sans font-medium text-blue-600/90 dark:text-blue-400/90 print:text-zinc-600 print:text-[8.5pt] italic pt-0.5 pb-0.5">
                      {node.careerProgression}
                    </div>
                  )}

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
