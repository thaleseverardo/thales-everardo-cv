import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const publicDir = path.resolve('public');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('❌ Erro: dist/index.html não encontrado. Execute o build do Vite primeiro.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf-8');

const languages = [
  {
    code: 'pt',
    langTag: 'pt-BR',
    title: 'Thales Everardo — Engenheiro de Software Staff & Arquiteto de Sistemas',
    desc: 'Dossiê executivo e portfólio oficial de Thales Everardo Albuquerque Reis. Sistemas distribuídos, engenharia de dados e arquiteturas de missão crítica.',
    heading: 'Thales Everardo Albuquerque Reis',
    subheading: 'Engenheiro de Software Staff | Arquiteto de Sistemas',
  },
  {
    code: 'en',
    langTag: 'en-US',
    title: 'Thales Everardo — Staff Systems Engineer & Systems Architect',
    desc: 'Official engineering portfolio and resume of Thales Everardo Albuquerque Reis. Distributed systems, latency optimization, and mission-critical architectures.',
    heading: 'Thales Everardo Albuquerque Reis',
    subheading: 'Staff Systems Engineer | Principal Systems Architect',
  },
  {
    code: 'es',
    langTag: 'es-ES',
    title: 'Thales Everardo — Ingeniero de Software Staff y Arquitecto de Sistemas',
    desc: 'Perfil profesional y portafolio oficial de Thales Everardo Albuquerque Reis. Sistemas distribuidos, ingeniería de datos y alta disponibilidad.',
    heading: 'Thales Everardo Albuquerque Reis',
    subheading: 'Ingeniero de Software Staff | Arquitecto de Sistemas',
  },
  {
    code: 'fr',
    langTag: 'fr-FR',
    title: 'Thales Everardo — Ingénieur Logiciel Staff & Architecte Systèmes',
    desc: 'Dossier d’ingénierie et portfolio de Thales Everardo Albuquerque Reis. Systèmes distribués, optimisation de latence et architectures critiques.',
    heading: 'Thales Everardo Albuquerque Reis',
    subheading: 'Ingénieur Logiciel Staff | Architecte Systèmes',
  },
];

console.log('⚡ [SSG] Gerando páginas estáticas otimizadas para Sitelinks do Google...');

for (const lang of languages) {
  const targetDir = path.join(distDir, lang.code);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let localizedHtml = templateHtml;

  // 1. Ajuste do atributo <html lang="...">
  localizedHtml = localizedHtml.replace(/<html[^>]*>/, `<html lang="${lang.langTag}">`);

  // 2. Substituição do <title>
  localizedHtml = localizedHtml.replace(/<title>.*?<\/title>/, `<title>${lang.title}</title>`);

  // 3. Substituição da <meta name="description">
  localizedHtml = localizedHtml.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${lang.desc}" />`
  );

  // 4. Injeção de Canonical exclusiva da rota física
  const canonicalUrl = `https://thaleseverardo.github.io/thales-everardo-cv/${lang.code}/`;
  localizedHtml = localizedHtml.replace(
    /<link rel="canonical" href=".*?" \/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // 5. Injeção do Schema SiteNavigationElement para gatilho dos Sitelinks no Google
  const navigationSchema = `
    <!-- Google Sitelinks Navigation Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "name": "${lang.title}",
      "description": "${lang.desc}",
      "url": "${canonicalUrl}"
    }
    </script>
  `;
  localizedHtml = localizedHtml.replace('</head>', `${navigationSchema}\n</head>`);

  // 6. Pre-hydration script no head para carregar a SPA com idioma síncrono no frame zero
  const bootstrapScript = `
    <script>
      (function() {
        try {
          var raw = localStorage.getItem('thales-everardo-cv');
          var data = raw ? JSON.parse(raw) : {};
          data.language = '${lang.code.toUpperCase()}';
          localStorage.setItem('thales-everardo-cv', JSON.stringify(data));
          document.documentElement.lang = '${lang.langTag}';
        } catch(e) {}
      })();
    </script>
  `;
  localizedHtml = localizedHtml.replace('</head>', `${bootstrapScript}\n</head>`);

  // 7. Navegação semântica estática pura dentro do <noscript>
  const semanticNav = `
      <nav aria-label="Navegação de Idiomas / Sitelinks" style="margin: 1.5rem 0; padding: 1rem; border: 1px solid #27272a; border-radius: 8px;">
        <p style="margin: 0 0 0.5rem 0; font-weight: bold; font-size: 0.9rem;">Versões por Idioma / Language Navigation:</p>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 1rem;">
          <li><a href="https://thaleseverardo.github.io/thales-everardo-cv/pt/">Português (PT)</a></li>
          <li><a href="https://thaleseverardo.github.io/thales-everardo-cv/en/">English (EN)</a></li>
          <li><a href="https://thaleseverardo.github.io/thales-everardo-cv/es/">Español (ES)</a></li>
          <li><a href="https://thaleseverardo.github.io/thales-everardo-cv/fr/">Français (FR)</a></li>
          <li><a href="https://thaleseverardo.github.io/thales-everardo-cv/projects/magalu-11tb-purge/">Projetos</a></li>
          <li><a href="https://thaleseverardo.github.io/thales-everardo-cv/articles/database-partitioning-distributed-systems/">Artigos</a></li>
        </ul>
      </nav>
  `;
  localizedHtml = localizedHtml.replace('<noscript>', `<noscript>\n${semanticNav}`);

  fs.writeFileSync(path.join(targetDir, 'index.html'), localizedHtml, 'utf-8');
  console.log(`  ✓ Gerado: dist/${lang.code}/index.html (Status HTTP 200 OK)`);
}

// ==============================================================================
// GERAÇÃO AUTOMÁTICA E DINÂMICA DO SITEMAP.XML NO BUILD TIME
// ==============================================================================
console.log('🗺️  [SEO] Gerando sitemap.xml dinâmico atualizado...');

const today = new Date().toISOString().split('T')[0];
const baseUrl = 'https://thaleseverardo.github.io/thales-everardo-cv';

// Varredura automática de artigos e projetos presentes em public/
const getSubdirectories = (parentPath) => {
  if (!fs.existsSync(parentPath)) return [];
  return fs
    .readdirSync(parentPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

const articles = getSubdirectories(path.join(publicDir, 'articles'));
const projects = getSubdirectories(path.join(publicDir, 'projects'));

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Raiz Canônica com Alternates de Idioma -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/pt/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/"/>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es/"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${baseUrl}/fr/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/"/>
  </url>

  <!-- Páginas Estáticas Dedicadas de Idioma (Sitelinks Targets) -->
`;

for (const lang of languages) {
  sitemapXml += `  <url>
    <loc>${baseUrl}/${lang.code}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>\n`;
}

sitemapXml += `\n  <!-- Artigos Técnicos de Arquitetura -->\n`;
for (const art of articles) {
  sitemapXml += `  <url>
    <loc>${baseUrl}/articles/${art}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.88</priority>
  </url>\n`;
}

sitemapXml += `\n  <!-- Estudos de Caso & Projetos em Produção -->\n`;
for (const proj of projects) {
  sitemapXml += `  <url>
    <loc>${baseUrl}/projects/${proj}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.88</priority>
  </url>\n`;
}

sitemapXml += `\n</urlset>\n`;

// Grava tanto em dist/ (para o deploy final) quanto em public/ (para manter o repositório sincronizado)
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');

console.log(`  ✓ Sitemap gravado com data de hoje (${today}) e ${1 + languages.length + articles.length + projects.length} rotas ativas.`);
console.log('✅ [Build Complete] Todas as páginas e sitemap sincronizados com sucesso!');
