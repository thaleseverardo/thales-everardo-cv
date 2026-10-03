import { LocalizedProject } from '../../../types';

export const PROJECTS_PT: LocalizedProject[] = [
  {
    slug: 'magalu-11tb-purge',
    badge: 'SQL Server · Kafka · 11TB Purge',
    company: 'Consórcio Magalu',
    period: '05/2024 - Atual',
    stack: 'C#, .NET Core, SQL Server, Sybase, Apache Kafka, Docker, Kubernetes',
    title: 'Pipeline de Purga Assíncrona e Particionada de 11TB de Logs Legados',
    desc: 'Purga assíncrona de 11 Terabytes de logs transacionais legados em Microsoft SQL Server sem geração de locks ou parada de produção.',
    content: `
      <h3>Impacto de Negócio Executivo</h3>
      <p>Eliminação de contenções (locks) críticas em produção e mitigação total de riscos de indisponibilidade durante períodos de fechamento contábil e fiscal, recuperando 11 Terabytes de armazenamento em disco.</p>
      <h3>Arquitetura de Engenharia</h3>
      <p>Construção de um pipeline desacoplado em lotes dinâmicos governado por monitoramento em tempo real da pressão dos buffers de log de transação. Fracionamento das operações em blocos idempotentes executados fora dos horários de pico operacional.</p>
    `,
  },
  {
    slug: 'gps-financial-latency',
    badge: 'Latency -99.8% · 7 Dias -> 20 Mins',
    company: 'Grupo GPS',
    period: '06/2023 - 05/2024',
    stack: 'C#, T-SQL, SQL Server, Index Tuning, ASP.NET Core',
    title: 'Redução de 99,8% na Latência de Pipeline Contábil Multi-Tenant',
    desc: 'Redução do tempo de processamento contábil e apuração de folha de pagamento de 7 dias para 20 minutos com consistência ACID total.',
    content: `
      <h3>Impacto de Negócio Executivo</h3>
      <p>Redução de 99,8% no tempo de processamento contábil e apuração de folha de pagamento corporativa, transformando rotinas de fechamento com acúmulo de 7 dias em liquidação no mesmo dia.</p>
      <h3>Arquitetura de Engenharia</h3>
      <p>Execução de profiling minucioso de planos de execução, otimização de índices de cobertura e particionamento de tabelas históricas. Paralelização assíncrona dos motores de cálculo em C# com garantias estritas de isolamento transacional.</p>
    `,
  },
  {
    slug: 'ambar-gs1-sync',
    badge: 'Padrão GS1 · Estoque em Tempo Real · RabbitMQ',
    company: 'Ambar / Construtech',
    period: '07/2021 - 06/2023',
    stack: 'C#, RabbitMQ, SQL Server, GS1 Architecture, Microservices',
    title: 'Barramento de Mensageria Distribuída Padrão GS1 & Transactional Outbox',
    desc: 'Sincronização em tempo real de catálogos e estoques entre 5 centros de distribuição sem perda de pedidos via barramento padrão GS1.',
    content: `
      <h3>Impacto de Negócio Executivo</h3>
      <p>Sincronização em tempo real de catálogos e estoques entre 5 centros de distribuição com zero perda de pedidos e atualização de inventário em sub-segundo.</p>
      <h3>Arquitetura de Engenharia</h3>
      <p>Arquitetura corporativa de mensageria baseada no padrão internacional GS1 aliada ao padrão Transactional Outbox suportada por filas RabbitMQ e fallback local com consumo estritamente idempotente.</p>
    `,
  },
];
