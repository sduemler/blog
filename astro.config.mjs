import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import remarkEmbeds from './src/plugins/remark-embeds.mjs';

// Keystatic runs in `local` storage mode, so its editor reads and writes files
// on this machine. It is only loaded for `astro dev`:
//   - it registers a server route that a static build cannot serve
//   - it would ship a multi-megabyte admin bundle to production for no reason
// React is here only because Keystatic's UI needs it; the site itself uses none.
const isDev = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  site: 'https://chocobosam.com/',
  base: '/',
  integrations: [sitemap(), icon(), ...(isDev ? [react(), keystatic()] : [])],
  markdown: {
    // Astro 7 defaults to the Satteri markdown pipeline, which does not run
    // remark plugins. `src/plugins/remark-embeds.mjs` is a remark plugin, so we
    // opt back into the unified pipeline via @astrojs/markdown-remark.
    processor: unified({
      remarkPlugins: [remarkEmbeds],
      shikiConfig: {
        theme: 'material-theme-darker',
        langs: [],
      },
    }),
  },
});
