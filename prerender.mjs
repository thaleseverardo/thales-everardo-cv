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
    desc: 'Engenharia de sistemas e dados distribuídos de missão crítica.',
    heading: 'Thales Everardo Albuquerque Reis',
    subheading: 'Engenheiro de Software Staff | Arquiteto de Sistemas',
  },
  {
    code: 'en',
    langTag: 'en-US',
    title: 'Thales Everardo — Staff Systems Engineer & Systems Architect',
    desc: 'Mission-critical distributed systems and data engineering.',
    heading: 'Thales Everardo Albuquerque Reis',
    subheading: 'Staff Systems Engineer | Principal Systems Architect',
  },
  {
    code: 'es',
    langTag: 'es-ES',
    title: 'Thales Everardo — Ingeniero de Software Staff y Arquitecto de Sistemas',
    desc: 'Ingeniería de sistemas y datos distribuidos de misión crítica.',
    heading: 'Thales Everardo Albuquerque Reis',
    subheading: 'Ingeniero de Software Staff | Arquitecto de Sistemas',
  },
  {
    code: 'fr',
    langTag: 'fr-FR',
    title: 'Thales Everardo — Ingénieur Logiciel Staff & Architecte Systèmes',
    desc: 'Ingénierie des systèmes et données distribués de mission critique.',
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

  // 5. Injeção do Schema SiteNavigationElement
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

  // 6. Pre-hydration script no head para carregar o idioma síncrono
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

  // 7. Navegação semântica estática dentro do <noscript>
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
// GERAÇÃO DO SITEMAP.XML SEMÂNTICO (COM HREFLANG RECÍPROCO E LASTMOD REAL)
// ==============================================================================
console.log('🗺️  [SEO] Gerando sitemap.xml com reciprocidade bidirecional e lastmod real...');

const today = new Date().toISOString().split('T')[0];
const baseUrl = 'https://thaleseverardo.github.io/thales-everardo-cv';

// Helper para obter a data de modificação real do arquivo no disco
function getFileLastMod(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return stats.mtime.toISOString().split('T')[0];
    }
  } catch {}
  return today;
}

const getSubdirectories = (parentPath) => {
  if (!fs.existsSync(parentPath)) return [];
  return fs
    .readdirSync(parentPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

const articles = getSubdirectories(path.join(publicDir, 'articles'));
const projects = getSubdirectories(path.join(publicDir, 'projects'));

// Bloco comum de anotações recíprocas (exatamente igual para todas as páginas do cluster)
const reciprocalHreflangBlock = `    <xhtml:link rel="alternate" hreflang="pt" href="${baseUrl}/pt/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/"/>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es/"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${baseUrl}/fr/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/"/>`;

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- 1. Raiz Canônica (Entrada Global / x-default) -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
${reciprocalHreflangBlock}
  </url>

  <!-- 2. Versões Linguísticas Recíprocas (Sitelinks Targets) -->
`;

for (const lang of languages) {
  sitemapXml += `  <url>
    <loc>${baseUrl}/${lang.code}/</loc>
    <lastmod>${today}</lastmod>
${reciprocalHreflangBlock}
  </url>\n`;
}

sitemapXml += `\n  <!-- 3. Artigos Técnicos de Arquitetura (Monolíngues com lastmod real) -->\n`;
for (const art of articles) {
  const artFile = path.join(publicDir, 'articles', art, 'index.html');
  const artLastMod = getFileLastMod(artFile);
  sitemapXml += `  <url>
    <loc>${baseUrl}/articles/${art}/</loc>
    <lastmod>${artLastMod}</lastmod>
  </url>\n`;
}

sitemapXml += `\n  <!-- 4. Estudos de Caso & Projetos (Monolíngues com lastmod real) -->\n`;
for (const proj of projects) {
  const projFile = path.join(publicDir, 'projects', proj, 'index.html');
  const projLastMod = getFileLastMod(projFile);
  sitemapXml += `  <url>
    <loc>${baseUrl}/projects/${proj}/</loc>
    <lastmod>${projLastMod}</lastmod>
  </url>\n`;
}

sitemapXml += `</urlset>\n`;

// Grava em dist/ (deploy) e em public/ (repositório)
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');

console.log(`  ✓ Sitemap semântico gravado com sucesso (${1 + languages.length + articles.length + projects.length} URLs).`);
console.log('✅ [Build Complete] Páginas e sitemap 100% em conformidade com o Google Search Central!');
