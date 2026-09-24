import { useAuth } from '../../hooks/useAuth';
import React, { useState } from 'react';
import {
  X,
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
} from 'lucide-react';
import { CURRICULUM_NODES, PROFILE_DATA } from '../../data/curriculumData';
import { playSound } from '../../utils/audio';
import { AppLanguage, AppTheme } from '../../types';
import { t, getNodeContent } from '../../i18n/translations';

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
  const [activeLang, setActiveLang] = useState<AppLanguage>(initialLanguage);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [emailCopiedFeedback, setEmailCopiedFeedback] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { isAuthenticated, contact, signInWithGoogle } = useAuth();

  if (!isOpen) {
    if (showDownloadMenu) setShowDownloadMenu(false);
    if (showShareMenu) setShowShareMenu(false);
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

  const getMarkdownResume = () => {
    const isPT = activeLang === 'PT';
    return `# Thales Everardo
**${isPT ? PROFILE_DATA.titlePT : PROFILE_DATA.title}**

📧 ${PROFILE_DATA.email} | 📱 ${PROFILE_DATA.phone} | 📍 ${isPT ? PROFILE_DATA.locationPT : PROFILE_DATA.location}
🔗 [GitHub](${PROFILE_DATA.github}) | 🔗 [LinkedIn](${PROFILE_DATA.linkedin})

---

## ${t(activeLang, 'resume.executiveSummary')}
${isPT ? PROFILE_DATA.summaryPT : PROFILE_DATA.summary}

---

## ${t(activeLang, 'resume.coreExperience')}
${CURRICULUM_NODES.map((n) => {
  const content = getNodeContent(n, activeLang);
  return `### ${n.company} — ${content.role}
*${n.period} | ${n.location}*

- **${t(activeLang, 'resume.businessRoi')}** ${content.businessValue}
- **${t(activeLang, 'resume.engineeringFeat')}** ${content.engineeringFeat}
- **${t(activeLang, 'resume.solution')}** ${content.architecturalSolution}
- **Stack:** \`${n.technologies.join('`, `')}\`
`;
}).join('\n')}
---

