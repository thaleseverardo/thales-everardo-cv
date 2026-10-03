import { AppLanguage, ArchitectureNode, NodeTranslation, MetricHighlight } from '../types';

export interface LocalizedCareerItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  careerProgression?: string;
  businessValue: string;
  engineeringFeat: string;
  architecturalSolution: string;
  technologies: string[];
}

// Overlays regionais consolidados para nós específicos em ES e FR
const REGIONAL_NODE_OVERLAYS: Record<'ES' | 'FR', Record<string, Partial<NodeTranslation>>> = {
  ES: {
    DATA_PURGE_NODE: {
      role: 'Staff Systems Engineer y Arquitecto de Sistemas',
      businessValue: 'Cero bloqueos en producción y mitigación total de riesgos de indisponibilidad durante cierres fiscales críticos.',
      engineeringFeat: 'Purga asíncrona particionada de 11TB de logs transaccionales en SQL Server sin bloqueos transaccionales en caliente.',
      architecturalSolution: 'Construcción de pipeline desacoplado en lotes dinámicos con monitoreo de telemetría de buffers de log y control de presión.',
    },
    LATENCY_OPTIMIZER: {
      role: 'Ingeniero de Software Senior',
      businessValue: 'Reducción del 99,8% en el tiempo de procesamiento contable y liquidación de nóminas corporativas.',
      engineeringFeat: 'Reducción de la latencia del pipeline de cálculo financiero de 7 días a solo 20 minutos con consistencia total.',
      architecturalSolution: 'Optimización profunda de índices agrupados, particionamiento de tablas históricas y paralelización asíncrona en C#.',
    },
    SYNC_GATEWAY: {
      role: 'Ingeniero de Software Especialista',
      businessValue: 'Sincronización en tiempo real de catálogos e inventarios en 5 centros de distribución sin pérdida de pedidos.',
      engineeringFeat: 'Broker de mensajería estándar GS1 que conecta ERP central y terminales de punto de venta POS en tiempo real.',
      architecturalSolution: 'Patrón Transactional Outbox con RabbitMQ y almacenamiento local idempotente con tolerancia a desconexión.',
    },
    PERSISTENCE_LAYER: {
      role: 'Ingeniero de Software / Analista Desarrollador',
      businessValue: 'Recuperación de 11 Terabytes de almacenamiento en servidores de producción al 99% de capacidad, evitando costos masivos de hardware.',
      engineeringFeat: 'Reducción del tiempo de ejecución de un proceso crítico mensual de 1 mes a solo 2 horas (ganancia del 99,7%).',
      architecturalSolution: 'Expurgo transaccional particionado de datos históricos desindexados con 100% de integridad referencial y módulos en ASP.NET / T-SQL.',
    },
    INGESTION_LAYER: {
      role: 'Ingeniero de Soporte Técnico III y Arquitecto de Automatización',
      businessValue: 'Garantizó el 99,98% de disponibilidad operativa en atención corporativa; redujo indisponibilidades en un 97% con ahorro superior a US$ 500.000.',
      engineeringFeat: 'Estabilizó pipelines de ingestión continua para más de 100.000 registros diarios de voz y telefonía sin pérdida de paquetes.',
      architecturalSolution: 'Gestión de tráfico masivo de voz y datos, optimización LAN/WAN y SIP/VoIP, y automatización con scripts ETL hacia SQL.',
    },
  },
  FR: {
    DATA_PURGE_NODE: {
      role: 'Staff Systems Engineer & Architecte Systèmes',
      businessValue: 'Zéro verrouillage en production et élimination des risques de panne lors des clôtures fiscales critiques.',
      engineeringFeat: 'Purge asynchrone partitionnée de 11 To de journaux sur SQL Server sans lock escalations en production.',
      architecturalSolution: "Conception d'un pipeline découplé par lots dynamiques avec surveillance télémétrique de la pression des journaux.",
    },
    LATENCY_OPTIMIZER: {
      role: 'Ingénieur Logiciel Senior',
      businessValue: 'Réduction de 99,8% du temps de traitement comptable et de règlement de paie multi-entités.',
      engineeringFeat: 'Réduction de la latence du pipeline de calcul financier de 7 jours à 20 minutes avec cohérence absolue.',
      architecturalSolution: "Optimisation approfondie des index, partitionnement des tables historiques et parallélisation asynchrone en C#.",
    },
    SYNC_GATEWAY: {
      role: 'Ingénieur Logiciel Spécialiste',
      businessValue: 'Synchronisation en temps réel des catalogues et stocks sur 5 centres de distribution sans aucune perte de commande.',
      engineeringFeat: 'Broker de messagerie au standard GS1 reliant ERP central et points de vente POS en temps réel.',
      architecturalSolution: 'Pattern Transactional Outbox avec files RabbitMQ et persistance locale idempotente tolérante aux pannes.',
    },
    PERSISTENCE_LAYER: {
      role: 'Ingénieur Logiciel / Développeur Analyste',
      businessValue: 'Récupération de 11 To de stockage sur des serveurs de production saturés à 99%, évitant des coûts massifs d\'infrastructure.',
      engineeringFeat: "Réduction du temps d'exécution d'un processus critique mensuel de 1 mois à seulement 2 heures (gain de 99,7%).",
      architecturalSolution: "Purge transactionnelle partitionnée de données historiques désindexées avec intégrité référentielle à 100% et modules en ASP.NET / T-SQL.",
    },
    INGESTION_LAYER: {
      role: 'Ingénieur Support Technique III & Architecte Automatisation',
      businessValue: 'Garantie de 99,98% de disponibilité opérationnelle; réduction des interruptions de 97% générant plus de 500 000 $ d\'économies.',
      engineeringFeat: 'Conception et stabilisation de pipelines d\'ingestion continue de plus de 100 000 enregistrements quotidiens de voix sans perte de paquets.',
      architecturalSolution: 'Gestion du trafic massif voix/données, optimisation LAN/WAN et SIP/VoIP, et automatisation de scripts ETL vers SQL.',
    },
  },
};

