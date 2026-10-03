import { LocalizedArticle } from '../../../types';

export const ARTICLES_EN: LocalizedArticle[] = [
  {
    slug: 'database-partitioning-distributed-systems',
    tag: 'Database Architecture',
    date: '2026-06-20',
    readTime: '6 min read',
    title: 'Database Partitioning and Zero-Lock Purging in Enterprise Distributed Systems',
    desc: 'How to execute partitioned asynchronous data purges across multi-terabyte transactional tables without lock escalations or production downtime.',
    content: `
      <h3>1. The 11TB Log Saturation Problem</h3>
      <p>In high-throughput relational databases, accumulating historical transactional records over decades leads to severe buffer pool pressure, index fragmentation, and risk of transaction log exhaustion during fiscal closure cycles.</p>
      <h3>2. Lock Escalation Mitigation</h3>
      <p>Standard DELETE operations hold exclusive table locks once escalation thresholds are breached. To circumvent this, the architectural solution utilizes dynamically sized batches (chunking) executed asynchronously during low-contention windows, constrained by real-time log buffer telemetry.</p>
      <h3>3. Table Partitioning Strategies</h3>
      <p>Sliding window table partitioning isolates historical immutable partitions from active transactional boundaries. Purging operations then execute via metadata partition switching (SWITCH PARTITION), transitioning multi-gigabyte blocks in sub-second execution intervals with zero lock contention.</p>
    `,
  },
  {
    slug: 'data-engineering-architecture-scalability',
    tag: 'Data Engineering',
    date: '2026-07-20',
    readTime: '7 min read',
    title: 'Enterprise Data Engineering Architecture: Scalability, Reliability, and ACID Compliance',
    desc: 'Scalable data ingestion pipelines, message broker synchronization, and POS-to-ERP real-time consistency by Thales Everardo Albuquerque Reis.',
    content: `
      <h3>1. Data Ingestion Under High Volumetric Pressure</h3>
      <p>Processing hundreds of thousands of daily transactional records requires a decoupled ingestion buffer. Ingesting raw events directly into ACID relational stores causes resource starvation and dropped packets during traffic spikes.</p>
      <h3>2. The GS1 Standard Messaging Broker</h3>
      <p>By implementing a standard messaging broker bridging point-of-sale (POS) systems and central ERP endpoints, product catalogs and inventory states remain synchronised across distributed regional hubs in real time.</p>
      <h3>3. Maintaining Global State with Local Resilience</h3>
      <p>Offline-first SQLite local caching paired with resilient background sync queues guarantees that field endpoints continue operating seamlessly during connectivity outages, reconciling state bi-directionally upon reconnection with zero data loss.</p>
    `,
  },
  {
    slug: 'fault-tolerant-distributed-systems',
    tag: 'Distributed Systems',
    date: '2026-07-01',
    readTime: '8 min read',
    title: 'Designing Fault-Tolerant Distributed Architectures: Outbox Pattern and Active-Active Clusters',
    desc: 'Architectural blueprints for mission-critical uptime: Active-Active relational clustering, circuit breakers, and idempotent event ingestion.',
    content: `
      <h3>1. Defining Failure Boundaries</h3>
      <p>In mission-critical infrastructure (such as 911/190 emergency dispatch or high-frequency retail POS networks), partial failure is guaranteed. Architecting for resilience requires strict isolation boundaries and automated failover topologies.</p>
      <h3>2. Active-Active Relational Clustering</h3>
      <p>Synchronous cross-node replication introduces network latency overheads. Utilizing active-active clusters with automated health-check heartbeats and dynamic DNS/carrier failover enables sub-second recovery with 99.99% operational availability.</p>
      <h3>3. Idempotent Ingestion & Circuit Breakers</h3>
      <p>Every downstream consumer must enforce strict idempotency keys. When combined with resilient Circuit Breakers, systemic cascade failures are contained at the perimeter before contaminating core transactional databases.</p>
    `,
  },
  {
    slug: 'reducing-latency-distributed-systems',
    tag: 'Performance Engineering',
    date: '2026-07-10',
    readTime: '5 min read',
    title: 'Eliminating 99.8% Latency in Financial Computation and Event Pipelines',
    desc: 'Deep technical analysis: Slashing a 7-day multi-tenant batch computation down to 20 minutes through clustered index tuning and asynchronous parallelization in C#.',
    content: `
      <h3>1. The Latency Bottleneck: 7 Days to Settle</h3>
      <p>Enterprise accounting and multi-tenant payroll pipelines frequently suffer from compounding bottlenecks: unindexed table scans, nested cursor loops, and sequential procedural logic executing across millions of rows.</p>
      <h3>2. Deep Execution Plan Profiling</h3>
      <p>Eliminating bottlenecks requires inspecting execution plans at the CPU and I/O subsystem level. Key interventions include replacing key lookups with covering clustered indices, rewriting scalar subqueries into set-based relational operations, and enforcing index partition alignment.</p>
      <h3>3. Multithreaded Asynchronous Pipeline</h3>
      <p>By restructuring sequential batch procedures into a multi-threaded parallel pipeline in C# .NET Core, transactional batches execute concurrently across partitioned memory blocks, slashing execution latency from 7 days (10,080 minutes) to 20 minutes (-99.8%).</p>
    `,
  },
  {
    slug: 'system-architecture-principles',
    tag: 'Architecture & Design',
    date: '2026-06-15',
    readTime: '6 min read',
    title: 'System Architecture: Principles and Practical Decisions in High-Throughput Environments',
    desc: 'Architectural principles, domain decomposition, and pragmatic trade-offs in distributed mission-critical systems by Thales Everardo Albuquerque Reis.',
    content: `
      <h3>1. Introduction & Foundational Axioms</h3>
      <p>Designing enterprise architectures that sustain high transaction volumes without degraded availability requires moving beyond theoretical patterns. In production, architectural decisions are always calibrated trade-offs between consistency guarantees, operational latency, and infrastructure maintainability.</p>
      <h3>2. The Fallacy of Distributed Homogeneity</h3>
      <p>Modern microservice topologies often over-complicate domain boundaries. Through years of scaling core enterprise systems, decoupling must be enforced at the data store level—not merely via HTTP interfaces. Shared database couplings inevitably generate distributed monoliths and catastrophic lock escalations.</p>
      <h3>3. Event-Driven Decoupling and Pragmatic Consistency</h3>
      <p>By relying on Event-Driven Architecture (EDA) backed by transactional event queues (e.g. Apache Kafka and RabbitMQ), producers and consumers operate asynchronously. The Transactional Outbox pattern guarantees that state modifications and event emissions remain atomic without costly two-phase commit (2PC) locks.</p>
    `,
  },
];
