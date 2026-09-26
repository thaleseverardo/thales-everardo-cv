import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
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
  ShieldCheck,
  FileText,
  FileCode,
  FileCheck,
} from 'lucide-react';
import { CURRICULUM_NODES, PROFILE_DATA } from '../../data/curriculumData';
import { playSound } from '../../utils/audio';
import { AppLanguage, AppTheme } from '../../types';
import { t, getNodeContent } from '../../i18n/translations';
import { useAuth } from '../../hooks/useAuth';

const LOCALIZED_LANGUAGE_NAMES: Record<AppLanguage, Record<AppLanguage, string>> = {
  PT: { PT: 'Português', EN: 'Inglês', ES: 'Espanhol', FR: 'Francês' },
  EN: { PT: 'Portuguese', EN: 'English', ES: 'Spanish', FR: 'French' },
  ES: { PT: 'Portugués', EN: 'Inglés', ES: 'Español', FR: 'Francés' },
  FR: { PT: 'Portugais', EN: 'Anglais', ES: 'Espagnol', FR: 'Français' },
};

const GoogleLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

interface RawResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  language: AppLanguage;
  theme: AppTheme;
}

export const RawResumeModal: React.FC<RawResumeModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  language: initialLanguage,
  theme,
}) => {
  const { isAuthenticated, contact, signInWithGoogle } = useAuth();
  const [activeLang, setActiveLang] = useState<AppLanguage>(initialLanguage);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [emailCopiedFeedback, setEmailCopiedFeedback] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const email = contact?.email || '';
  const phone = contact?.phone || '';

  if (!isOpen) {
    if (showDownloadMenu) setShowDownloadMenu(false);
    if (showShareMenu) setShowShareMenu(false);
    if (showLangMenu) setShowLangMenu(false);
    return null;
  }

  const handlePrint = () => {
    playSound('click', soundEnabled);
    window.print();
  };

  const getAbsoluteDocUrl = (extension: 'pdf' | 'txt' | 'md' = 'pdf') => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const filename = `Thales_Everardo_CV_${activeLang}.${extension}`;
    const relativePath = `${base}/resumes/${filename}`;
    if (typeof window !== 'undefined') {
      return new URL(relativePath, window.location.origin).href;
    }
    return relativePath;
  };

  const downloadStaticFile = (extension: 'pdf' | 'txt' | 'md') => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const filename = `Thales_Everardo_CV_${activeLang}.${extension}`;
    const fileUrl = `${base}/resumes/${filename}`;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowDownloadMenu(false);
    playSound('success', soundEnabled);
  };

  const getProfileTitle = () => {
    if (activeLang === 'PT') return PROFILE_DATA.titlePT;
    if (activeLang === 'ES') return 'Ingeniero de Software Staff y Arquitecto de Sistemas';
    if (activeLang === 'FR') return 'Ingénieur Logiciel Staff & Architecte de Systèmes';
    return PROFILE_DATA.title;
  };

  const getProfileLocation = () => {
    if (activeLang === 'PT') return 'São Paulo, SP — Brasil';
    if (activeLang === 'FR') return 'São Paulo, Brésil';
    if (activeLang === 'ES') return 'São Paulo, Brasil';
    return 'São Paulo, Brazil';
  };

  const getProfileSummary = () => {
    if (activeLang === 'PT') return PROFILE_DATA.summaryPT;
    if (activeLang === 'ES') {
      return 'Arquitecto de Sistemas e Ingeniero de Software Staff con más de 10 años de experiencia en ingeniería de datos, microservicios distribuidos, tolerancia a fallos y arquitectura dirigida por eventos (EDA). Especialista en eliminar latencias críticas en entornos transaccionales de alto volumen con estricto cumplimiento ACID.';
    }
    if (activeLang === 'FR') {
      return "Architecte de Systèmes et Ingénieur Logiciel Staff avec plus de 10 ans d'expérience en ingénierie des données, microservices distribués, tolérance aux pannes et architectures orientées événements (EDA). Spécialiste de l'élimination des latences critiques dans les environnements transactionnels à haut débit sous stricte conformité ACID.";
    }
    return PROFILE_DATA.summary;
  };

  const getEducationDegree = (degree: string, degreePT: string) => {
    if (activeLang === 'PT') return degreePT;
    if (activeLang === 'ES') {
      return degreePT.includes('Pós-Graduação')
        ? 'Posgrado en Arquitectura de Software y Sistemas Distribuidos'
        : 'Licenciatura en Tecnología de la Información y Sistemas';
    }
    if (activeLang === 'FR') {
      return degreePT.includes('Pós-Graduação')
        ? "Diplôme d'Études Supérieures en Architecture Logicielle et Systèmes Distribués"
        : "Licence en Technologies de l'Information et Systèmes";
    }
    return degree;
  };

  const getMarkdownResume = () => {
    return `# Thales Everardo
**${getProfileTitle()}**

📧 ${isAuthenticated ? email : '[Protected - Google Sign-In Required]'} | 📱 ${isAuthenticated ? phone : '[Protected - Google Sign-In Required]'} | 📍 ${getProfileLocation()}
🔗 [GitHub](${PROFILE_DATA.github}) | 🔗 [LinkedIn](${PROFILE_DATA.linkedin})

---

## ${t(activeLang, 'resume.executiveSummary')}
${getProfileSummary()}

---

## ${t(activeLang, 'resume.coreExperience')}
${CURRICULUM_NODES.map((n) => {
  const c = getNodeContent(n, activeLang);
  return `### ${n.company} — ${c.role}
*${n.period} | ${n.location}*

- **${t(activeLang, 'resume.businessRoi')}** ${c.businessValue}
- **${t(activeLang, 'resume.engineeringFeat')}** ${c.engineeringFeat}
- **${t(activeLang, 'resume.solution')}** ${c.architecturalSolution}
- **Stack:** \`${n.technologies.join('`, `')}\`
`;
}).join('\n')}
---

