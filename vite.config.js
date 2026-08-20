import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const DEFAULT_SITE_URL = 'https://www.tilnogzphotography.com.lk'

/**
 * Emit robots.txt and sitemap.xml with the real site URL baked in.
 * Files in public/ are copied verbatim, so Vite's %VITE_*% substitution
 * never reaches them - they have to be generated here instead.
 */
function seoFiles(siteUrl) {
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)

      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: [
          'User-agent: *',
          'Allow: /',
          '',
          '# Admin panel is a client-side overlay, not a crawlable page',
          'Disallow: /#admin',
          '',
          `Sitemap: ${siteUrl}/sitemap.xml`,
          '',
        ].join('\n'),
      })

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${siteUrl}/photos/hero.png</image:loc>
      <image:title>Tilnogz Photography - Colombo, Sri Lanka</image:title>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/photos/tharindu-portrait.png</image:loc>
      <image:title>Tharindu Lakshan, photographer</image:title>
    </image:image>
  </url>
</urlset>
`,
      })
    },
  }
}

function htmlEnvPlugin(siteUrl) {
  return {
    name: 'html-env-plugin',
    transformIndexHtml(html) {
      return html.replace(/%VITE_SITE_URL%/g, siteUrl)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')
  process.env.VITE_SITE_URL = siteUrl

  return {
    plugins: [react(), htmlEnvPlugin(siteUrl), seoFiles(siteUrl)],
    // Makes %VITE_SITE_URL% resolve inside index.html
    define: {},
    server: {
      port: 5173,
      host: true,
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'motion-vendor': ['framer-motion'],
            'icons-vendor': ['lucide-react'],
            'supabase-vendor': ['@supabase/supabase-js'],
          },
        },
      },
    },
  }
})
