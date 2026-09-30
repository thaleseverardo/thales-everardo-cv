import { AppLanguage } from '../types';
import { CURRICULUM_NODES, PROFILE_DATA } from '../data/curriculumData';
import { t, getNodeContent } from '../i18n/translations';

export function getProfileTitle(lang: AppLanguage): string {
  return 'Staff Software Engineer | Principal Systems Architect';
}

export function getProfileLocation(lang: AppLanguage): string {
  if (lang === 'PT') return 'São Paulo, Brasil & Toronto, ON (Ex-Residente | Realocação para o Canadá)';
  if (lang === 'FR') return 'São Paulo, Brésil & Toronto, ON (Ancien Résident | Relocalisation au Canada)';
  if (lang === 'ES') return 'São Paulo, Brasil y Toronto, ON (Ex-residente | Relocalización a Canadá)';
  return 'São Paulo, Brazil & Toronto, ON (Former Resident | Relocating to Canada)';
}

export function getLanguagesSummary(lang: AppLanguage): string {
  if (lang === 'PT') return 'Inglês (Fluente — Mais de 3 Anos de Experiência no Canadá) | Português (Nativo)';
  if (lang === 'FR') return "Anglais (Courant — 3+ Ans d'Expérience Professionnelle au Canada) | Portugais (Natif)";
  if (lang === 'ES') return 'Inglés (Fluido — Más de 3 Años de Experiencia Laboral en Canadá) | Portugués (Nativo)';
  return 'English (Fluent — 3+ Yrs Canadian Work Experience) | Portuguese (Native)';
}

export function getLanguagesLabel(lang: AppLanguage): string {
  if (lang === 'PT') return 'Idiomas';
  if (lang === 'FR') return 'Langues';
  if (lang === 'ES') return 'Idiomas';
  return 'Languages';
}

export function getProfileSummary(lang: AppLanguage): string {
  if (lang === 'PT') return PROFILE_DATA.summaryPT;
  if (lang === 'ES') {
    return 'Arquitecto de Sistemas y Staff Software Engineer con más de 15 años de experiencia en TI corporativa, sistemas de misión crítica y arquitecturas de alta disponibilidad y resiliencia. Sólida trayectoria en diagnósticos profundos de sistemas, recuperación de incidentes bajo SLAs inferiores a 1 hora para instituciones financieras Tier-1 y optimización de rendimiento en bases de datos corporativas, complementada por más de 3 años de liderazgo en TI y arquitectura de datos ERP en Toronto, Canadá. Actualmente enfocado en el desarrollo y la arquitectura de productos SaaS, aplicando patrones orientados a eventos (CQRS, Event Sourcing), seguridad Zero-Trust y explorando la integración de recursos de IA.';
  }
  if (lang === 'FR') {
    return "Architecte Systèmes & Staff Software Engineer avec plus de 15 ans d'expérience dans l'IT d'entreprise, les environnements de mission critique et les architectures de haute disponibilité et résilience. Solide expertise en diagnostics approfondis de systèmes, résolution d'incidents sous SLA stricts de moins d'une heure pour des institutions financières Tier-1 et optimisation de performance des bases de données d'entreprise, complétée par plus de 3 ans de leadership IT et d'architecture de données ERP à Toronto, Canada. Actuellement dédié au développement et à l'architecture de produits SaaS, appliquant les paradigmes orientés événements (CQRS, Event Sourcing), la sécurité Zero-Trust et explorant l'intégration de capacités d'IA.";
  }
  return PROFILE_DATA.summary;
}

export function getEducationDegree(degree: string, degreePT: string, lang: AppLanguage): string {
  if (lang === 'PT') return degreePT;
  if (lang === 'ES') {
    return degreePT.includes('Pós-Graduação')
      ? 'Posgrado en Arquitectura de Software y Sistemas Distribuidos'
      : 'Licenciatura en Tecnología de la Información y Sistemas';
  }
  if (lang === 'FR') {
    return degreePT.includes('Pós-Graduação')
      ? "Diplôme d'Études Supérieures en Architecture Logicielle et Systèmes Distribués"
      : "Licence en Technologies de l'Information et Systèmes";
  }
  return degree;
}

export function generateMarkdownResume(lang: AppLanguage, isAuthenticated: boolean, email: string, phone: string): string {
  const experiences = CURRICULUM_NODES.map((n) => {
    const c = getNodeContent(n, lang);
    return `### ${n.company} — ${c.role}
*${n.period} | ${n.location}*

- **${t(lang, 'resume.businessRoi')}** ${c.businessValue}
- **${t(lang, 'resume.engineeringFeat')}** ${c.engineeringFeat}
- **${t(lang, 'resume.solution')}** ${c.architecturalSolution}
- **Stack:** \`${n.technologies.join('`, `')}\`
`;
  }).join('\n');

  const degrees = PROFILE_DATA.academicDegrees.map((d) => {
    const name = lang === 'PT' ? d.degreeName : d.degreeNameEN;
    const focus = lang === 'PT' ? d.focus : d.focusEN;
    const wes = d.internationalEquivalency ? `\n  🇨🇦 ${d.internationalEquivalency.badgeText}` : '';
    return `- **${name}** (${d.period}) — *${d.institution}*${wes}\n  ${focus}`;
  }).join('\n');

  const credentials = PROFILE_DATA.verifiedCredentials.map((c) => {
    const title = lang === 'PT' ? c.title : c.titleEN;
    return `- **${title}** (${c.workloadHours}h) — *${c.institution}*\n  Hash Oficial: [${c.verificationUrl}](${c.verificationUrl})`;
  }).join('\n');

  const hardSkills = PROFILE_DATA.hardSkillsDomains.map((d) => {
    const cat = lang === 'PT' ? d.categoryPT : d.categoryEN;
    return `- **${cat}:** ${d.skills.join(', ')}`;
  }).join('\n');

  const softSkills = PROFILE_DATA.softSkillsCompetencies.map((s) => {
    const title = lang === 'PT' ? s.titlePT : s.titleEN;
    const desc = lang === 'PT' ? s.descriptionPT : s.descriptionEN;
    return `- **${title}:** ${desc}`;
  }).join('\n');

  const languagesList = PROFILE_DATA.languages.map((l) => {
    const prof = lang === 'PT' ? l.proficiencyPT : l.proficiencyEN;
    return `- **${l.language}:** ${prof} (${l.cefrLevel})`;
  }).join('\n');

  return `# Thales Everardo
**${getProfileTitle(lang)}**

📍 ${getProfileLocation(lang)}
📧 ${isAuthenticated ? email : '[Protected - Sign-In Required]'} | 📱 ${isAuthenticated ? phone : '[Protected - Sign-In Required]'}
🔗 [LinkedIn](${PROFILE_DATA.linkedin}) | 🔗 [GitHub](${PROFILE_DATA.github})
🌐 ${getLanguagesLabel(lang)}: ${getLanguagesSummary(lang)}

---

## ${t(lang, 'resume.executiveSummary')}
${getProfileSummary(lang)}

---

## ${t(lang, 'resume.coreExperience')}
${experiences}

---

## ${t(lang, 'academic.formalDegreesTitle')}
${degrees}

---

## ${t(lang, 'academic.verifiedCredentialsTitle')} (1.660h)
${credentials}

---

## ${t(lang, 'skills.hardSkillsTitle')}
${hardSkills}

---

## ${t(lang, 'skills.softSkillsTitle')}
${softSkills}

---

## ${t(lang, 'academic.languagesTitle')}
${languagesList}
`;
}
