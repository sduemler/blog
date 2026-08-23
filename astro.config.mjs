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

/**
 * Prints the Keystatic editor URL alongside Astro's own startup output, so the
 * address is one click away instead of something you have to remember and type.
 * Dev-only, same as the Keystatic integration itself.
 */
function keystaticBanner() {
  return {
    name: 'keystatic-banner',
    hooks: {
      'astro:server:start': ({ address, logger }) => {
        const host = address.family === 'IPv6' ? `[${address.address}]` : address.address;
        const shown = host === '0.0.0.0' || host === '[::]' ? 'localhost' : host;
        // Deferred so the line lands under Astro's own "Local" banner rather
        // than above it, where it would look like output from a previous run.
        setTimeout(() => {
          logger.info(`Keystatic editor  http://${shown}:${address.port}/keystatic`);
        }, 0);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://chocobosam.com/',
  base: '/',
  integrations: [
    sitemap(),
    icon(),
    ...(isDev ? [react(), keystatic(), keystaticBanner()] : []),
  ],
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
