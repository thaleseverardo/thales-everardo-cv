import { LocalizedProject } from '../../../types';

export const PROJECTS_ES: LocalizedProject[] = [
  {
    slug: 'magalu-11tb-purge',
    badge: 'SQL Server · Kafka · Purga 11TB',
    company: 'Consórcio Magalu',
    period: '05/2024 - Actualidad',
    stack: 'C#, .NET Core, SQL Server, Sybase, Apache Kafka, Docker, Kubernetes',
    title: 'Pipeline de Purga Asíncrona y Particionada de 11TB de Logs Transaccionales',
    desc: 'Purga asíncrona de 11 Terabytes de logs transaccionales en Microsoft SQL Server sin bloqueos transaccionales ni paradas de producción.',
    content: `
      <h3>Impacto de Negocio Ejecutivo</h3>
      <p>Cero bloqueos en producción y mitigación total de riesgos de indisponibilidad durante cierres fiscales críticos, recuperando 11 Terabytes de almacenamiento en disco.</p>
      <h3>Arquitectura de Ingeniería</h3>
      <p>Construcción de un pipeline desacoplado por lotes dinámicos controlado por telemetría de buffers de log en tiempo real. División de las operaciones en bloques idempotentes ejecutados fuera de horas punta.</p>
    `,
  },
  {
    slug: 'gps-financial-latency',
    badge: 'Latencia -99,8% · 7 Días -> 20 Mins',
    company: 'Grupo GPS',
    period: '06/2023 - 05/2024',
    stack: 'C#, T-SQL, SQL Server, Index Tuning, ASP.NET Core',
    title: 'Reducción del 99,8% de Latencia en Pipeline Contable Multi-Tenant',
    desc: 'Reducción del tiempo de cálculo contable y liquidación de nóminas de 7 días a solo 20 minutos con consistencia ACID total.',
    content: `
      <h3>Impacto de Negocio Ejecutivo</h3>
      <p>Reducción del 99,8% en el tiempo de procesamiento contable y liquidación de nóminas corporativas, transformando cierres de 7 días en liquidaciones en el mismo día.</p>
      <h3>Arquitectura de Ingeniería</h3>
      <p>Análisis profundo de planes de ejecución, ajuste fino de índices y particionamiento de tablas históricas. Paralelización asíncrona del motor de cálculo en C# con aislamiento transaccional estricto.</p>
    `,
  },
  {
    slug: 'ambar-gs1-sync',
    badge: 'Estándar GS1 · Stock en Tiempo Real · RabbitMQ',
    company: 'Ambar / Construtech',
    period: '07/2021 - 06/2023',
    stack: 'C#, RabbitMQ, SQL Server, GS1 Architecture, Microservices',
    title: 'Broker de Mensajería Distribuida Estándar GS1 y Transactional Outbox',
    desc: 'Sincronización en tiempo real de catálogos y existencias en 5 centros de distribución sin pérdida de pedidos mediante el estándar GS1.',
    content: `
      <h3>Impacto de Negocio Ejecutivo</h3>
      <p>Sincronización en tiempo real de catálogos e inventarios en 5 centros de distribución sin pérdida de pedidos y actualización submilisegundo.</p>
      <h3>Arquitectura de Ingeniería</h3>
      <p>Arquitectura de mensajería empresarial basada en el estándar internacional GS1 combinada con el patrón Transactional Outbox sobre RabbitMQ y tolerancia local a desconexión.</p>
    `,
  },
];
