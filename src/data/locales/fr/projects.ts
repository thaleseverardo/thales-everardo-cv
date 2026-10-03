import { LocalizedProject } from '../../../types';

export const PROJECTS_FR: LocalizedProject[] = [
  {
    slug: 'magalu-11tb-purge',
    badge: 'SQL Server · Kafka · Purge 11 To',
    company: 'Consórcio Magalu',
    period: '05/2024 - Présent',
    stack: 'C#, .NET Core, SQL Server, Sybase, Apache Kafka, Docker, Kubernetes',
    title: 'Pipeline de Purge Asynchrone et Partitionnée de 11 To de Journaux Hérités',
    desc: 'Purge asynchrone à haut débit de 11 To de journaux sur Microsoft SQL Server sans escalade de verrouillage ni indisponibilité.',
    content: `
      <h3>Impact Business Exécutif</h3>
      <p>Zéro verrouillage en production et élimination des risques de panne lors des clôtures fiscales critiques, récupérant 11 Téraoctets d'espace disque.</p>
      <h3>Architecture d'Ingénierie</h3>
      <p>Construction d'un pipeline par lots asynchrones découplés régi par la télémétrie des tampons en temps réel. Découpage des opérations en blocs idempotents exécutés pendant les heures creuses.</p>
    `,
  },
  {
    slug: 'gps-financial-latency',
    badge: 'Latence -99,8% · 7 Jours -> 20 Mins',
    company: 'Grupo GPS',
    period: '06/2023 - 05/2024',
    stack: 'C#, T-SQL, SQL Server, Index Tuning, ASP.NET Core',
    title: 'Réduction de 99,8% de la Latence du Pipeline Comptable Multi-Entités',
    desc: 'Réduction du temps de traitement financier de 7 jours à 20 minutes avec cohérence ACID intégrale.',
    content: `
      <h3>Impact Business Exécutif</h3>
      <p>Réduction de 99,8% du temps de traitement de clôture comptable et de paie, transformant un carnet de 7 jours en règlement le jour même.</p>
      <h3>Architecture d'Ingénierie</h3>
      <p>Profilage approfondi des plans d'exécution, optimisation des index couvrants et partitionnement des tables. Parallélisation asynchrone en C# avec garanties strictes d'isolation transactionnelle.</p>
    `,
  },
  {
    slug: 'ambar-gs1-sync',
    badge: 'Standard GS1 · Stock Temps Réel · RabbitMQ',
    company: 'Ambar / Construtech',
    period: '07/2021 - 06/2023',
    stack: 'C#, RabbitMQ, SQL Server, GS1 Architecture, Microservices',
    title: 'Broker de Messagerie Distribuée au Standard GS1 & Transactional Outbox',
    desc: 'Synchronisation en temps réel des stocks et catalogues sur 5 centres logistiques sans aucune perte de commande via le standard GS1.',
    content: `
      <h3>Impact Business Exécutif</h3>
      <p>Synchronisation en temps réel des catalogues et inventaires sur 5 centres de distribution avec zéro perte de commande et latence sous-seconde.</p>
      <h3>Architecture d'Ingénierie</h3>
      <p>Architecture de messagerie d'entreprise au standard GS1 associée au pattern Transactional Outbox soutenu par RabbitMQ et stockage local avec consommation idempotente.</p>
    `,
  },
];
