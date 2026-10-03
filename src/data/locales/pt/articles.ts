import { LocalizedArticle } from '../../../types';

export const ARTICLES_PT: LocalizedArticle[] = [
  {
    slug: 'database-partitioning-distributed-systems',
    tag: 'Database Architecture',
    date: '2026-06-20',
    readTime: '6 min read',
    title: 'Particionamento de Banco de Dados e Purga com Zero Lock em Sistemas Distribuídos',
    desc: 'Como executar expurgos assíncronos e particionados em tabelas transacionais de múltiplos terabytes sem escalonamento de locks ou paradas de produção.',
    content: `
      <h3>1. O Problema de Saturação de Logs de 11TB</h3>
      <p>Em bancos de dados relacionais corporativos de alto throughput, o acúmulo contínuo de registros transacionais gera pressão sobre o buffer pool, fragmentação severa de índices e risco real de esgotamento do log durante fechamentos fiscais.</p>
      <h3>2. Mitigação de Escalonamento de Locks (Lock Escalation)</h3>
      <p>Operações de DELETE convencionais adquirem locks exclusivos em nível de tabela quando atingem o limite de escalonamento. A intervenção arquitetural implementa lotes assíncronos com dimensionamento dinâmico (chunking) executados durante janelas de baixa concorrência, controlados por telemetria de pressão de buffer de logs em tempo real.</p>
      <h3>3. Particionamento por Janela Deslizante (Sliding Window)</h3>
      <p>A partição de tabelas isola partições históricas imutáveis da área transacional ativa. A purga executa via comutação de metadados (SWITCH PARTITION), transferindo blocos multi-gigabytes em intervalos sub-segundo com contenção zero.</p>
    `,
  },
  {
    slug: 'data-engineering-architecture-scalability',
    tag: 'Data Engineering',
    date: '2026-07-20',
    readTime: '7 min read',
    title: 'Arquitetura de Engenharia de Dados Corporativa: Escalabilidade, Confiabilidade e Conformidade ACID',
    desc: 'Pipelines escaláveis de ingestão de dados, sincronização por mensageria e consistência em tempo real entre PDVs e ERP central.',
    content: `
      <h3>1. Ingestão de Dados Sob Alta Pressão Volumétrica</h3>
      <p>Processar centenas de milhares de transações diárias exige um buffer de ingestão desacoplado. Ingerir eventos brutos diretamente em tabelas relacionais ACID causa contenção de recursos e perda de pacotes durante picos de tráfego.</p>
      <h3>2. O Barramento Padrão GS1 de Mensageria</h3>
      <p>Ao implementar um barramento de mensageria padrão GS1 integrando pontos de venda (PDV) e o ERP central, os catálogos de produtos e posições de estoque permanecem sincronizados em tempo real entre centros de distribuição.</p>
      <h3>3. Consistência Global com Resiliência Local (Offline-First)</h3>
      <p>O cache local com SQLite combinado a filas de background resilientes garante que terminais em campo continuem operando normalmente durante quedas de rede, reconciliando dados bidirecionalmente sem perdas na reconexão.</p>
    `,
  },
  {
    slug: 'fault-tolerant-distributed-systems',
    tag: 'Distributed Systems',
    date: '2026-07-01',
    readTime: '8 min read',
    title: 'Projetando Arquiteturas Distribuídas Tolerantes a Falhas: Padrão Outbox e Clusters Ativo-Ativo',
    desc: 'Diretrizes arquiteturais para alta disponibilidade: clustering relacional ativo-ativo, circuit breakers e consumo idempotente.',
    content: `
      <h3>1. Fronteiras de Falha em Ambientes Críticos</h3>
      <p>Em infraestruturas de missão crítica (como centros de despacho 190 ou redes de PDVs varejistas), falhas parciais são inevitáveis. Projetar para resiliência exige fronteiras estritas de isolamento e failover automatizado.</p>
      <h3>2. Clustering Relacional Ativo-Ativo</h3>
      <p>A replicação síncrona entre nós introduz latência de rede. O uso de clusters ativo-ativo com heartbeats automatizados e contingência dinâmica de DNS/telefonia viabiliza recuperação em sub-segundo com 99,99% de disponibilidade operacional.</p>
      <h3>3. Consumo Idempotente & Circuit Breakers</h3>
      <p>Cada consumidor downstream deve aplicar chaves de idempotência estritas. Em conjunto com Circuit Breakers, falhas em cascata são contidas no perímetro antes de atingir o banco transacional principal.</p>
    `,
  },
  {
    slug: 'reducing-latency-distributed-systems',
    tag: 'Performance Engineering',
    date: '2026-07-10',
    readTime: '5 min read',
    title: 'Eliminando 99,8% da Latência em Computação Financeira e Pipelines de Eventos',
    desc: 'Análise técnica: Redução de pipeline contábil de 7 dias para 20 minutos via particionamento, index tuning e paralelismo assíncrono em C#.',
    content: `
      <h3>1. O Gargalo: 7 Dias para Fechamento de Lote</h3>
      <p>Pipelines de contabilidade e folha de pagamento corporativos multi-tenant sofrem com gargalos compostos: scans de tabelas desindexadas, loops com cursores aninhados e processamento procedural sequencial em milhões de linhas.</p>
      <h3>2. Profiling Profundo de Planos de Execução</h3>
      <p>A eliminação de gargalos requer análise no nível do subsistema de I/O e CPU. Intervenções centrais incluem substituir key lookups por índices clusterizados de cobertura, reescrever subconsultas escalares em operações relacionais e alinhar partições de índices.</p>
      <h3>3. Pipeline Assíncrono Multithreaded</h3>
      <p>Ao reestruturar procedimentos em lotes concorrentes em C# .NET Core, as apurações transacionais executam simultaneamente em blocos de memória particionados, reduzindo a latência de 7 dias (10.080 minutos) para 20 minutos (-99,8%).</p>
    `,
  },
  {
    slug: 'system-architecture-principles',
    tag: 'Architecture & Design',
    date: '2026-06-15',
    readTime: '6 min read',
    title: 'Arquitetura de Sistemas: Princípios e Decisões Práticas em Ambientes de Alta Volumetria',
    desc: 'Princípios de design, decomposição de domínios e trade-offs pragmáticos em sistemas distribuídos de missão crítica.',
    content: `
      <h3>1. Introdução & Axiomas Fundamentais</h3>
      <p>Projetar arquiteturas corporativas que sustentam volumes massivos de transações sem comprometer a disponibilidade exige superar receitas prontas. Em produção, decisões arquiteturais são calibrações de trade-offs entre garantias de consistência, latência e custo de manutenção.</p>
      <h3>2. A Falácia da Homogeneidade Distribuída</h3>
      <p>Topologias de microsserviços frequentemente criam complexidade excessiva de domínios. O desacoplamento deve ser assegurado no nível de banco de dados — não apenas via HTTP. Bancos compartilhados geram monólitos distribuídos e contenções catastróficas.</p>
      <h3>3. Desacoplamento Orientado a Eventos e Padrão Outbox</h3>
      <p>Com Arquitetura Orientada a Eventos (EDA) suportada por mensageria (Kafka e RabbitMQ), emissores e consumidores operam de forma assíncrona. O padrão Transactional Outbox assegura que alterações de estado e envio de eventos ocorram atomicamente sem locks distribuídos 2PC.</p>
    `,
  },
];
