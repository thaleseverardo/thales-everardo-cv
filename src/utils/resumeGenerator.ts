import { AppLanguage } from '../types';
import { CURRICULUM_NODES, PROFILE_DATA } from '../data/curriculumData';
import { t, getNodeContent } from '../i18n/translations';

export function getProfileTitle(lang: AppLanguage): string {
  if (lang === 'PT') return PROFILE_DATA.titlePT;
  if (lang === 'ES') return 'Ingeniero de Software Staff y Arquitecto de Sistemas';
  if (lang === 'FR') return 'Ingénieur Logiciel Staff & Architecte de Systèmes';
  return PROFILE_DATA.title;
}

export function getProfileLocation(lang: AppLanguage): string {
  if (lang === 'PT') return 'São Paulo, SP — Brasil';
  if (lang === 'FR') return 'São Paulo, Brésil';
  if (lang === 'ES') return 'São Paulo, Brasil';
  return 'São Paulo, Brazil';
}

export function getProfileSummary(lang: AppLanguage): string {
  if (lang === 'PT') return PROFILE_DATA.summaryPT;
  if (lang === 'ES') {
    return 'Arquitecto de Sistemas e Ingeniero de Software Staff con más de 10 años de experiencia en ingeniería de datos, microservicios distribuidos, tolerancia a fallos y arquitectura dirigida por eventos (EDA). Especialista en eliminar latencias críticas en entornos transaccionales de alto volumen con estricto cumplimiento ACID.';
  }
  if (lang === 'FR') {
    return "Architecte de Systèmes et Ingénieur Logiciel Staff avec plus de 10 ans d'expérience en ingénierie des données, microservices distribués, tolérance aux pannes et architectures orientées événements (EDA). Spécialiste de l'élimination des latences critiques dans les environnements transactionnels à haut débit sous stricte conformité ACID.";
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

📧 ${isAuthenticated ? email : '[Protected - Sign-In Required]'} | 📱 ${isAuthenticated ? phone : '[Protected - Sign-In Required]'} | 📍 ${getProfileLocation(lang)}
🔗 [GitHub](${PROFILE_DATA.github}) | 🔗 [LinkedIn](${PROFILE_DATA.linkedin})

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