export function getRegionalNodeOverlay(node: ArchitectureNode, lang: AppLanguage): Partial<NodeTranslation> | null {
  if (lang !== 'ES' && lang !== 'FR') return null;
  return REGIONAL_NODE_OVERLAYS[lang]?.[node.id] || null;
}

export function parsePeriodEndScore(periodStr: string): number {
  if (!periodStr) return 0;
  const p = periodStr.toLowerCase();

  if (p.includes('present') || p.includes('atual') || p.includes('présent') || p.includes('actualidad')) {
    return 99999999;
  }

  const years = periodStr.match(/\b(20\d\d|19\d\d)\b/g);
  if (!years || years.length === 0) return 19900000;

  const endYear = parseInt(years[years.length - 1], 10);
  const startYear = parseInt(years[0], 10);

  const monthMap: Record<string, number> = {
    jan: 1, ene: 1, feb: 2, fev: 2, mar: 3, apr: 4, abr: 4, avr: 4,
    may: 5, mai: 5, jun: 6, jul: 7, aug: 8, ago: 8, aou: 8, sep: 9,
    set: 9, oct: 10, out: 10, nov: 11, dec: 12, dez: 12, dic: 12,
  };

  let endMonth = 12;
  const periodParts = periodStr.split(/[-–—]/);
  const endPart = (periodParts.length > 1 ? periodParts[1] : periodParts[0]).toLowerCase();

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

  return endYear * 10000 + endMonth * 100 + (startYear % 100);
}

