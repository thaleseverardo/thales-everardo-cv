import { LocalizedArticle } from '../../../types';

export const ARTICLES_ES: LocalizedArticle[] = [
  {
    slug: 'database-partitioning-distributed-systems',
    tag: 'Arquitectura de Datos',
    date: '2026-06-20',
    readTime: '6 min de lectura',
    title: 'Particionamiento de Bases de Datos y Purga sin Bloqueos en Sistemas Distribuidos',
    desc: 'Cómo ejecutar purgas asíncronas particionadas en tablas transaccionales de múltiples terabytes sin escalamiento de bloqueos ni paradas de producción.',
    content: `
      <h3>1. El Problema de Saturación de Logs de 11TB</h3>
      <p>En bases de datos relacionales empresariales de alto rendimiento, la acumulación continua de registros transaccionales genera presión en el buffer pool, fragmentación de índices y riesgo de agotamiento de logs durante cierres fiscales.</p>
      <h3>2. Mitigación del Escalamiento de Bloqueos (Lock Escalation)</h3>
      <p>Las operaciones DELETE tradicionales adquieren bloqueos exclusivos a nivel de tabla. La solución arquitectónica implementa lotes asíncronos con dimensionamiento dinámico ejecutados en ventanas de baja concurrencia, controlados por telemetría de buffers de log en tiempo real.</p>
      <h3>3. Particionamiento por Ventana Deslizante</h3>
      <p>El particionamiento aísla particiones históricas inmutables de la zona transaccional activa. La purga se ejecuta mediante conmutación de metadatos (SWITCH PARTITION), transfiriendo bloques de varios gigabytes en milisegundos sin contención.</p>
    `,
  },
  {
    slug: 'data-engineering-architecture-scalability',
    tag: 'Ingeniería de Datos',
    date: '2026-07-20',
    readTime: '7 min de lectura',
    title: 'Arquitectura de Ingeniería de Datos Empresarial: Escalabilidad, Confiabilidad y Cumplimiento ACID',
    desc: 'Pipelines escalables de ingestión de datos, sincronización por mensajería y consistencia en tiempo real entre puntos de venta y ERP central.',
    content: `
      <h3>1. Ingestión de Datos Bajo Alta Presión Volumétrica</h3>
      <p>Procesar cientos de miles de transacciones diarias requiere un búfer de ingestión desacoplado. Ingerir eventos crudos directamente en tablas relacionales ACID satura recursos y genera pérdida de paquetes en picos de demanda.</p>
      <h3>2. El Broker de Mensajería Estándar GS1</h3>
      <p>Al implementar un broker de mensajería con estándar GS1 integrando puntos de venta (POS) y el ERP corporativo, los catálogos y existencias de inventario se sincronizan en tiempo real en todos los centros regionales.</p>
      <h3>3. Consistencia Global con Resiliencia Local (Offline-First)</h3>
      <p>El almacenamiento local con SQLite y colas en segundo plano asegura la operatividad ininterrumpida en campo ante caídas de red, reconciliando los datos de forma bidireccional y sin pérdidas al reconectar.</p>
    `,
  },
  {
    slug: 'fault-tolerant-distributed-systems',
    tag: 'Sistemas Distribuidos',
    date: '2026-07-01',
    readTime: '8 min de lectura',
    title: 'Diseño de Arquitecturas Distribuidas Tolerantes a Fallos: Patrón Outbox y Clústeres Activo-Activo',
    desc: 'Estrategias arquitectónicas para alta disponibilidad: clustering relacional activo-activo, disyuntores de circuito y consumo idempotente.',
    content: `
      <h3>1. Fronteras de Fallo en Entornos Críticos</h3>
      <p>En infraestructuras de misión crítica (como centrales de despacho de emergencias o redes de tiendas), los fallos parciales son inevitables. Diseñar para resiliencia requiere límites de aislamiento y conmutación automatizada.</p>
      <h3>2. Clustering Relacional Activo-Activo</h3>
      <p>La replicación síncrona introduce latencia de red. El despliegue de clústeres activo-activo con comprobaciones de estado automáticas y conmutación dinámica de DNS permite recuperación en submilisegundos con 99,99% de disponibilidad.</p>
      <h3>3. Ingestión Idempotente y Circuit Breakers</h3>
      <p>Cada consumidor downstream debe aplicar claves de idempotencia estrictas. En combinación con Circuit Breakers, los fallos en cascada se aíslan en el perímetro antes de comprometer la base de datos transaccional central.</p>
    `,
  },
  {
    slug: 'reducing-latency-distributed-systems',
    tag: 'Optimización de Rendimiento',
    date: '2026-07-10',
    readTime: '5 min de lectura',
    title: 'Eliminación del 99,8% de Latencia en Computación Financiera y Pipelines de Eventos',
    desc: 'Análisis técnico: Reducción de pipeline contable de 7 días a 20 minutos mediante particionamiento, optimización de índices y paralelismo asíncrono en C#.',
    content: `
      <h3>1. El Cuello de Botella: 7 Días de Liquidación</h3>
      <p>Los procesos de liquidación contable y nómina multi-tenant acumulan cuellos de botella: lecturas de tablas completas sin indexar, bucles anidados y lógica procedural secuencial sobre millones de filas.</p>
      <h3>2. Profiling Profundo de Planes de Ejecución</h3>
      <p>Eliminar cuellos de botella exige inspeccionar planes de ejecución a nivel de CPU y subsistema de I/O. Las intervenciones clave incluyen sustituir key lookups por índices clúster de cobertura y paralelizar consultas relacionales.</p>
      <h3>3. Pipeline Asíncrono Multihilo</h3>
      <p>Reestructurando procedimientos por lotes en un pipeline paralelo multihilo en C# .NET Core, las operaciones se ejecutan concurrentemente en bloques de memoria particionados, reduciendo la latencia de 7 días a 20 minutos (-99,8%).</p>
    `,
  },
  {
    slug: 'system-architecture-principles',
    tag: 'Arquitectura y Diseño',
    date: '2026-06-15',
    readTime: '6 min de lectura',
    title: 'Arquitectura de Sistemas: Principios y Decisiones Prácticas en Entornos de Alto Rendimiento',
    desc: 'Principios de diseño, descomposición de dominios y compromisos pragmáticos en sistemas distribuidos de misión crítica.',
    content: `
      <h3>1. Introducción y Axiomas Fundamentales</h3>
      <p>Diseñar arquitecturas empresariales capaces de procesar altos volúmenes de transacciones sin degradación requiere trascender recetas teóricas. En producción, las decisiones son compromisos calibrados entre consistencia, latencia y mantenimiento.</p>
      <h3>2. La Falacia de la Homogeneidad Distribuida</h3>
      <p>Las topologías de microservicios suelen complicar en exceso las fronteras de dominio. El desacoplamiento debe garantizarse a nivel de base de datos — no solo mediante APIs HTTP. Las bases compartidas generan monolitos distribuidos y bloqueos críticos.</p>
      <h3>3. Desacoplamiento Orientado a Eventos y Patrón Outbox</h3>
      <p>Con Arquitectura Orientada a Eventos (EDA) respaldada por colas transaccionales (Kafka y RabbitMQ), emisores y receptores operan asíncronamente. El patrón Transactional Outbox garantiza que los cambios de estado y emisiones de eventos sean atómicos sin bloqueos 2PC.</p>
    `,
  },
];
