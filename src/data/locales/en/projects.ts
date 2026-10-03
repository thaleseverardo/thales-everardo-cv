import { LocalizedProject } from '../../../types';

export const PROJECTS_EN: LocalizedProject[] = [
  {
    slug: 'magalu-11tb-purge',
    badge: 'SQL Server · Kafka · 11TB Purge',
    company: 'Consórcio Magalu',
    period: '05/2024 - Present',
    stack: 'C#, .NET Core, SQL Server, Sybase, Apache Kafka, Docker, Kubernetes',
    title: '11TB Legacy Log Partitioned Purging Pipeline — Consórcio Magalu',
    desc: 'High-throughput asynchronous purge of 11TB legacy transaction logs on Microsoft SQL Server without lock escalations or production downtime.',
    content: `
      <h3>Executive Business ROI</h3>
      <p>Zero production lockouts and complete mitigation of downtime risks during critical fiscal reconciliation cycles, reclaiming 11 Terabytes of unindexed historical transaction logs.</p>
      <h3>Engineering Architecture</h3>
      <p>Constructed a decoupled asynchronous batch pipeline governed by dynamic execution windows and real-time log buffer pressure monitoring. Sliced multi-gigabyte transactional operations into idempotent, dynamically sized chunks executed during off-peak hours.</p>
    `,
  },
  {
    slug: 'gps-financial-latency',
    badge: 'Latency -99.8% · 7 Days -> 20 Mins',
    company: 'Grupo GPS',
    period: '06/2023 - 05/2024',
    stack: 'C#, T-SQL, SQL Server, Index Tuning, ASP.NET Core',
    title: '99.8% Latency Reduction in Multi-Tenant Accounting Pipeline — Grupo GPS',
    desc: 'Slashing financial computation pipeline latency from 7 days down to 20 minutes (-99.8%) with full ACID consistency through clustered table partitioning.',
    content: `
      <h3>Executive Business ROI</h3>
      <p>99.8% reduction in accounting batch processing and multi-tenant payroll settlement time, transitioning operational closures from a 7-day backlog to same-day execution.</p>
      <h3>Engineering Architecture</h3>
      <p>Conducted comprehensive execution plan analysis, index tuning, and clustered historical table partitioning. Parallelized calculation engines asynchronously in C# with strict transaction isolation guarantees.</p>
    `,
  },
  {
    slug: 'ambar-gs1-sync',
    badge: 'GS1 Standard · Real-Time Stock · RabbitMQ',
    company: 'Ambar / Construtech',
    period: '07/2021 - 06/2023',
    stack: 'C#, RabbitMQ, SQL Server, GS1 Architecture, Microservices',
    title: 'GS1 Distributed Messaging Broker & Transactional Outbox — Ambar / Construtech',
    desc: 'Real-time catalog and inventory synchronization across 5 regional distribution centers with 0% order loss using the GS1 standard messaging broker.',
    content: `
      <h3>Executive Business ROI</h3>
      <p>Real-time synchronization of catalogs and inventories across 5 distribution centers with zero order loss and sub-second inventory updates.</p>
      <h3>Engineering Architecture</h3>
      <p>Enterprise messaging architecture leveraging the GS1 standard messaging broker combined with the Transactional Outbox pattern backed by RabbitMQ and local fallback persistence with idempotent processing.</p>
    `,
  },
];
