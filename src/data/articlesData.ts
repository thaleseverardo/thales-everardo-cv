export interface ArticleItem {
  slug: string;
  tag: string;
  readTime: string;
  date: string;
  titlePT: string;
  titleEN: string;
  descPT: string;
  descEN: string;
  contentPT: string;
  contentEN: string;
}

export const ARTICLES_DATA: ArticleItem[] = [
  {
    slug: 'system-architecture-principles',
    tag: 'Arquitetura de Sistemas',
    readTime: '6 min',
    date: '15 Jun 2026',
    titlePT: 'Princípios e Decisões Práticas em Ambientes de Alta Volumetria',
    titleEN: 'System Architecture: Principles & Decisions in High-Throughput',
    descPT: 'Fundamentos de decomposição de domínios, isolamento de dados e trade-offs pragmáticos entre consistência e latência.',
    descEN: 'Core domain decomposition, data store isolation, and pragmatic trade-offs between consistency and latency.',
    contentPT: `
      <h3>1. Introdução & Axiomas Fundamentais</h3>
      <p>Projetar arquiteturas corporativas capazes de sustentar alta volumetria sem degradação de disponibilidade exige ultrapassar padrões teóricos. Em produção, decisões arquiteturais são sempre compensações calibradas entre garantias de consistência, latência operacional e viabilidade de manutenção.</p>
      <h3>2. A Falácia da Homogeneidade Distribuída</h3>
      <p>Topologias modernas de microsserviços frequentemente complicam fronteiras de domínio sem necessidade. O desacoplamento deve ser exercido a nível de banco de dados — não apenas via APIs HTTP. O compartilhamento de bancos de dados inevitavelmente gera monólitos distribuídos e contenções de bloqueio severas.</p>
      <h3>3. Desacoplamento Orientado a Eventos e Consistência Pragmática</h3>
      <p>Ao adotar Arquitetura Orientada a Eventos (EDA) sustentada por mensageria (Kafka e RabbitMQ), produtores e consumidores operam de forma assíncrona. O padrão Transactional Outbox assegura que alterações de estado e emissões de eventos permaneçam atômicas sem a sobrecarga de bloqueios em duas fases (2PC).</p>
    `,
    contentEN: `
      <h3>1. Introduction & Foundational Axioms</h3>
      <p>Designing enterprise architectures that sustain high transaction volumes without degraded availability requires moving beyond theoretical patterns. In production, architectural decisions are always calibrated trade-offs between consistency guarantees, operational latency, and infrastructure maintainability.</p>
      <h3>2. The Fallacy of Distributed Homogeneity</h3>
      <p>Modern microservice topologies often over-complicate domain boundaries. Decoupling must be enforced at the database level—not merely via HTTP interfaces. Shared database couplings inevitably generate distributed monoliths and catastrophic lock escalations.</p>
      <h3>3. Event-Driven Decoupling and Pragmatic Consistency</h3>
      <p>By relying on Event-Driven Architecture (EDA) backed by transactional event queues (Kafka, RabbitMQ), producers and consumers operate asynchronously. The Transactional Outbox pattern guarantees that state modifications and event emissions remain atomic without costly two-phase commit (2PC) locks.</p>
    `
  },
  {
    slug: 'database-partitioning-distributed-systems',
    tag: 'SQL Server & Tuning',
    readTime: '8 min',
    date: '20 Jun 2026',
    titlePT: 'Particionamento de Bancos e Purga com Zero Lock em Ambientes Críticos',
    titleEN: 'Database Partitioning & Zero-Lock Purging in Enterprise Systems',
    descPT: 'Estratégias de sliding window, monitoramento de buffer pool e expurgo transacional particionado de múltiplos terabytes.',
    descEN: 'Sliding window partitioning, buffer pool telemetry, and multi-terabyte partitioned transactional purging.',
    contentPT: `
      <h3>1. O Desafio de Saturação de 11TB de Logs</h3>
      <p>Em bancos relacionais com alta taxa de escrita, o acúmulo de dados históricos ao longo de anos gera pressão insustentável no buffer pool e risco iminente de esgotamento do log de transações durante períodos de fechamento contábil.</p>
      <h3>2. Mitigação de Escalação de Locks</h3>
      <p>Operações padrão de exclusão escalam para bloqueios de tabela inteira ao ultrapassar os limites de contenção. A contramedida foi fatiar a execução em lotes dinâmicos com pausas controladas, balizadas pela telemetria em tempo real do uso do log.</p>
      <h3>3. Particionamento por Janela Deslizante</h3>
      <p>O particionamento de tabelas permite desacoplar fatias históricas imutáveis da área ativa. Com isso, purgas operam via chaveamento de partição (SWITCH PARTITION), movendo blocos massivos em milissegundos com zero lock de produção.</p>
    `,
    contentEN: `
      <h3>1. The 11TB Log Saturation Problem</h3>
      <p>In high-throughput relational databases, accumulating historical transactional records over decades leads to severe buffer pool pressure and risk of transaction log exhaustion during fiscal closure cycles.</p>
      <h3>2. Lock Escalation Mitigation</h3>
      <p>Standard DELETE operations hold exclusive table locks once escalation thresholds are breached. To circumvent this, the solution utilizes dynamically sized batches executed asynchronously, constrained by real-time log buffer telemetry.</p>
      <h3>3. Table Partitioning Strategies</h3>
      <p>Sliding window table partitioning isolates historical immutable partitions from active transactional boundaries. Purging operations execute via metadata partition switching (SWITCH PARTITION), transitioning multi-gigabyte blocks in sub-second intervals with zero lock contention.</p>
    `
  },
  {
    slug: 'fault-tolerant-distributed-systems',
    tag: 'Alta Disponibilidade',
    readTime: '7 min',
    date: '01 Jul 2026',
    titlePT: 'Projetando Sistemas Distribuídos Tolerantes a Falhas',
    titleEN: 'Designing Fault-Tolerant Distributed Architectures',
    descPT: 'Padrão Transactional Outbox, clusters relacionais ativo-ativo e contenção de falhas em cascata com Circuit Breaker.',
    descEN: 'Transactional Outbox pattern, active-active relational clusters, and cascade failure mitigation.',
    contentPT: `
      <h3>1. Limites de Falha e Isolamento</h3>
      <p>Em infraestruturas críticas (como centros de despacho 190 ou redes de PDVs em tempo real), a falha de componentes individuais é inevitável. Projetar para tolerância exige limites rígidos de isolamento e caminhos alternativos automáticos.</p>
      <h3>2. Clustering Ativo-Ativo e Failover Automático</h3>
      <p>A replicação síncrona introduz gargalos de rede. Arquiteturas com nós ativos-ativos e monitoramento contínuo por heartbeats permitem failover quase instantâneo sem perda de integridade transacional.</p>
      <h3>3. Idempotência e Circuit Breaker</h3>
      <p>Consumidores de filas precisam de chaves de idempotência para evitar duplicações em reenvios de rede. O uso de Circuit Breakers impede que falhas locais se propaguem para toda a infraestrutura.</p>
    `,
    contentEN: `
      <h3>1. Defining Failure Boundaries</h3>
      <p>In mission-critical infrastructure, partial failure is guaranteed. Architecting for resilience requires strict isolation boundaries and automated failover topologies.</p>
      <h3>2. Active-Active Relational Clustering</h3>
      <p>Utilizing active-active clusters with automated health-check heartbeats and dynamic DNS/carrier failover enables sub-second recovery with 99.99% operational availability.</p>
      <h3>3. Idempotent Ingestion & Circuit Breakers</h3>
      <p>Every downstream consumer must enforce strict idempotency keys. When combined with resilient Circuit Breakers, systemic cascade failures are contained at the perimeter.</p>
    `
  },
  {
    slug: 'reducing-latency-distributed-systems',
    tag: 'Performance & C#',
    readTime: '6 min',
    date: '10 Jul 2026',
    titlePT: 'Eliminando 99,8% da Latência em Pipelines de Cálculo e Eventos',
    titleEN: 'Eliminating 99.8% Latency in Financial Computation Pipelines',
    descPT: 'Como um processamento contábil de 7 dias foi reduzido para 20 minutos com tuning de índices e paralelismo em C#.',
    descEN: 'Slashing a 7-day financial pipeline down to 20 minutes via index optimization and C# parallelization.',
    contentPT: `
      <h3>1. O Gargalo de 7 Dias</h3>
      <p>Pipelines de cálculo financeiro e folha multi-tenant acumulavam 7 dias de execução contínua devido a varreduras completas em tabelas e cursores sequenciais.</p>
      <h3>2. Análise Profunda do Plano de Execução</h3>
      <p>A intervenção exigiu análise minuciosa de I/O e CPU, substituindo buscas de chaves por índices cobertos e reescrevendo cálculos procedurais em operações relacionais orientadas a conjuntos.</p>
      <h3>3. Paralelismo Assíncrono em C# .NET</h3>
      <p>A reestruturação para um pipeline assíncrono multithreaded com particionamento em memória reduziu a latência de 10.080 minutos (7 dias) para 20 minutos (-99,8%), com validação transacional estrita.</p>
    `,
    contentEN: `
      <h3>1. The Latency Bottleneck: 7 Days to Settle</h3>
      <p>Enterprise accounting and multi-tenant payroll pipelines frequently suffer from compounding bottlenecks: unindexed table scans, nested cursor loops, and sequential procedural logic.</p>
      <h3>2. Deep Execution Plan Profiling</h3>
      <p>Eliminating bottlenecks requires inspecting execution plans at the CPU and I/O subsystem level. Key interventions include replacing key lookups with covering clustered indices and set-based relational operations.</p>
      <h3>3. Multithreaded Asynchronous Pipeline</h3>
      <p>By restructuring sequential batch procedures into a multi-threaded parallel pipeline in C# .NET Core, transactional batches execute concurrently, slashing execution latency down to 20 minutes (-99.8%).</p>
    `
  },
  {
    slug: 'data-engineering-architecture-scalability',
    tag: 'Engenharia de Dados',
    readTime: '7 min',
    date: '20 Jul 2026',
    titlePT: 'Arquitetura de Engenharia de Dados: Escalabilidade e Garantias ACID',
    titleEN: 'Enterprise Data Engineering Architecture & ACID Guarantees',
    descPT: 'Ingestão desacoplada de alto volume, sincronização em tempo real via mensageria GS1 e cache resiliente offline.',
    descEN: 'Decoupled event ingestion, GS1 standard messaging broker, and offline-first cache synchronization.',
    contentPT: `
      <h3>1. Ingestão Sob Alta Pressão Volumétrica</h3>
      <p>Processar centenas de milhares de eventos transacionais diários exige um buffer de ingestão desacoplado para não exaurir os recursos dos bancos relacionais.</p>
      <h3>2. Barramento de Mensageria Padrão GS1</h3>
      <p>A sincronização em tempo real entre ERP e sistemas de ponto de venda (PDV) com padrão GS1 garantiu consistência de estoques e catálogos em centros de distribuição regionais sem perda de transações.</p>
      <h3>3. Cache Offline e Reconciliação Bidirecional</h3>
      <p>A arquitetura offline-first com SQLite local permite que filiais operem normalmente em quedas de rede, reconciliando o estado de inventário assim que a conectividade for restabelecida.</p>
    `,
    contentEN: `
      <h3>1. Data Ingestion Under High Volumetric Pressure</h3>
      <p>Processing hundreds of thousands of daily transactional records requires a decoupled ingestion buffer. Ingesting raw events directly into ACID relational stores causes resource starvation during traffic spikes.</p>
      <h3>2. The GS1 Standard Messaging Broker</h3>
      <p>By implementing a standard messaging broker bridging point-of-sale (POS) systems and central ERP endpoints, product catalogs and inventory states remain synchronised across distributed regional hubs in real time.</p>
      <h3>3. Maintaining Global State with Local Resilience</h3>
      <p>Offline-first SQLite local caching paired with resilient background sync queues guarantees that field endpoints continue operating seamlessly during connectivity outages, reconciling state bi-directionally upon reconnection.</p>
    `
  }
];
