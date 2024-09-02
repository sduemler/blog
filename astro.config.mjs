import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  site: 'https://chocobosam.com/',
  base: '/',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'material-theme-darker',
      langs: [],
    },
  },
  output: "server",
	server: {
		headers: {
			"Access-Control-Allow-Origin": "*"
		}
	},
	adapter: netlify()
});
