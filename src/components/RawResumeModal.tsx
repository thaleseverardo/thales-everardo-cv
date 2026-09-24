import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { CURRICULUM_NODES, PROFILE_DATA } from '../data/curriculumData';
import { playSound } from '../utils/audio';
import { AppLanguage, AppTheme } from '../types';

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

  if (!isOpen) return null;

  const isPT = activeLang === 'PT';

  const handlePrint = () => {
    playSound('click', soundEnabled);
    window.print();
  };

  const getPlainTextResume = () => {
    if (isPT) {
      return `THALES REIS - ARQUITETO DE SISTEMAS // ENGENHEIRO DE SOFTWARE
E-mail: ${PROFILE_DATA.email} | Telefone: ${PROFILE_DATA.phone} | Localização: ${PROFILE_DATA.locationPT}
GitHub: ${PROFILE_DATA.github} | LinkedIn: ${PROFILE_DATA.linkedin}

RESUMO PROFISSIONAL
${PROFILE_DATA.summaryPT}

EXPERIÊNCIA ARQUITETURAL EM PRODUÇÃO
${CURRICULUM_NODES.map(
  (n) => `
[${n.number}] ${n.company} — ${n.pt.role}
Período: ${n.period} | Localização: ${n.location}
Impacto Comercial: ${n.pt.businessValue}
Feito Técnico: ${n.pt.engineeringFeat}
Solução: ${n.pt.architecturalSolution}
Stack: ${n.technologies.join(', ')}
`
).join('\n')}

FORMAÇÃO & CERTIFICAÇÕES
${PROFILE_DATA.education.map((e) => `- ${e.degreePT}, ${e.institution}`).join('\n')}
`;
    }

    return `THALES REIS - STAFF SOFTWARE ENGINEER // SYSTEM ARCHITECT
Email: ${PROFILE_DATA.email} | Phone: ${PROFILE_DATA.phone} | Location: ${PROFILE_DATA.location}
GitHub: ${PROFILE_DATA.github} | LinkedIn: ${PROFILE_DATA.linkedin}

PROFESSIONAL SUMMARY
${PROFILE_DATA.summary}

CORE ARCHITECTURAL EXPERIENCE
${CURRICULUM_NODES.map(
  (n) => `
[${n.number}] ${n.company} — ${n.role}
Period: ${n.period} | Location: ${n.location}
Business ROI: ${n.businessValue}
Engineering Feat: ${n.engineeringFeat}
Solution: ${n.architecturalSolution}
Stack: ${n.technologies.join(', ')}
`
).join('\n')}

EDUCATION & CERTIFICATIONS
${PROFILE_DATA.education.map((e) => `- ${e.degree}, ${e.institution}`).join('\n')}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPlainTextResume());
    setCopied(true);
    playSound('click', soundEnabled);
    setTimeout(() => setCopied(false), 2000);
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
        {/* Responsive Toolbar: Critical CTAs (Save PDF & Close) are NEVER clipped on mobile */}
        <div
          className={`px-3 sm:px-6 py-2.5 sm:py-3 border-b flex items-center justify-between gap-2 shrink-0 print:hidden ${
            theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {/* Identity & Language */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-xs font-bold truncate">
              {isPT ? 'CURRÍCULO ATS' : 'ATS RESUME'}
            </span>
            <div className="flex items-center p-0.5 rounded border text-[10px] font-mono dark:bg-zinc-950 dark:border-zinc-800 bg-white border-slate-300">
              <button
                onClick={() => setActiveLang('PT')}
                className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                  activeLang === 'PT'
                    ? 'bg-blue-600 text-white'
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                PT
              </button>
              <button
                onClick={() => setActiveLang('EN')}
                className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                  activeLang === 'EN'
                    ? 'bg-blue-600 text-white'
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded font-mono text-xs border dark:bg-zinc-800 dark:border-zinc-700 bg-white border-slate-300 text-zinc-200 dark:text-zinc-200 hover:bg-zinc-700"
              title="Copiar texto simples"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copied ? 'COPIADO' : 'COPIAR'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-white font-mono text-xs font-bold bg-blue-600 hover:bg-blue-500 shadow-xs transition-colors shrink-0"
              title="Salvar como PDF ou Imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isPT ? 'SALVAR PDF' : 'SAVE PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-zinc-800/60 text-zinc-400 hover:text-white transition-colors ml-1 shrink-0"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Editorial, High-Contrast Typography Without Neon */}
        <div
          className={`flex-1 overflow-y-auto p-5 sm:p-10 font-sans leading-relaxed text-sm print:p-0 print:text-black print:overflow-visible ${
            theme === 'dark' ? 'bg-zinc-950 text-zinc-200' : 'bg-white text-slate-800'
          }`}
        >
          {/* Header */}
          <div className="border-b-2 pb-5 mb-6 dark:border-zinc-800 border-slate-300 print:border-black">
            <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-zinc-100 dark:text-zinc-100 text-slate-900 print:text-black">
              {PROFILE_DATA.name.toUpperCase()}
            </h1>
            <div className="text-sm sm:text-base font-sans font-semibold text-blue-600 dark:text-blue-400 mt-1 print:text-black">
              {isPT ? PROFILE_DATA.titlePT : PROFILE_DATA.title}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono opacity-80 mt-3">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <a href={`mailto:${PROFILE_DATA.email}`} className="hover:underline">
                  {PROFILE_DATA.email}
                </a>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{PROFILE_DATA.phone}</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{isPT ? PROFILE_DATA.locationPT : PROFILE_DATA.location}</span>
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mb-6 space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-slate-200 text-blue-600 dark:text-blue-400 print:text-black">
              {isPT ? 'RESUMO EXECUTIVO' : 'PROFESSIONAL SUMMARY'}
            </h2>
            <p className="text-sm opacity-90 leading-relaxed font-sans">
              {isPT ? PROFILE_DATA.summaryPT : PROFILE_DATA.summary}
            </p>
          </div>

          {/* Core Architectural Experience */}
          <div className="mb-6 space-y-5">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-slate-200 text-blue-600 dark:text-blue-400 print:text-black">
              {isPT ? 'EXPERIÊNCIA ARQUITETURAL EM PRODUÇÃO' : 'CORE ARCHITECTURAL EXPERIENCE'}
            </h2>

            {CURRICULUM_NODES.map((node) => {
              const transNode = isPT ? node.pt : null;
              const roleTitle = transNode ? transNode.role : node.role;
              const bValue = transNode ? transNode.businessValue : node.businessValue;
              const feat = transNode ? transNode.engineeringFeat : node.engineeringFeat;
              const sol = transNode ? transNode.architecturalSolution : node.architecturalSolution;

              return (
                <div key={node.id} className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold">
                    <span className="text-sm sm:text-base text-zinc-100 dark:text-zinc-100 text-slate-900 print:text-black">
                      {node.company} —{' '}
                      <span className="text-blue-600 dark:text-blue-400 font-medium print:text-black">
                        {roleTitle}
                      </span>
                    </span>
                    <span className="font-mono text-xs opacity-70 mt-0.5 sm:mt-0">{node.period}</span>
                  </div>

                  <div className="p-2.5 rounded border font-sans text-xs bg-blue-50/60 dark:bg-zinc-900/60 dark:border-zinc-800 border-blue-200 text-slate-800 dark:text-zinc-200 print:border-gray-300">
                    <strong className="text-blue-700 dark:text-blue-400">{isPT ? 'Impacto Comercial: ' : 'Business ROI: '}</strong>
                    {bValue}
                  </div>

                  <p className="opacity-90 leading-relaxed">
                    <strong>{isPT ? 'Feito Técnico: ' : 'Engineering Feat: '}</strong>
                    {feat}
                  </p>

                  <p className="opacity-80 leading-relaxed">
                    <strong>{isPT ? 'Solução: ' : 'Solution: '}</strong>
                    {sol}
                  </p>

                  <div className="font-mono text-[11px] opacity-70 pt-0.5">
                    <strong>Stack:</strong> {node.technologies.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Education & Certifications */}
          <div className="mb-6 space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider border-b pb-1 dark:border-zinc-800 border-slate-200 text-blue-600 dark:text-blue-400 print:text-black">
              {isPT ? 'FORMAÇÃO ACADÊMICA & CERTIFICAÇÕES' : 'EDUCATION & CERTIFICATIONS'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              {PROFILE_DATA.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded border dark:bg-zinc-900/60 dark:border-zinc-800 bg-slate-50 border-slate-200 print:border-gray-300"
                >
                  <div className="font-bold text-zinc-100 dark:text-zinc-100 text-slate-900 print:text-black">
                    {isPT ? edu.degreePT : edu.degree}
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 font-semibold mt-0.5 print:text-black">
                    {edu.institution}
                  </div>
                  <div className="opacity-70 mt-1">{isPT ? edu.focusPT : edu.focus}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};