## ${t(activeLang, 'resume.educationCert')}
${PROFILE_DATA.education.map((e) => `- **${isPT ? e.degreePT : e.degree}**, ${e.institution}`).join('\n')}
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
    const msg =
      activeLang === 'PT'
        ? `Confira o currículo de Thales Everardo (Arquiteto de Sistemas / Staff Engineer): ${pdfUrl}`
        : activeLang === 'ES'
        ? `Consulte el currículum de Thales Everardo (Arquitecto de Sistemas / Staff Engineer): ${pdfUrl}`
        : activeLang === 'FR'
        ? `Consultez le CV de Thales Everardo (Architecte Systèmes / Staff Engineer): ${pdfUrl}`
        : `Check out Thales Everardo's Resume (Systems Architect / Staff Engineer): ${pdfUrl}`;

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

  // PADRÃO OURO DE MERCADO: Protocolo universal mailto + cópia resiliente do link simultânea
  const handleShareEmail = () => {
    const pdfUrl = getAbsoluteDocUrl('pdf');
    const subject =
      activeLang === 'PT'
        ? 'Currículo de Thales Everardo // Arquiteto de Sistemas'
        : activeLang === 'ES'
        ? 'Currículum de Thales Everardo // Arquitecto de Sistemas'
        : activeLang === 'FR'
        ? 'CV de Thales Everardo // Architecte Systèmes'
        : 'Resume - Thales Everardo // Systems Architect';

    const body =
      activeLang === 'PT'
        ? `Olá,\r\n\r\nAcesse o currículo atualizado em PDF de Thales Everardo através do link direto abaixo:\r\n${pdfUrl}\r\n\r\nAtenciosamente,`
        : activeLang === 'ES'
        ? `Hola,\r\n\r\nConsulte el currículum actualizado en PDF de Thales Everardo en el enlace directo a continuación:\r\n${pdfUrl}\r\n\r\nSaludos cordiales,`
        : activeLang === 'FR'
        ? `Bonjour,\r\n\r\nVeuillez trouver le CV à jour de Thales Everardo via le lien direct ci-dessous :\r\n${pdfUrl}\r\n\r\nCordialement,`
        : `Hello,\r\n\r\nPlease find the updated PDF resume of Thales Everardo via the direct link below:\r\n${pdfUrl}\r\n\r\nBest regards,`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // 1. Dispara o protocolo do sistema operacional (abre Apple Mail, Outlook, app de email do celular, etc.)
    const anchor = document.createElement('a');
    anchor.href = mailtoUrl;
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // 2. Fallback resiliente: copia o link direto do PDF para a área de transferência caso não haja app instalado
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
    const text =
      activeLang === 'PT'
        ? 'Currículo de Thales Everardo - Arquiteto de Sistemas & Staff Engineer'
        : 'Resume - Thales Everardo - Systems Architect & Staff Software Engineer';

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title, text, url: pdfUrl });
        setShowShareMenu(false);
        playSound('success', soundEnabled);
      }
    } catch {
      // Ignora cancelamento pelo usuário
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:text-black transition-colors ${
          theme === 'dark'
            ? 'bg-zinc-950 border-zinc-800 text-zinc-100'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {/* BARRA SUPERIOR HARMONIZADA */}
        <div
          className={`px-4 sm:px-6 h-14 border-b flex items-center justify-between gap-3 shrink-0 print:hidden ${
            theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-slate-100/90 border-slate-200'
          }`}
        >
          {/* LADO ESQUERDO: SEGMENTED CONTROL SIMÉTRICO */}
          <div className="flex items-center min-w-0">
            <div
              role="tablist"
              aria-label="Language selector"
              className={`grid grid-cols-4 w-36 sm:w-48 h-9 p-1 rounded-lg border text-xs font-mono shadow-2xs shrink-0 ${
                theme === 'dark'
                  ? 'bg-zinc-950 border-zinc-800'
                  : 'bg-white border-slate-300'
              }`}
            >
              {(['PT', 'EN', 'ES', 'FR'] as const).map((langCode) => {
                const isActive = activeLang === langCode;
                return (
                  <button
                    key={langCode}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      if (!isActive) {
                        setActiveLang(langCode);
                        playSound('click', soundEnabled);
                      }
                    }}
                    className={`w-full h-full rounded-md text-[11px] font-bold transition-all flex items-center justify-center focus:outline-hidden focus-visible:ring-1 focus-visible:ring-blue-500 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : theme === 'dark'
                        ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {langCode}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LADO DIREITO: ORDEM HARMONIZADA [IMPRIMIR] -> [DOWNLOAD] -> [COMPARTILHAR] -> [FECHAR] */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 1. IMPRIMIR (oculto no mobile para evitar overflow horizontal em telas < 390px) */}
            <button
              onClick={handlePrint}
              className={`hidden sm:flex h-9 w-9 rounded-lg border items-center justify-center transition-all focus:outline-hidden focus-visible:ring-1 focus-visible:ring-blue-500 shadow-2xs ${
                theme === 'dark'
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={t(activeLang, 'resume.print')}
              aria-label={t(activeLang, 'resume.print')}
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* 2. DOWNLOAD */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDownloadMenu((prev) => !prev);
                  setShowShareMenu(false);
                  playSound('click', soundEnabled);
                }}
                className={`h-9 w-9 rounded-lg border flex items-center justify-center transition-all focus:outline-hidden focus-visible:ring-1 focus-visible:ring-blue-500 shadow-2xs ${
                  showDownloadMenu
                    ? theme === 'dark'
                      ? 'bg-zinc-900 border-cyan-500/50 text-cyan-300 shadow-sm'
                      : 'bg-blue-50 border-blue-400 text-blue-700 shadow-sm'
                    : theme === 'dark'
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title="Download"
                aria-expanded={showDownloadMenu}
                aria-haspopup="menu"
              >
                <Download className="w-4 h-4" />
              </button>

              {showDownloadMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDownloadMenu(false)} />
                  <div className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 font-mono text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2 text-[10px] font-bold opacity-60 uppercase border-b border-slate-100 dark:border-zinc-800 tracking-wider">
                      {activeLang === 'PT' ? 'Download Estático' : 'Static Download'}
                    </div>

                    <button
                      onClick={() => downloadStaticFile('pdf')}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between"
                    >
                      <span className="font-semibold">PDF (.pdf)</span>
                      <span className="text-[10px] opacity-50 font-mono">Adobe PDF</span>
                    </button>
                    <button
                      onClick={() => downloadStaticFile('txt')}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between"
                    >
                      <span className="font-semibold">Plain Text (.txt)</span>
                      <span className="text-[10px] opacity-50 font-mono">Raw Text</span>
                    </button>
                    <button
                      onClick={() => downloadStaticFile('md')}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors text-slate-800 dark:text-zinc-200 flex items-center justify-between"
                    >
                      <span className="font-semibold">Markdown (.md)</span>
                      <span className="text-[10px] opacity-50 font-mono">CommonMark</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 3. COMPARTILHAR (PADRÃO OURO DE MERCADO) */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowShareMenu((prev) => !prev);
                  setShowDownloadMenu(false);
                  playSound('click', soundEnabled);
                }}
                className={`h-9 w-9 rounded-lg border flex items-center justify-center transition-all focus:outline-hidden focus-visible:ring-1 focus-visible:ring-blue-500 shadow-2xs ${
                  showShareMenu
                    ? theme === 'dark'
                      ? 'bg-zinc-900 border-cyan-500/50 text-cyan-300 shadow-sm'
                      : 'bg-blue-50 border-blue-400 text-blue-700 shadow-sm'
                    : theme === 'dark'
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title={activeLang === 'PT' ? 'Compartilhar' : 'Share'}
                aria-expanded={showShareMenu}
                aria-haspopup="menu"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {showShareMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
                  <div className="absolute top-full right-0 mt-2 w-54 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 font-mono text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2 text-[10px] font-bold opacity-60 uppercase border-b border-slate-100 dark:border-zinc-800 tracking-wider">
                      {activeLang === 'PT' ? 'Compartilhar CV' : 'Share Resume'}
                    </div>

                    <button
                      onClick={handleShareWhatsApp}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/80 flex items-center gap-2.5"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={handleShareLinkedIn}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/80 flex items-center gap-2.5"
                    >
                      <Linkedin className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                      <span>LinkedIn</span>
                    </button>

                    {/* E-MAIL UNIVERSAL (MAILTO + AUTO-COPY FALLBACK) */}
                    <button
                      onClick={handleShareEmail}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>E-mail</span>
                      </span>
                      {emailCopiedFeedback && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {activeLang === 'PT' ? 'Link copiado!' : 'Link copied!'}
                        </span>
                      )}
                    </button>

                    {typeof navigator !== 'undefined' && 'share' in navigator && (
                      <button
                        onClick={handleNativeShare}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/80 flex items-center gap-2.5"
                      >
                        <ExternalLink className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span>{activeLang === 'PT' ? 'Outros Apps...' : 'Other Apps...'}</span>
                      </button>
                    )}

                    {/* COPIAR LINK DO PDF */}
                    <button
                      onClick={handleCopyPdfLink}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors text-slate-800 dark:text-zinc-200 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        {copiedLink ? (
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <LinkIcon className="w-4 h-4 opacity-60 shrink-0" />
                        )}
                        <span className="truncate">
                          {copiedLink
                            ? activeLang === 'PT'
                              ? 'Link Copiado!'
                              : 'Copied!'
                            : activeLang === 'PT'
                            ? 'Copiar Link do PDF'
                            : 'Copy PDF Link'}
                        </span>
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* SEPARADOR GEOMÉTRICO */}
            <div className="w-px h-5 bg-slate-300 dark:bg-zinc-800 mx-0.5" />

            {/* 4. FECHAR (X) */}
            <button
              onClick={onClose}
              className={`h-9 w-9 rounded-lg border border-transparent flex items-center justify-center transition-all focus:outline-hidden focus-visible:ring-1 focus-visible:ring-blue-500 ${
                theme === 'dark'
                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 hover:border-slate-300'
              }`}
              aria-label="Fechar"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* CORPO DO CURRÍCULO */}
        <div
          className={`flex-1 overflow-y-auto p-5 sm:p-10 font-sans leading-relaxed text-sm print:p-0 print:text-black print:overflow-visible ${
            theme === 'dark' ? 'bg-zinc-950 text-zinc-200' : 'bg-white text-slate-800'
          }`}
        >
          <div className="relative border-b-2 pb-5 mb-6 dark:border-zinc-800 border-slate-300 print:border-black">
            <button
              onClick={handleCopyMarkdown}
              className="absolute top-0 right-0 p-1 text-slate-400 hover:text-slate-800 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors print:hidden focus:outline-none"
              title={copied ? t(activeLang, 'resume.copied') : t(activeLang, 'resume.copy')}
              aria-label={t(activeLang, 'resume.copy')}
            >
              {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
            </button>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-slate-900 dark:text-zinc-100 print:text-black pr-10">
              {PROFILE_DATA.name.toUpperCase()}
            </h1>
            <div className="text-sm sm:text-base font-sans font-semibold text-blue-600 dark:text-blue-400 mt-1 print:text-black">
              {activeLang === 'PT' ? PROFILE_DATA.titlePT : PROFILE_DATA.title}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono opacity-80 mt-3">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {isAuthenticated ? (
                  <a href={`mailto:${contact.email}`} className="hover:underline text-emerald-600 dark:text-emerald-400 font-bold">
                    {contact.email}
                  </a>
                ) : (
                  <button onClick={() => signInWithGoogle()} className="text-amber-500 hover:underline">
                    [🔒 {activeLang === 'PT' ? 'Fazer login para ver e-mail' : 'Login to view email'}]
                  </button>
                )}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {isAuthenticated ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{contact.phone}</span>
                ) : (
                  <button onClick={() => signInWithGoogle()} className="text-amber-500 hover:underline">
                    [🔒 {activeLang === 'PT' ? 'Telefone protegido' : 'Phone protected'}]
                  </button>
                )}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{activeLang === 'PT' ? PROFILE_DATA.locationPT : PROFILE_DATA.location}</span>
              </span>
            </div>
          </div>

          <div className="mb-6 space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-slate-200 text-blue-600 dark:text-blue-400 print:text-black">
              {t(activeLang, 'resume.executiveSummary')}
            </h2>
            <p className="text-sm opacity-90 leading-relaxed font-sans">
              {activeLang === 'PT' ? PROFILE_DATA.summaryPT : PROFILE_DATA.summary}
            </p>
          </div>

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
                    {activeLang === 'PT' ? edu.degreePT : edu.degree}
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
      </div>
    </div>
  );
};
