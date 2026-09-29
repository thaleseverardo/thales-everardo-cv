export interface ProjectItem {
  slug: string;
  badge: string;
  company: string;
  period: string;
  stack: string;
  titlePT: string;
  titleEN: string;
  descPT: string;
  descEN: string;
  contentPT: string;
  contentEN: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    slug: 'magalu-11tb-purge',
    badge: '11TB Purgados',
    company: 'Consórcio Magalu',
    period: '05/2024 - Atual',
    stack: 'C#, .NET Core, SQL Server, Sybase, Apache Kafka, Docker, Kubernetes',
    titlePT: 'Purga Particionada de 11TB de Logs — Consórcio Magalu',
    titleEN: '11TB Legacy Log Partitioned Purging Pipeline — Magalu',
    descPT: 'Eliminação definitiva de lockups em produção durante janelas críticas de fechamento fiscal.',
    descEN: 'Zero production lockouts and complete mitigation of downtime risks during fiscal reconciliation cycles.',
    contentPT: `
      <h3>Impacto Comercial (ROI)</h3>
      <p>Eliminação total de contenções de locks em produção e mitigação de risco de indisponibilidade em fechamentos fiscais, recuperando 11 Terabytes de logs históricos.</p>
      <h3>Solução Arquitetural</h3>
      <p>Pipeline desacoplado em lotes com janelas de execução dinâmica fora do pico operacional e monitoramento de pressão de logs. Operações divididas em lotes idempotentes executados de forma autônoma.</p>
    `,
    contentEN: `
      <h3>Executive Business ROI</h3>
      <p>Zero production lockouts and complete mitigation of downtime risks during critical fiscal reconciliation cycles, reclaiming 11 Terabytes of unindexed historical transaction logs.</p>
      <h3>Engineering Architecture</h3>
      <p>Constructed a decoupled asynchronous batch pipeline governed by dynamic execution windows and real-time log buffer pressure monitoring.</p>
    `
  },
  {
    slug: 'gps-financial-latency',
    badge: '-99.8% Latência',
    company: 'Grupo GPS',
    period: '06/2023 - 05/2024',
    stack: 'C#, T-SQL, SQL Server, Index Tuning, ASP.NET Core',
    titlePT: 'Redução de 99,8% de Latência em Pipeline Contábil — Grupo GPS',
    titleEN: '99.8% Latency Reduction in Accounting Pipeline — GPS',
    descPT: 'Redução do tempo de apuração de folha multi-tenant de 7 dias para apenas 20 minutos com consistência total.',
    descEN: 'Slashing computation pipeline latency from 7 days down to 20 minutes with full ACID consistency.',
    contentPT: `
      <h3>Impacto Comercial (ROI)</h3>
      <p>Redução de 99,8% no tempo de processamento contábil e apuração de folha de pagamento multi-tenant, permitindo fechamentos no mesmo dia.</p>
      <h3>Solução Arquitetural</h3>
      <p>Otimização profunda de índices, particionamento de tabelas históricas e paralelização assíncrona em C# com garantias rigorosas de isolamento transacional.</p>
    `,
    contentEN: `
      <h3>Executive Business ROI</h3>
      <p>99.8% reduction in accounting batch processing and multi-tenant payroll settlement time, transitioning operational closures from a 7-day backlog to same-day execution.</p>
      <h3>Engineering Architecture</h3>
      <p>Conducted comprehensive execution plan analysis, index tuning, and clustered historical table partitioning. Parallelized calculation engines asynchronously in C#.</p>
    `
  },
  {
    slug: 'ambar-gs1-sync',
    badge: 'Zero Perda',
    company: 'Ambar / Construtech',
    period: '07/2021 - 06/2023',
    stack: 'C#, RabbitMQ, SQL Server, GS1 Architecture, Microserviços',
    titlePT: 'Barramento de Mensageria GS1 e Outbox — Ambar / Construtech',
    titleEN: 'GS1 Distributed Messaging Broker & Outbox — Ambar',
    descPT: 'Sincronização em tempo real de catálogos e estoques entre 5 centros de distribuição com 0% de perda.',
    descEN: 'Real-time catalog and inventory synchronization across 5 regional distribution centers with zero loss.',
    contentPT: `
      <h3>Impacto Comercial (ROI)</h3>
      <p>Sincronização em tempo real de catálogos e estoques entre 5 centros de distribuição com zero perda de pedidos e atualizações de inventário em subsegundos.</p>
      <h3>Solução Arquitetural</h3>
      <p>Arquitetura de mensageria com barramento padrão GS1 sincronizando ERP e sistemas POS com padrão Transactional Outbox em RabbitMQ e fallback local com idempotência.</p>
    `,
    contentEN: `
      <h3>Executive Business ROI</h3>
      <p>Real-time synchronization of catalogs and inventories across 5 distribution centers with zero order loss and sub-second inventory updates.</p>
      <h3>Engineering Architecture</h3>
      <p>Enterprise messaging architecture leveraging the GS1 standard messaging broker combined with the Transactional Outbox pattern backed by RabbitMQ.</p>
    `
  }
];
