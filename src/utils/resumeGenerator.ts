import { AppLanguage } from '../types';
import { CURRICULUM_NODES, PROFILE_DATA } from '../data/curriculumData';
import { t, getNodeContent } from '../i18n/translations';

export function getProfileTitle(lang: AppLanguage): string {
  return 'Staff Systems Engineer   |   Principal Systems Architect';
}

export function getProfileLocation(lang: AppLanguage): string {
  if (lang === 'PT') return 'São Paulo, Brasil & Toronto, ON   |   Ex-Residente   |   Realocação para o Canadá';
  if (lang === 'FR') return 'São Paulo, Brésil & Toronto, ON   |   Ancien Résident   |   Relocalisation au Canada';
  if (lang === 'ES') return 'São Paulo, Brasil y Toronto, ON   |   Ex-residente   |   Relocalización a Canadá';
  return 'São Paulo, Brazil & Toronto, ON   |   Former Resident   |   Relocating to Canada';
}

export function getLanguagesSummary(lang: AppLanguage): string {
  if (lang === 'PT') return 'Inglês (Fluente — Mais de 3 Anos de Experiência no Canadá)   |   Português (Nativo)';
  if (lang === 'FR') return "Anglais (Courant — 3+ Ans d'Expérience Professionnelle au Canada)   |   Portugais (Natif)";
  if (lang === 'ES') return 'Inglés (Fluido — Más de 3 Años de Experiencia Laboral en Canadá)   |   Portugués (Nativo)';
  return 'English (Fluent — 3+ Yrs Canadian Work Experience)   |   Portuguese (Native)';
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
    return 'Arquitecto de Sistemas y Staff Systems Engineer con más de 15 años de experiencia en TI corporativa, sistemas de misión crítica y arquitecturas de alta disponibilidad y resiliencia. Sólida trayectoria en diagnósticos profundos de sistemas, recuperación de incidentes bajo SLAs inferiores a 1 hora para instituciones financieras Tier-1 y optimización de rendimiento en bases de datos corporativas, complementada por más de 3 años de liderazgo en TI y arquitectura de datos ERP en Toronto, Canadá. Actualmente enfocado en el desarrollo y la arquitectura de productos SaaS, aplicando patrones orientados a eventos (CQRS, Event Sourcing), seguridad Zero-Trust y explorando la integración de recursos de IA.';
  }
  if (lang === 'FR') {
    return "Architecte Systèmes & Staff Systems Engineer avec plus de 15 ans d'expérience dans l'IT d'entreprise, les environnements de mission critique et les architectures de haute disponibilité et résilience. Solide expertise en diagnostics approfondis de systèmes, résolution d'incidents sous SLA stricts de moins d'une heure pour des institutions financières Tier-1 et optimisation de performance des bases de données d'entreprise, complétée par plus de 3 ans de leadership IT et d'architecture de données ERP à Toronto, Canada. Actuellement dédié au développement et à l'architecture de produits SaaS, appliquant les paradigmes orientés événements (CQRS, Event Sourcing), la sécurité Zero-Trust et explorant l'intégration de capacités d'IA.";
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
  // Filtra nós acadêmicos e consolida os nós da Atento em uma única experiência
  const filtered = CURRICULUM_NODES.filter((n) => {
    const comp = n.company.toLowerCase();
    const id = n.id.toLowerCase();
    return !(id.includes('academic') || id.includes('foundation') || comp.includes('cruzeiro') || comp.includes('estácio') || comp.includes('senai'));
  });

  const nonSummerhill = filtered.filter((n) => !n.company.toLowerCase().includes('summerhill'));
  const summerhillNodes = filtered.filter((n) => n.company.toLowerCase().includes('summerhill'));

  const summerhillProgression =
    lang === 'PT'
      ? 'Progressão de Carreira: Liderança Operacional (2020/21) ➔ DBA & Dados (2021/23) ➔ Gerente de Sistemas de TI & Soluções (2023/24)'
      : lang === 'FR'
      ? 'Progression : Responsable Opérations (2020/21) ➔ DBA & Données (2021/23) ➔ Responsable Systèmes IT & Solutions (2023/24)'
      : lang === 'ES'
      ? 'Progresión: Liderazgo Operacional (2020/21) ➔ DBA y Datos (2021/23) ➔ Gerente de Sistemas de TI y Soluciones (2023/24)'
      : 'Career Progression: Operations Lead (2020/21) ➔ Database Administrator (2021/23) ➔ IT Systems & Solutions Manager (2023/24)';

  const summerhillConsolidated = summerhillNodes.length > 0 ? [{
    company: 'Summerhill Market',
    role: lang === 'PT'
      ? 'Gerente de Sistemas de TI, Engenheiro de Soluções & DBA'
      : lang === 'FR'
      ? 'Responsable des Systèmes IT, Ingénieur Solutions & Lead DBA'
      : lang === 'ES'
      ? 'Gerente de Sistemas de TI, Ingeniero de Soluciones y DBA'
      : 'IT Systems Manager, Solutions Engineer & Lead DBA',
    period: 'Jul 2020 - Feb 2024',
    location: 'Toronto, ON, Canada',
    progression: summerhillProgression,
    businessValue: lang === 'PT'
      ? 'Unificou a governança tecnológica de 5 lojas físicas para +500.000 transações/mês (30.000 SKUs) e reduziu descarte de insumos em 70% com +50% de produtividade fabril.'
      : 'Unified IT & data governance across 5 enterprise stores for 500,000+ monthly transactions (30,000 SKUs) while slashing physical production waste by 70% with +50% throughput.',
    engineeringFeat: lang === 'PT'
      ? 'Implementou plano de Disaster Recovery (DR/BCP) com recuperação de dados críticos em 24h, eliminou retrabalho em 30k SKUs via catálogo GS1 em tempo real e aplicou Teoria das Filas à produção.'
      : 'Architected Disaster Recovery (DR/BCP) restoring critical data within 24h, achieved sub-second GS1 catalog/POS sync across 30k SKUs, and applied Queueing Theory to physical factory workflows.',
    architecturalSolution: lang === 'PT'
      ? 'Desenvolveu microsserviços e APIs RESTful em C#/.NET conectando o padrão GS1 ao ERP com tolerância a falhas, modelou rotinas ETL e aplicou cadência Just-in-Time com previsão de demanda.'
      : 'Engineered resilient C#/.NET RESTful microservices integrating GS1 catalog standards with enterprise ERP, automated relational ETL pipelines, and enforced Just-in-Time predictive demand forecasting.',
    technologies: Array.from(new Set(summerhillNodes.flatMap((n) => n.technologies))),
  }] : [];

  const nonAtento = nonSummerhill.filter((n) => !n.company.toLowerCase().includes('atento'));
  const atentoNodes = nonSummerhill.filter((n) => n.company.toLowerCase().includes('atento'));

  const atentoProgression =
    lang === 'PT'
      ? 'Progressão de Carreira: Analista de Suporte (2007/08) ➔ Eng. de Suporte I (2011) ➔ Eng. de Suporte II (2014) ➔ Eng. de Suporte III (2015/16) ➔ Coordenação Técnica Interina'
      : lang === 'FR'
      ? 'Progression : Analyste Support (2007/08) ➔ Ing. Support I (2011) ➔ Ing. Support II (2014) ➔ Ing. Support III (2015/16) ➔ Coordination Technique par intérim'
      : lang === 'ES'
      ? 'Progresión: Analista de Soporte (2007/08) ➔ Ing. de Soporte I (2011) ➔ Ing. de Soporte II (2014) ➔ Ing. de Soporte III (2015/16) ➔ Coordinación Técnica Interina'
      : 'Career Progression: Support Analyst (2007/08) ➔ Support Eng. I (2011) ➔ Support Eng. II (2014) ➔ Support Eng. III (2015/16) ➔ Acting Technical Coordinator';

  const atentoConsolidated = atentoNodes.length > 0 ? [{
    company: 'Atento',
    role: lang === 'PT'
      ? 'Engenheiro de Suporte Técnico III (Telecomunicações, CTI & Automação)'
      : lang === 'FR'
      ? 'Ingénieur Support Technique III (Télécoms, CTI & Automatisation)'
      : lang === 'ES'
      ? 'Ingeniero de Soporte Técnico III (Telecomunicaciones, CTI y Automatización)'
      : 'Technical Support Engineer III (Telecom, CTI & Automation)',
    period: 'Jan 2008 - Dec 2016',
    location: 'São Paulo, Brazil',
    progression: atentoProgression,
    businessValue: lang === 'PT'
      ? 'Garantia de 99,98% de disponibilidade operacional para +40.000 PAs (economia de US$ 500k+) e redução de 99,8% no tempo de processamento de relatórios (de 7 dias para 20 minutos).'
      : '99.98% operational uptime across mission-critical infrastructure for 40,000+ workstations (US$ 500k+ saved) and 99.8% reduction in reporting processing latency (from 7 days down to 20 minutes).',
    engineeringFeat: lang === 'PT'
      ? 'Projetou e estabilizou pipelines de ingestão para +100.000 registros diários de voz e desenvolveu esteiras ETL em T-SQL que reduziram auditorias manuais de 1 semana para 10 segundos.'
      : 'Engineered continuous voice ingestion pipelines for 100,000+ daily records and automated T-SQL/Shell ETL audit scripts cutting manual routines from 1 week to 10 seconds.',
    architecturalSolution: lang === 'PT'
      ? 'Gerenciou tráfego massivo de voz e dados em topologias heterogêneas 24/7 (Windows/Linux, LAN/WAN, SIP/VoIP, CTI) integradas a procedures T-SQL otimizadas.'
      : 'Administered 24/7 telecom infrastructure (Windows/Linux, LAN/WAN, SIP/VoIP, CTI) combined with optimized T-SQL stored procedures and database automation.',
    technologies: Array.from(new Set(atentoNodes.flatMap((n) => n.technologies))),
  }] : [];

  const experiences = [...nonAtento, ...summerhillConsolidated, ...atentoConsolidated].map((n: any) => {
    const c = n.id ? getNodeContent(n, lang) : n;
    const progLine = n.progression ? `*${n.progression}*\n\n` : '';
    return `### ${n.company} — ${c.role}
*${n.period} | ${n.location}*

${progLine}- **${t(lang, 'resume.businessRoi')}** ${c.businessValue}
- **${t(lang, 'resume.engineeringFeat')}** ${c.engineeringFeat}
- **${t(lang, 'resume.solution')}** ${c.architecturalSolution}
- **Stack:** \`${n.technologies.join('`, `')}\`
`;
  }).join('\n');

  const degrees = PROFILE_DATA.academicDegrees.map((d) => {
    const name = lang === 'PT' ? d.degreeName : d.degreeNameEN;
    const focus = lang === 'PT' ? d.focus : d.focusEN;
    const wesLabel = lang === 'PT' 
      ? 'Equivalência WES Canadá' 
      : lang === 'FR' 
      ? 'Équivalence WES Canada' 
      : lang === 'ES' 
      ? 'Equivalencia WES Canadá' 
      : 'WES Canadian Equivalency';
    const wes = d.internationalEquivalency ? `\n  - ${wesLabel}: ${d.internationalEquivalency.canadianEquivalency}` : '';
    return `- **${name}** (${d.period}) — *${d.institution}*${wes}\n  ${focus}`;
  }).join('\n');

  const credentials = PROFILE_DATA.verifiedCredentials.map((c) => {
    const title = lang === 'PT' ? c.title : c.titleEN;
    return `- **${title}** (${c.workloadHours}h) — *${c.institution}*\n  ${lang === 'PT' ? 'Hash Oficial' : lang === 'FR' ? 'Hash Officiel' : lang === 'ES' ? 'Hash Oficial' : 'Official Hash'}: [${c.verificationUrl}](${c.verificationUrl})`;
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

const protectedNotice =
    lang === 'PT'
      ? '[Protegido - Autenticação Necessária]'
      : lang === 'ES'
      ? '[Protegido - Requiere Autenticación]'
      : lang === 'FR'
      ? '[Protégé - Authentification Requise]'
      : '[Protected - Sign-In Required]';

  return `# Thales Everardo
**${getProfileTitle(lang)}**

📍 ${getProfileLocation(lang)}
📧 ${isAuthenticated ? email : protectedNotice} | 📱 ${isAuthenticated ? phone : protectedNotice}
🔗 [LinkedIn](https://linkedin.com/in/thaleseverardo) | 💻 [GitHub](https://github.com/thaleseverardo) | 🌐 [Portfólio](https://thaleseverardo.github.io/thales-everardo-cv/)
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
