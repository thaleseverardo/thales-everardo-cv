import { LocalizedArticle } from '../../../types';

export const ARTICLES_FR: LocalizedArticle[] = [
  {
    slug: 'database-partitioning-distributed-systems',
    tag: 'Architecture de Données',
    date: '2026-06-20',
    readTime: '6 min de lecture',
    title: 'Partitionnement de Base de Données et Purge sans Verrouillage dans les Systèmes Distribués',
    desc: 'Comment exécuter des purges asynchrones partitionnées sur des tables transactionnelles multi-téraoctets sans escalade de verrouillage ni indisponibilité.',
    content: `
      <h3>1. Le Problème de Saturation des Journaux de 11 To</h3>
      <p>Dans les bases de données relationnelles à haut débit, l'accumulation de millions d'enregistrements historiques engendre une pression sur le buffer pool, une fragmentation des index et un risque de saturation des journaux lors des clôtures fiscales.</p>
      <h3>2. Atténuation de l'Escalade de Verrous (Lock Escalation)</h3>
      <p>Les opérations DELETE conventionnelles posent des verrous exclusifs au niveau table. La solution architecturale met en œuvre des purges asynchrones par lots dynamiques exécutées pendant les heures creuses, contrôlées par télémétrie des tampons en direct.</p>
      <h3>3. Partitionnement par Fenêtre Glissante</h3>
      <p>Le partitionnement isole les données historiques immuables du segment transactionnel actif. La purge s'effectue via une commutation de métadonnées (SWITCH PARTITION), transférant des blocs de plusieurs gigaoctets en quelques millisecondes.</p>
    `,
  },
  {
    slug: 'data-engineering-architecture-scalability',
    tag: 'Ingénierie des Données',
    date: '2026-07-20',
    readTime: '7 min de lecture',
    title: "Architecture d'Ingénierie des Données d'Entreprise : Évolutivité, Fiabilité et Conformité ACID",
    desc: 'Pipelines évolutifs d’ingestion de données, synchronisation par messagerie et cohérence en temps réel entre points de vente et ERP central.',
    content: `
      <h3>1. Ingestion de Données Sous Forte Pression Volumétrique</h3>
      <p>Le traitement de centaines de milliers de transactions quotidiennes nécessite un tampon d'ingestion découplé. L'ingestion directe d'événements bruts dans des tables relationnelles ACID provoque la famine des ressources lors des pics de charge.</p>
      <h3>2. Le Broker de Messagerie au Standard GS1</h3>
      <p>Grâce à un bus de messagerie au standard GS1 reliant les points de vente (POS) et l'ERP d'entreprise, les catalogues de produits et les états de stock restent synchronisés en temps réel sur l'ensemble des centres logistiques.</p>
      <h3>3. Maintien de l'État Global avec Résilience Locale (Offline-First)</h3>
      <p>Le cache local SQLite combiné à des files d'attente d'arrière-plan résilientes garantit un fonctionnement ininterrompu sur le terrain lors des coupures de réseau, avec réconciliation bidirectionnelle sans perte au rétablissement.</p>
    `,
  },
  {
    slug: 'fault-tolerant-distributed-systems',
    tag: 'Systèmes Distribués',
    date: '2026-07-01',
    readTime: '8 min de lecture',
    title: "Conception d'Architectures Distribuées Tolérantes aux Pannes : Pattern Outbox et Clusters Actif-Actif",
    desc: 'Principes d’architecture pour la haute disponibilité : clustering relationnel actif-actif, disjoncteurs et consommation idempotente.',
    content: `
      <h3>1. Définition des Périmètres de Défaillance</h3>
      <p>Dans les infrastructures critiques (telles que les répartiteurs d'appels d'urgence ou les réseaux de caisses), les pannes partielles sont inévitables. La résilience exige une isolation stricte des frontières de panne et un basculement automatisé.</p>
      <h3>2. Clustering Relationnel Actif-Actif</h3>
      <p>La réplication synchrone entre nœuds introduit une latence réseau. L'utilisation de clusters actif-actif avec surveillance automatique de l'état de santé permet une récupération en sous-seconde avec 99,99% de disponibilité.</p>
      <h3>3. Ingestion Idempotente & Disjoncteurs (Circuit Breakers)</h3>
      <p>Chaque consommateur aval doit imposer des clés d'idempotence strictes. Associées à des disjoncteurs, les pannes en cascade sont arrêtées au périmètre avant de corrompre les bases de données centrales.</p>
    `,
  },
  {
    slug: 'reducing-latency-distributed-systems',
    tag: 'Ingénierie de Performance',
    date: '2026-07-10',
    readTime: '5 min de lecture',
    title: "Élimination de 99,8% de la Latence dans les Calculs Financiers et Pipelines d'Événements",
    desc: 'Analyse technique : Réduction du pipeline de calcul de 7 jours à 20 minutes par partitionnement d’index et parallélisation asynchrone en C#.',
    content: `
      <h3>1. Le Goulot d'Étranglement : 7 Jours de Clôture</h3>
      <p>Les traitements de clôture comptable et de paie multi-entités souffrent de goulots d'étranglement combinés : balayages de tables entières non indexées, curseurs imbriqués et traitements procéduraux séquentiels.</p>
      <h3>2. Profilage Approfondi des Plans d'Exécution</h3>
      <p>L'élimination des latences passe par l'inspection des plans d'exécution au niveau CPU et I/O. Les actions majeures incluent le remplacement des key lookups par des index clusters couvrants et la refactorisation de sous-requêtes scalaires.</p>
      <h3>3. Pipeline Parallèle Asynchrone Multithread</h3>
      <p>En restructurant les traitements séquentiels en un pipeline parallèle en C# .NET Core, les lots transactionnels s'exécutent simultanément sur des blocs de mémoire partitionnés, ramenant le temps de calcul de 7 jours à 20 minutes (-99,8%).</p>
    `,
  },
  {
    slug: 'system-architecture-principles',
    tag: 'Architecture & Design',
    date: '2026-06-15',
    readTime: '6 min de lecture',
    title: 'Architecture Système : Principes et Décisions Pratiques dans les Environnements à Haut Débit',
    desc: 'Principes de conception, découpage des domaines et arbitrages pragmatiques dans les architectures distribuées de mission critique.',
    content: `
      <h3>1. Introduction & Axiomes Fondamentaux</h3>
      <p>Concevoir des architectures d'entreprise capables d'absorber des volumes transactionnels massifs sans dégradation de service impose de dépasser les recettes purement théoriques. Les décisions d'architecture sont des compromis constants entre cohérence, latence et maintenabilité.</p>
      <h3>2. L'Illusion de l'Homogénéité Distribuée</h3>
      <p>Les architectures microservices fragmentent souvent inutilement les domaines. Le découplage doit être assuré au niveau des bases de données — pas uniquement via des API HTTP. Les bases partagées engendrent des monolithes distribués et des verrous bloquants.</p>
      <h3>3. Découplage Événementiel et Pattern Transactional Outbox</h3>
      <p>Avec une Architecture Orientée Événements (EDA) appuyée sur des bus de messages (Kafka, RabbitMQ), producteurs et consommateurs opèrent de manière asynchrone. Le pattern Transactional Outbox garantit l'atomicité sans verrouillage distribué 2PC.</p>
    `,
  },
];
