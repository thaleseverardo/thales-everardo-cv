export type OAuthProvider = 'google.com' | 'github.com' | 'password';

export interface AnalyticsEventParams {
  architecture_inspect?: { nodeId: string };
  cv_view?: { language: AppLanguage };
  cv_download?: { extension: 'pdf' | 'txt' | 'md'; language: AppLanguage };
  auth_attempt?: { provider: OAuthProvider };
  auth_success?: { provider: OAuthProvider };
  auth_failure?: { provider: OAuthProvider; errorCode: string };
}

export type SystemMode = 'DIGITAL_ARCHITECTURE' | 'PHYSICAL_OPERATIONS';
export type SystemHealth = 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
export type AppLanguage = 'PT' | 'EN' | 'ES' | 'FR';
export type AppTheme = 'dark' | 'light';
export type ViewLayout = 'GRAPH' | 'TIMELINE' | 'RESUME' | 'ARTICLES' | 'PROJECTS';
export type ProfileLens = 'ALL' | 'ARCHITECTURE' | 'DATA' | 'SOFTWARE_ENG' | 'DATABASE';
export type NodeVisualShape = 'STREAM_PULSE' | 'PROCESSOR_CORE' | 'DATABASE_CYLINDER' | 'GATEWAY_SHIELD' | 'HEX_OPTIMIZER';

export interface SystemState {
  mode: SystemMode;
  rps: number;
  isLatencyOptimized: boolean;
  isPurgeExecuted: boolean;
  isSyncActive: boolean;
  activeNodeId: string | null;
  systemHealth: SystemHealth;
  language: AppLanguage;
  theme: AppTheme;
  profileLens: ProfileLens;
  viewLayout: ViewLayout;
  onboardingDismissed: boolean;
  searchTerm: string;
  selectedTag: string | null;
  activeArticleSlug?: string | null;
  activeProjectSlug?: string | null;
}

export interface MetricHighlight {
  label: string;
  value: string;
  subtext: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'emerald' | 'cyan' | 'amber' | 'rose' | 'blue';
}

export interface NodeTranslation {
  shortTitle: string;
  role: string;
  canvasLabel: string;
  metricHighlight: string;
  businessValue: string;
  engineeringFeat: string;
  contextProblem: string;
  architecturalSolution: string;
  engineeringLesson: string;
  metricDetails: MetricHighlight[];
  interactiveActionLabel?: string;
  interactiveActionActiveLabel?: string;
  interactiveActionDescription?: string;
}

export interface ArchitectureNode {
  id: string;
  number: string;
  layer: string;
  canvasLabel: string;
  shortTitle: string;
  role: string;
  company: string;
  location: string;
  period: string;
  metricHighlight: string;
  businessValue: string;
  metricDetails: MetricHighlight[];
  engineeringFeat: string;
  contextProblem: string;
  architecturalSolution: string;
  engineeringLesson: string;
  technologies: string[];
  careerProgression?: string;
  category: 'ingestion' | 'optimization' | 'storage' | 'integration' | 'operations' | 'core';
  visualShape: NodeVisualShape;
  lenses: ProfileLens[];
  modeVisibility: 'both' | 'digital' | 'physical';
  position: {
    digital: { x: number; y: number };
    physical: { x: number; y: number };
  };
  connectedTo: string[];
  interactiveAction?: {
    id: string;
    label: string;
    activeLabel: string;
    description: string;
  };
  pt: NodeTranslation;
  es?: Partial<NodeTranslation>;
  fr?: Partial<NodeTranslation>;
}

// ==========================================
// MODELAGEM MÉTRICA DE DADOS ACADÊMICOS & CERTIFICAÇÕES
// ==========================================

export interface AcademicKPIs {
  totalCertifiedHours: number;
  totalDegreesCount: number;
  continuousEducationSpanYears: number;
  internationalEquivalenciesCount: number;
  verifiedCredentialsCount: number;
}

export interface AcademicDegree {
  id: string;
  institution: string;
  institutionShort: string;
  degreeName: string;
  degreeNameEN: string;
  degreeNameES?: string;
  degreeNameFR?: string;
  level: 'BACHELOR' | 'POSTGRADUATE' | 'TECH_DEGREE' | 'CORE_STUDIES' | 'EXTENSION';
  status: 'IN_PROGRESS' | 'COMPLETED';
  period: string;
  startYear: number;
  endYear: number;
  expectedYear?: number;
  internationalEquivalency?: {
    agency: 'WES';
    country: 'CA';
    canadianEquivalency: string;
    badgeText: string;
  };
  focus: string;
  focusEN: string;
  focusES?: string;
  focusFR?: string;
  skills: string[];
}

export interface VerifiedCredential {
  id: string;
  title: string;
  titleEN: string;
  institution: string;
  workloadHours: number;
  issueDate: string;
  verificationUrl: string;
  disciplinesCount: number;
  disciplinesIncluded: string[];
  competencyDomain: 'ALGORITHMS' | 'DATA_CLOUD' | 'SYSTEMS_DB' | 'SOFTWARE_ENG';
}

export interface TechnicalCourse {
  id: string;
  title: string;
  institution: string;
  associatedCompany?: string;
  category: 'LINUX' | 'DATABASE' | 'ARCHITECTURE' | 'NETWORKING' | 'TELECOM';
}

export interface LanguageProficiency {
  language: string;
  proficiencyPT: string;
  proficiencyEN: string;
  proficiencyES: string;
  proficiencyFR: string;
  cefrLevel: 'C2' | 'C1' | 'B2' | 'B1' | 'A2';
  isNative?: boolean;
}

export interface HardSkillDomain {
  id: string;
  categoryPT: string;
  categoryEN: string;
  categoryES: string;
  categoryFR: string;
  skills: string[];
}

export interface SoftSkillCompetency {
  id: string;
  titlePT: string;
  titleEN: string;
  titleES: string;
  titleFR: string;
  descriptionPT: string;
  descriptionEN: string;
  descriptionES: string;
  descriptionFR: string;
  linkedSkills: string[];
}
