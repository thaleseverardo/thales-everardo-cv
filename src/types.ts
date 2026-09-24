export type SystemMode = 'DIGITAL_ARCHITECTURE' | 'PHYSICAL_OPERATIONS';
export type SystemHealth = 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
export type AppLanguage = 'PT' | 'EN' | 'ES' | 'FR';
export type AppTheme = 'dark' | 'light';
export type ViewLayout = 'GRAPH' | 'TIMELINE';
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
  failureInjected: boolean;
  failureReason?: string;
  recoveredCount: number;
  soundEnabled: boolean;
  language: AppLanguage;
  theme: AppTheme;
  profileLens: ProfileLens;
  viewLayout: ViewLayout;
  onboardingDismissed: boolean;
  searchTerm: string;
  selectedTag: string | null;
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