export function getConsolidatedCareerNodes(nodes: ArchitectureNode[], lang: AppLanguage): LocalizedCareerItem[] {
  const filtered = nodes.filter((n) => {
    const comp = n.company.toLowerCase();
    const id = n.id.toLowerCase();
    return !(
      id.includes('academic') ||
      id.includes('foundation') ||
      comp.includes('cruzeiro') ||
      comp.includes('estácio') ||
      comp.includes('senai') ||
      comp.includes('university')
    );
  });

  const summerhillNodes = filtered.filter((n) => n.company.toLowerCase().includes('summerhill'));
  const nonSummerhill = filtered.filter((n) => !n.company.toLowerCase().includes('summerhill'));

  let consolidatedSummerhill: LocalizedCareerItem | null = null;
  if (summerhillNodes.length > 0) {
    const progressionText =
      lang === 'PT'
        ? 'Progressão de Carreira: Liderança Operacional (2020/21) ➔ DBA & Dados (2021/23) ➔ Gerente de Sistemas de TI & Soluções (2023/24)'
        : lang === 'FR'
        ? 'Progression : Responsable Opérations (2020/21) ➔ DBA & Données (2021/23) ➔ Responsable Systèmes IT & Solutions (2023/24)'
        : lang === 'ES'
        ? 'Progresión: Liderazgo Operacional (2020/21) ➔ DBA y Datos (2021/23) ➔ Gerente de Sistemas de TI y Soluciones (2023/24)'
        : 'Career Progression: Operations Lead (2020/21) ➔ Database Administrator (2021/23) ➔ IT Systems & Solutions Manager (2023/24)';

    const unifiedRole =
      lang === 'PT'
        ? 'Gerente de Sistemas de TI, Engenheiro de Soluções & DBA'
        : lang === 'FR'
        ? 'Responsable des Systèmes IT, Ingénieur Solutions & Lead DBA'
        : lang === 'ES'
        ? 'Gerente de Sistemas de TI, Ingeniero de Soluciones y DBA'
        : 'IT Systems Manager, Solutions Engineer & Lead DBA';

    const unifiedROI =
      lang === 'PT'
        ? 'Unificou a governança tecnológica de 5 lojas físicas para +500.000 transações/mês (30.000 SKUs) e reduziu descarte de insumos em 70% com +50% de produtividade fabril.'
        : lang === 'FR'
        ? 'Gouvernance technologique et données unifiée sur 5 magasins physiques (+500 000 transactions/mois et 30 000 SKUs) et réduction de 70% du gaspillage avec +50% de productivité.'
        : lang === 'ES'
        ? 'Gobernanza tecnológica y de datos unificada en 5 tiendas físicas (+500.000 transacciones/mes y 30.000 SKUs), reduciendo el descarte en un 70% con +50% de productividad.'
        : 'Unified IT & data governance across 5 enterprise stores for 500,000+ monthly transactions (30,000 SKUs) while slashing physical production waste by 70% with +50% throughput.';

    const unifiedFeat =
      lang === 'PT'
        ? 'Implementou plano de Disaster Recovery (DR/BCP) com recuperação de dados críticos em 24h, eliminou retrabalho em 30k SKUs via catálogo GS1 em tempo real e aplicou Teoria das Filas à produção.'
        : lang === 'FR'
        ? "Mise en œuvre d'un plan de reprise après sinistre (DR/BCP) restaurant les données en 24h, synchronisation POS/ERP en temps réel (standard GS1) et application de la Théorie des files d'attente."
        : lang === 'ES'
        ? 'Implementó plan de Disaster Recovery (DR/BCP) recuperando datos críticos en 24h, logró sincronización GS1/POS en tiempo real en 30.000 SKUs y aplicó Teoría de Colas a la producción.'
        : 'Architected Disaster Recovery (DR/BCP) restoring critical data within 24h, achieved sub-second GS1 catalog/POS sync across 30k SKUs, and applied Queueing Theory to physical factory workflows.';

    const unifiedSolution =
      lang === 'PT'
        ? 'Desenvolveu microsserviços e APIs RESTful em C#/.NET conectando o padrão GS1 ao ERP com tolerância a falhas, modelou rotinas ETL e aplicou cadência Just-in-Time com previsão de demanda.'
        : lang === 'FR'
        ? "Développement de microservices et APIs RESTful en C#/.NET reliant le standard GS1 à l'ERP avec haute résilience, optimisation ETL et flux Just-in-Time."
        : lang === 'ES'
        ? 'Desarrolló microservicios y APIs RESTful en C#/.NET conectando el estándar GS1 al ERP con tolerancia a fallos, optimizó ETL y aplicó cadencia Just-in-Time.'
        : 'Engineered resilient C#/.NET RESTful microservices integrating GS1 catalog standards with enterprise ERP, automated relational ETL pipelines, and enforced Just-in-Time predictive demand forecasting.';

    consolidatedSummerhill = {
      id: 'summerhill-consolidated',
      company: 'Summerhill Market',
      role: unifiedRole,
      period: 'Jul 2020 - Feb 2024',
      location: 'Toronto, ON, Canada',
      careerProgression: progressionText,
      businessValue: unifiedROI,
      engineeringFeat: unifiedFeat,
      architecturalSolution: unifiedSolution,
      technologies: Array.from(new Set(summerhillNodes.flatMap((n) => n.technologies))),
    };
  }

  const nonAtento = nonSummerhill.filter((n) => !n.company.toLowerCase().includes('atento'));
  const atentoNodes = nonSummerhill.filter((n) => n.company.toLowerCase().includes('atento'));

  let consolidatedAtento: LocalizedCareerItem | null = null;
  if (atentoNodes.length > 0) {
    const progressionText =
      lang === 'PT'
        ? 'Progressão de Carreira: Analista de Suporte (2007/08) ➔ Eng. de Suporte I (2011) ➔ Eng. de Suporte II (2014) ➔ Eng. de Suporte III (2015/16) ➔ Coordenação Técnica Interina'
        : lang === 'FR'
        ? 'Progression : Analyste Support (2007/08) ➔ Ing. Support I (2011) ➔ Ing. Support II (2014) ➔ Ing. Support III (2015/16) ➔ Coordination Technique par intérim'
        : lang === 'ES'
        ? 'Progresión: Analista de Soporte (2007/08) ➔ Ing. de Soporte I (2011) ➔ Ing. de Soporte II (2014) ➔ Ing. de Soporte III (2015/16) ➔ Coordinación Técnica Interina'
        : 'Career Progression: Support Analyst (2007/08) ➔ Support Eng. I (2011) ➔ Support Eng. II (2014) ➔ Support Eng. III (2015/16) ➔ Acting Technical Coordinator';

    const unifiedRole =
      lang === 'PT'
        ? 'Engenheiro de Suporte Técnico III (Telecomunicações, CTI & Automação)'
        : lang === 'FR'
        ? 'Ingénieur Support Technique III (Télécoms, CTI & Automatisation)'
        : lang === 'ES'
        ? 'Ingeniero de Soporte Técnico III (Telecomunicaciones, CTI y Automatización)'
        : 'Technical Support Engineer III (Telecom, CTI & Automation)';

    const unifiedROI =
      lang === 'PT'
        ? 'Garantia de 99,98% de disponibilidade operacional para +40.000 PAs (economia de US$ 500k+) e redução de 99,8% no tempo de processamento de relatórios gerenciais (de 7 dias para 20 minutos).'
        : lang === 'FR'
        ? "Garantie de 99,98% de disponibilité opérationnelle pour +40 000 postes (+500k$ d'économies) et réduction de 99,8% du temps de traitement des rapports (de 7 jours à 20 minutes)."
        : lang === 'ES'
        ? 'Garantizó el 99,98% de disponibilidad operativa para más de 40.000 puestos (ahorro de US$ 500k+) y reducción del 99,8% en el tiempo de procesamiento de informes (de 7 días a 20 minutos).'
        : '99.98% operational uptime across mission-critical infrastructure for 40,000+ workstations (US$ 500k+ saved) and 99.8% reduction in reporting processing latency (from 7 days down to 20 minutes).';

    const unifiedFeat =
      lang === 'PT'
        ? 'Projetou pipelines contínuos de ingestão para +100.000 registros diários de voz e desenvolveu esteiras ETL em T-SQL e Shell Script que reduziram auditorias manuais de 1 semana para 10 segundos.'
        : lang === 'FR'
        ? "Conception de pipelines d'ingestion pour +100 000 enregistrements quotidiens de voix et développement de flux ETL en T-SQL réduisant les audits d'une semaine à 10 secondes."
        : lang === 'ES'
        ? 'Diseñó pipelines continuos de ingestión para más de 100.000 registros diarios de voz y esteiras ETL en T-SQL que redujeron auditorías de 1 semana a 10 segundos.'
        : 'Engineered continuous voice ingestion pipelines for 100,000+ daily records and developed automated T-SQL/Shell ETL scripts slashing manual audit routines from 1 week to 10 seconds.';

    const unifiedSolution =
      lang === 'PT'
        ? 'Gerenciou tráfego massivo de voz e dados em topologias heterogêneas 24/7 (Windows/Linux, LAN/WAN, SIP/VoIP, discadores preditivos e CTI) combinadas a procedures T-SQL otimizadas e automação de banco de dados.'
        : lang === 'FR'
        ? 'Gestion du trafic massif voix/données 24/7 (Windows/Linux, LAN/WAN, SIP/VoIP, CTI et composeurs prédictifs) combinée à des procédures T-SQL optimisées sans intervention manuelle.'
        : lang === 'ES'
        ? 'Gestión de tráfico masivo de voz y datos (Windows/Linux, LAN/WAN, SIP/VoIP, CTI y marcadores predictivos) integrada con procedimientos T-SQL optimizados.'
        : 'Administered 24/7 high-availability telecom infrastructure (Windows/Linux, LAN/WAN, SIP/VoIP, predictive dialers and CTI) combined with optimized T-SQL stored procedures and database automation.';

    consolidatedAtento = {
      id: 'atento-consolidated',
      company: 'Atento',
      role: unifiedRole,
      period: 'Jan 2008 - Dec 2016',
      location: 'São Paulo, Brazil',
      careerProgression: progressionText,
      businessValue: unifiedROI,
      engineeringFeat: unifiedFeat,
      architecturalSolution: unifiedSolution,
      technologies: Array.from(new Set(atentoNodes.flatMap((n) => n.technologies))),
    };
  }

  const localizedStandardNodes: LocalizedCareerItem[] = nonAtento.map((node) => {
    const transObj = lang === 'PT' ? node.pt : lang === 'ES' ? node.es : lang === 'FR' ? node.fr : null;
    const overlay = getRegionalNodeOverlay(node, lang);

    return {
      id: node.id,
      company: node.company,
      role: overlay?.role ?? transObj?.role ?? node.role,
      period: node.period,
      location: node.location,
      careerProgression: node.careerProgression,
      businessValue: overlay?.businessValue ?? transObj?.businessValue ?? node.businessValue,
      engineeringFeat: overlay?.engineeringFeat ?? transObj?.engineeringFeat ?? node.engineeringFeat,
      architecturalSolution: overlay?.architecturalSolution ?? transObj?.architecturalSolution ?? node.architecturalSolution,
      technologies: node.technologies,
    };
  });

  const merged = [
    ...localizedStandardNodes,
    ...(consolidatedSummerhill ? [consolidatedSummerhill] : []),
    ...(consolidatedAtento ? [consolidatedAtento] : []),
  ];

  return merged.sort((a, b) => parsePeriodEndScore(b.period) - parsePeriodEndScore(a.period));
}
