<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #09090b 0%, #18181b 100%);
            color: #e4e4e7;
            padding: 2rem;
            min-height: 100vh;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #0ea5e9;
            font-weight: 700;
          }
          .subtitle {
            color: #a1a1aa;
            margin-bottom: 2rem;
            font-size: 1rem;
          }
          .sitemap-entries {
            display: grid;
            gap: 1rem;
          }
          .entry {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.5rem;
            padding: 1.5rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }
          .entry:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(14, 165, 233, 0.5);
            transform: translateY(-2px);
          }
          .url {
            font-size: 0.95rem;
            word-break: break-all;
            margin-bottom: 0.75rem;
          }
          .url a {
            color: #0ea5e9;
            text-decoration: none;
            transition: color 0.2s;
          }
          .url a:hover {
            color: #06b6d4;
            text-decoration: underline;
          }
          .metadata {
            display: flex;
            gap: 2rem;
            flex-wrap: wrap;
            font-size: 0.875rem;
            color: #a1a1aa;
          }
          .metadata-item {
            display: flex;
            gap: 0.5rem;
          }
          .label {
            font-weight: 600;
            color: #e4e4e7;
          }
          .footer {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: #71717a;
            font-size: 0.875rem;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Sitemap</h1>
          <p class="subtitle">URLs da - Thales Everardo // Systems Architect</p>
          <div class="sitemap-entries">
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <div class="entry">
                <div class="url">
                  <a>
                    <xsl:attribute name="href">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:attribute>
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </div>
                <div class="metadata">
                  <xsl:if test="sitemap:lastmod">
                    <div class="metadata-item">
                      <span class="label">Última atualização:</span>
                      <span>
                        <xsl:value-of select="sitemap:lastmod"/>
                      </span>
                    </div>
                  </xsl:if>
                  <xsl:if test="sitemap:changefreq">
                    <div class="metadata-item">
                      <span class="label">Frequência:</span>
                      <span>
                        <xsl:value-of select="sitemap:changefreq"/>
                      </span>
                    </div>
                  </xsl:if>
                  <xsl:if test="sitemap:priority">
                    <div class="metadata-item">
                      <span class="label">Prioridade:</span>
                      <span>
                        <xsl:value-of select="sitemap:priority"/>
                      </span>
                    </div>
                  </xsl:if>
                </div>
              </div>
            </xsl:for-each>
          </div>
          <div class="footer">
            <p>Total de URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></p>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