## ${t(activeLang, 'resume.educationCert')}
${PROFILE_DATA.education.map((e) => `- **${getEducationDegree(e.degree, e.degreePT)}**, ${e.institution}`).join('\n')}
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(getMarkdownResume());
    setCopied(true);
    playSound('click', soundEnabled);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPdfLink = () => {
    const pdfUrl = getAbsoluteDocUrl('pdf');
    navigator.clipboard.writeText(pdfUrl);
    setCopiedLink(true);
    playSound('success', soundEnabled);
    setTimeout(() => {
      setCopiedLink(false);
      setShowShareMenu(false);
    }, 1800);
  };

  const handleShareWhatsApp = () => {
    const pdfUrl = getAbsoluteDocUrl('pdf');
    const msg = `${t(activeLang, 'resume.shareWhatsAppMsg')}${pdfUrl}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
    playSound('click', soundEnabled);
  };

  const handleShareLinkedIn = () => {
    const pdfUrl = getAbsoluteDocUrl('pdf');
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pdfUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setShowShareMenu(false);
    playSound('click', soundEnabled);
  };

  const handleShareEmail = () => {
    const pdfUrl = getAbsoluteDocUrl('pdf');
    const subject = t(activeLang, 'resume.shareEmailSubject');
    const body = t(activeLang, 'resume.shareEmailBody').replace('{url}', pdfUrl);

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const anchor = document.createElement('a');
    anchor.href = mailtoUrl;
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    navigator.clipboard.writeText(pdfUrl);
    setEmailCopiedFeedback(true);
    playSound('success', soundEnabled);

    setTimeout(() => {
      setEmailCopiedFeedback(false);
      setShowShareMenu(false);
    }, 1800);
  };

  const handleNativeShare = async () => {
    const pdfUrl = getAbsoluteDocUrl('pdf');
    const title = `Thales Everardo - CV (${activeLang})`;
    const text = `${PROFILE_DATA.name} - ${getProfileTitle()}`;

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title, text, url: pdfUrl });
        setShowShareMenu(false);
        playSound('success', soundEnabled);
      }
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-0 sm:p-6 overflow-hidden print:p-0 print:bg-white print:static"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-4xl rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl flex flex-col overflow-hidden border-0 sm:border print:border-none print:shadow-none print:max-h-none print:w-full print:h-auto print:bg-white print:text-black transition-colors ${
          theme === 'dark'
            ? 'bg-zinc-950 sm:border-zinc-800 text-zinc-100'
            : 'bg-white sm:border-slate-300 text-slate-900'
        }`}
      >
        {/* BARRA SUPERIOR (EXECUTIVE STUDIO TOOLBAR) */}
        <header
          className={`px-3.5 sm:px-6 h-14 border-b flex items-center justify-between shrink-0 print:hidden select-none ${
            theme === 'dark' ? 'bg-zinc-900/95 border-zinc-800 text-zinc-100' : 'bg-slate-100/95 border-slate-200 text-slate-900'
          }`}
        >
          {/* BOTÃO VOLTAR (EXTREMA ESQUERDA NO MOBILE // OCULTO NO DESKTOP) */}
          <button
            type="button"
            onClick={onClose}
            className={`sm:hidden h-9 w-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95 ${
              theme === 'dark'
                ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
            aria-label={activeLang === 'PT' ? 'Voltar' : activeLang === 'ES' ? 'Volver' : activeLang === 'FR' ? 'Retour' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* SELETOR DE IDIOMA (ml-auto NO MOBILE VAI PARA A DIREITA // sm:ml-0 NO DESKTOP FICA NA ESQUERDA) */}
          <div className="relative z-10 ml-auto sm:ml-0">
            <button
              type="button"
              onClick={() => {
                setShowLangMenu((prev) => !prev);
                setShowDownloadMenu(false);
                setShowShareMenu(false);
                playSound('click', soundEnabled);
              }}
              className={`h-9 px-3 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showLangMenu
                  ? 'bg-slate-200 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 text-blue-600 dark:text-cyan-400'
                  : 'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 shadow-2xs'
              }`}
              aria-expanded={showLangMenu}
              aria-label={t(activeLang, "nav.language")}
            >
              <Globe className="w-3.5 h-3.5 opacity-70" />
              <span>{activeLang}</span>
              <ChevronDown className={`w-3 h-3 opacity-60 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
            </button>

            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                <div className="absolute top-full right-0 sm:right-auto sm:left-0 mt-2.5 w-48 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden z-50 font-sans animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-zinc-500 uppercase border-b border-slate-100 dark:border-white/5">
                    {t(activeLang, 'nav.language')}
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    {(['PT', 'EN', 'ES', 'FR'] as const).map((code) => {
                      const isSelected = activeLang === code;
                      const label = LOCALIZED_LANGUAGE_NAMES[activeLang][code];
                      return (
                        <button
                          key={code}
                          onClick={() => {
                            setActiveLang(code);
                            setShowLangMenu(false);
                            playSound('click', soundEnabled);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white font-semibold shadow-xs'
                              : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/70'
                          }`}
                        >
                          <span className="tracking-tight">{label}</span>
                          <span
                            className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                            }`}
                          >
                            {code}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* AÇÕES EXCLUSIVAS DO DESKTOP (NO MOBILE FICAM NO DOCK INFERIOR) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* GRUPO DE UTILITÁRIOS */}
            <div
              className={`flex items-center h-8 rounded-lg border overflow-hidden divide-x ${
                theme === 'dark'
                  ? 'bg-zinc-950 border-zinc-800 divide-zinc-800 text-zinc-300'
                  : 'bg-white border-slate-200 divide-slate-200 text-slate-700 shadow-2xs'
              }`}
            >
              {/* COPIAR MARKDOWN */}
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="h-full px-2.5 flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-xs font-mono"
                title={copied ? t(activeLang, 'resume.copied') : t(activeLang, 'resume.copy')}
                aria-label={t(activeLang, 'resume.copy')}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
                <span className="hidden md:inline opt-mono font-medium">
                  {copied ? t(activeLang, 'resume.copied') : 'Markdown'}
                </span>
              </button>

              {/* IMPRIMIR */}
              <button
                type="button"
                onClick={handlePrint}
                className="h-full px-2.5 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                title={t(activeLang, 'resume.print')}
                aria-label={t(activeLang, 'resume.print')}
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
                    setShowLangMenu(false);
                    playSound('click', soundEnabled);
                  }}
                  className={`h-full px-2.5 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer ${
                    showShareMenu ? 'bg-slate-100 dark:bg-zinc-900 text-blue-600 dark:text-cyan-400' : ''
                  }`}
                  title={t(activeLang, 'resume.shareResume')}
                  aria-expanded={showShareMenu}
                >
                  <Share2 className="w-3.5 h-3.5 opacity-70" />
                </button>

                {showShareMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
                    <div className="absolute top-full right-0 mt-2 w-54 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 font-mono text-xs animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3.5 py-2 text-[10px] font-bold opacity-60 uppercase border-b border-slate-100 dark:border-zinc-800 tracking-wider">
                        {t(activeLang, 'resume.shareResume')}
                      </div>
                      <button
                        onClick={handleShareWhatsApp}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/80 flex items-center gap-2.5 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={handleShareLinkedIn}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/80 flex items-center gap-2.5 cursor-pointer"
                      >
                        <Linkedin className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                        <span>LinkedIn</span>
                      </button>
                      <button
                        onClick={handleShareEmail}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>E-mail</span>
                        </span>
                        {emailCopiedFeedback && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            {t(activeLang, 'resume.linkCopied')}
                          </span>
                        )}
                      </button>
                      {typeof navigator !== 'undefined' && 'share' in navigator && (
                        <button
                          onClick={handleNativeShare}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/80 flex items-center gap-2.5 cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                          <span>{t(activeLang, 'resume.otherApps')}</span>
                        </button>
                      )}
                      <button
                        onClick={handleCopyPdfLink}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors text-slate-800 dark:text-zinc-200 flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          {copiedLink ? (
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <LinkIcon className="w-4 h-4 opacity-60 shrink-0" />
                          )}
                          <span className="truncate">
                            {copiedLink
                              ? t(activeLang, 'resume.linkCopied')
                              : t(activeLang, 'resume.copyPdfLink')}
                          </span>
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* CTA PRIMÁRIO DESKTOP: BAIXAR MULTIFORMATO */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowDownloadMenu((prev) => !prev);
                  setShowLangMenu(false);
                  setShowShareMenu(false);
                  playSound('click', soundEnabled);
                }}
                className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-900/20 ring-1 ring-inset ring-white/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
                title={t(activeLang, 'resume.staticDownload')}
                aria-expanded={showDownloadMenu}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="opt-mono">
                  {activeLang === 'PT'
                    ? 'Baixar'
                    : activeLang === 'ES'
                    ? 'Descargar'
                    : activeLang === 'FR'
                    ? 'Télécharger'
                    : 'Download'}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
              </button>

              {showDownloadMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDownloadMenu(false)} />
                  <div className="absolute top-full right-0 mt-2.5 w-64 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl shadow-2xl shadow-black/70 overflow-hidden z-50 font-sans animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-zinc-500 uppercase border-b border-slate-100 dark:border-white/5">
                      {t(activeLang, 'resume.staticDownload')}
                    </div>
                    <div className="p-1.5 space-y-1">
                      <button
                        onClick={() => downloadStaticFile('pdf')}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/70 transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                            <FileCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100">PDF Oficial</div>
                            <div className="text-[11px] text-slate-500 dark:text-zinc-400">Documento Timbrado (.pdf)</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => downloadStaticFile('txt')}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/70 transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100">Texto Puro</div>
                            <div className="text-[11px] text-slate-500 dark:text-zinc-400">ATS Machine-readable (.txt)</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => downloadStaticFile('md')}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/70 transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                            <FileCode className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100">Markdown</div>
                            <div className="text-[11px] text-slate-500 dark:text-zinc-400">CommonMark Source (.md)</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* SEPARADOR FÍSICO */}
            <div className="w-px h-5 bg-slate-300 dark:bg-zinc-800 mx-1.5" />

            {/* FECHAR MODAL (DESKTOP) */}
            <button
              onClick={onClose}
              className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
              aria-label={t(activeLang, 'auth.close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* CORPO DO CV (CANVAS TIMBRADO LIMPO E PROFISSIONAL) */}
        <div
          className={`flex-1 overflow-y-auto p-4 sm:p-12 font-sans leading-relaxed text-sm pb-28 sm:pb-12 print:p-0 print:text-black print:overflow-visible ${
            theme === 'dark' ? 'bg-zinc-950 text-zinc-200' : 'bg-white text-slate-800'
          }`}
        >
          {/* CABEÇALHO */}
          <div className="border-b-2 pb-6 mb-7 dark:border-zinc-800 border-slate-200 print:border-black">
            <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-slate-900 dark:text-zinc-100 print:text-black pr-10">
              {PROFILE_DATA.name.toUpperCase()}
            </h1>
            <div className="text-sm sm:text-base font-sans font-semibold text-blue-600 dark:text-blue-400 mt-1 print:text-black">
              {getProfileTitle()}
            </div>

            {/* DADOS DE CONTATO & CLEARANCE DE SEGURANÇA */}
            <div data-nosnippet="true" className="mt-4">
              {isAuthenticated ? (
                /* ESTADO AUTENTICADO: LINHA EXECUTIVA CONTÍNUA */
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-xs font-mono opacity-90">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                    <a href={`mailto:${email}`} className="hover:underline font-semibold select-all">
                      {email || t(activeLang, 'resume.loading')}
                    </a>
                  </span>
                  <span className="opacity-30">•</span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold select-all">
                      {phone || t(activeLang, 'resume.loading')}
                    </a>
                  </span>
                  <span className="opacity-30">•</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{getProfileLocation()}</span>
                  </span>
                  <span className="opacity-30 hidden sm:inline">•</span>
                  <span className="hidden sm:flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                    <Globe className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0" />
                    <span>{t(activeLang, 'resume.availability')}</span>
                  </span>
                </div>
              ) : (
                /* ESTADO NÃO AUTENTICADO: ENTERPRISE SECURITY CLEARANCE CARD */
                <div className="space-y-3">
                  <div
                    className={`w-full p-4 rounded-2xl border transition-all ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-zinc-900/90 via-zinc-900/50 to-zinc-950/80 border-white/10 shadow-lg shadow-black/40'
                        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100/60 border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5 text-blue-600 dark:text-cyan-400">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="font-sans font-semibold text-xs sm:text-sm text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                            <span>{t(activeLang, 'resume.gateTitle')}</span>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/10 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 font-bold tracking-wider">
                              OAuth 2.0
                            </span>
                          </div>
                          <p className="font-sans text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                            {t(activeLang, 'resume.gateDesc')}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => signInWithGoogle()}
                        className="h-10 px-4 rounded-xl font-sans text-xs font-semibold bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-100 border border-slate-300/80 dark:border-white/10 shadow-sm transition-all flex items-center justify-center gap-2.5 shrink-0 cursor-pointer active:scale-95"
                      >
                        <GoogleLogo />
                        <span>{t(activeLang, 'resume.gateButton')}</span>
                      </button>
                    </div>
                  </div>

                  {/* METADADOS POLIDOS SEM DUPLICAÇÃO TEXTUAL */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-mono opacity-85 pt-0.5 pl-0.5">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{getProfileLocation()}</span>
                    </div>
                    <span className="opacity-30 hidden sm:inline">•</span>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 text-[11px]">
                      <Globe className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0" />
                      <span>{t(activeLang, 'resume.availability')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RESUMO EXECUTIVO */}
          <div className="mb-6 space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-slate-200 text-blue-600 dark:text-blue-400 print:text-black">
              {t(activeLang, 'resume.executiveSummary')}
            </h2>
            <p className="text-sm opacity-90 leading-relaxed font-sans">
              {getProfileSummary()}
            </p>
          </div>

          {/* EXPERIÊNCIA ARQUITETURAL */}
          <div className="mb-6 space-y-5">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-slate-200 text-blue-600 dark:text-blue-400 print:text-black">
              {t(activeLang, 'resume.coreExperience')}
            </h2>

            {CURRICULUM_NODES.map((node) => {
              const content = getNodeContent(node, activeLang);

              return (
                <div key={node.id} className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between font-bold gap-1 sm:gap-4">
                    <div className="text-sm sm:text-base text-slate-900 dark:text-zinc-100 print:text-black leading-snug">
                      <span className="inline-flex items-center gap-1.5 mr-1.5">
                        {node.company}
                        <span
                          className="text-[15px] leading-none -translate-y-px select-none"
                          title={node.location}
                          aria-label={node.location}
                        >
                          {node.location.toLowerCase().includes('canada') || node.company.includes('Summerhill') ? '🇨🇦' : '🇧🇷'}
                        </span>
                      </span>
                      <span className="opacity-50 font-normal mr-1.5">—</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium print:text-black">
                        {content.role}
                      </span>
                    </div>
                    <span className="font-mono text-xs opacity-70 shrink-0 sm:pt-0.5">{node.period}</span>
                  </div>

                  <div className="p-2.5 rounded border font-sans text-xs bg-blue-50/60 dark:bg-zinc-900/60 dark:border-zinc-800 border-blue-200 text-slate-800 dark:text-zinc-200 print:border-gray-300">
                    <strong className="text-blue-700 dark:text-blue-400">{t(activeLang, 'resume.businessRoi')} </strong>
                    {content.businessValue}
                  </div>

                  <p className="opacity-90 leading-relaxed">
                    <strong>{t(activeLang, 'resume.engineeringFeat')} </strong>
                    {content.engineeringFeat}
                  </p>

                  <p className="opacity-80 leading-relaxed">
                    <strong>{t(activeLang, 'resume.solution')} </strong>
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
          <div className="mb-6 space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-slate-200 text-blue-600 dark:text-blue-400 print:text-black">
              {t(activeLang, 'resume.educationCert')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              {PROFILE_DATA.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded border dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border-slate-200 print:border-gray-300"
                >
                  <div className="font-bold text-slate-900 dark:text-zinc-100 print:text-black">
                    {getEducationDegree(edu.degree, edu.degreePT)}
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 font-semibold mt-0.5 print:text-black">
                    {edu.institution}
                  </div>
                  <div className="opacity-70 mt-1">{activeLang === 'PT' ? edu.focusPT : edu.focus}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DOCK INFERIOR DE AÇÕES (EXCLUSIVO MOBILE // NATIVE THUMB DOCK) */}
        <footer
          className={`sm:hidden border-t px-4 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom,0px))] flex items-center gap-2.5 shrink-0 select-none z-30 ${
            theme === 'dark' ? 'bg-zinc-900/95 border-zinc-800 text-zinc-100' : 'bg-slate-100/95 border-slate-200 text-slate-900'
          }`}
        >
          {/* COPIAR */}
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95 ${
              theme === 'dark'
                ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
            title={copied ? t(activeLang, 'resume.copied') : t(activeLang, 'resume.copy')}
            aria-label={t(activeLang, 'resume.copy')}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 opacity-75" />}
          </button>

          {/* IMPRIMIR */}
          <button
            type="button"
            onClick={handlePrint}
            className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95 ${
              theme === 'dark'
                ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
            title={t(activeLang, 'resume.print')}
            aria-label={t(activeLang, 'resume.print')}
          >
            <Printer className="w-4 h-4 opacity-75" />
          </button>

          {/* COMPARTILHAR (MENU ABRE PARA CIMA NO MOBILE) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowShareMenu((prev) => !prev);
                setShowDownloadMenu(false);
                setShowLangMenu(false);
                playSound('click', soundEnabled);
              }}
              className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95 ${
                showShareMenu
                  ? 'bg-slate-200 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 text-blue-600 dark:text-cyan-400'
                  : theme === 'dark'
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={t(activeLang, 'resume.shareResume')}
              aria-expanded={showShareMenu}
            >
              <Share2 className="w-4 h-4 opacity-75" />
            </button>

            {showShareMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
                <div className="absolute bottom-full left-0 mb-3 w-56 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl shadow-2xl shadow-black/70 overflow-hidden z-50 font-sans animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-zinc-500 uppercase border-b border-slate-100 dark:border-white/5">
                    {t(activeLang, 'resume.shareResume')}
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={handleShareWhatsApp}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/70 transition-colors text-slate-800 dark:text-zinc-200 flex items-center gap-2.5 cursor-pointer text-xs font-medium"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={handleShareLinkedIn}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/70 transition-colors text-slate-800 dark:text-zinc-200 flex items-center gap-2.5 cursor-pointer text-xs font-medium"
                    >
                      <Linkedin className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={handleShareEmail}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/70 transition-colors text-slate-800 dark:text-zinc-200 flex items-center justify-between cursor-pointer text-xs font-medium"
                    >
                      <span className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>E-mail</span>
                      </span>
                      {emailCopiedFeedback && (
                        <span className="text-[10px] font-bold text-emerald-500">
                          {t(activeLang, 'resume.linkCopied')}
                        </span>
                      )}
                    </button>
                    {typeof navigator !== 'undefined' && 'share' in navigator && (
                      <button
                        onClick={handleNativeShare}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/70 transition-colors text-slate-800 dark:text-zinc-200 flex items-center gap-2.5 cursor-pointer text-xs font-medium"
                      >
                        <ExternalLink className="w-4 h-4 text-purple-500 shrink-0" />
                        <span>{t(activeLang, 'resume.otherApps')}</span>
                      </button>
                    )}
                    <button
                      onClick={handleCopyPdfLink}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/70 transition-colors text-slate-800 dark:text-zinc-200 flex items-center justify-between cursor-pointer text-xs font-medium"
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        {copiedLink ? (
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <LinkIcon className="w-4 h-4 opacity-60 shrink-0" />
                        )}
                        <span className="truncate">
                          {copiedLink
                            ? t(activeLang, 'resume.linkCopied')
                            : t(activeLang, 'resume.copyPdfLink')}
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* CTA PRIMÁRIO: BAIXAR MULTIFORMATO (MENU ABRE PARA CIMA NO MOBILE) */}
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => {
                setShowDownloadMenu((prev) => !prev);
                setShowLangMenu(false);
                setShowShareMenu(false);
                playSound('click', soundEnabled);
              }}
              className="w-full h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold tracking-wide transition-all shadow-lg shadow-blue-900/30 ring-1 ring-inset ring-white/20 flex items-center justify-between cursor-pointer active:scale-95"
              aria-expanded={showDownloadMenu}
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span className="opt-mono">
                  {activeLang === 'PT'
                    ? 'Baixar'
                    : activeLang === 'ES'
                    ? 'Descargar'
                    : activeLang === 'FR'
                    ? 'Télécharger'
                    : 'Download'}
                </span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
            </button>

            {showDownloadMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDownloadMenu(false)} />
                <div className="absolute bottom-full right-0 mb-3 w-64 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl shadow-2xl shadow-black/70 overflow-hidden z-50 font-sans animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-zinc-500 uppercase border-b border-slate-100 dark:border-white/5">
                    {t(activeLang, 'resume.staticDownload')}
                  </div>
                  <div className="p-1.5 space-y-1">
                    <button
                      onClick={() => downloadStaticFile('pdf')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/70 transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{t(activeLang, 'resume.formatPdfTitle')}</div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400">{t(activeLang, 'resume.formatPdfSub')}</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => downloadStaticFile('txt')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/70 transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{t(activeLang, 'resume.formatTxtTitle')}</div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400">{t(activeLang, 'resume.formatTxtSub')}</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => downloadStaticFile('md')}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/70 transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                          <FileCode className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{t(activeLang, 'resume.formatMdTitle')}</div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400">{t(activeLang, 'resume.formatMdSub')}</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};
