# sam's writings

Personal blog built with [Astro](https://astro.build) and [Keystatic](https://keystatic.com), deployed on Netlify.

## Dev

```bash
npm install
npm run dev        # site at localhost:4321, editor at localhost:4321/keystatic
npm run build      # builds to ./dist/
npm run preview    # preview production build locally
```

No environment variables or API keys are needed.

## Writing

Posts are Markdown files in `src/posts/`. Edit them in the Keystatic UI at
`/keystatic`, or open the `.md` files directly — they're the same files either
way. Site metadata is in `src/config.js`.

Keystatic runs in **local storage mode**: it reads and writes files on this
machine and commits nothing. Publishing is still `git push`, and Netlify builds
from the repo. The editor is only loaded during `npm run dev`; it is not part of
the production build.

### Drafts

Tick **Draft** on a post (or set `draft: true` in frontmatter) and it is left
out of the site entirely — no page, no listing, no RSS entry, no sitemap entry.
Drafts still render under `npm run dev`, with a banner, so you can preview them.

New posts start as drafts. Untick the box when you're ready to publish. Drafts
are ordinary files, so they do get committed and pushed — they're just inert on
the live site.

All of this is enforced in one place, `src/scripts/getPosts.js`. Anything that
lists or builds a page for a post goes through it — including `getStaticPaths`
in `src/pages/post/[slug].astro`, which is what stops a draft being reachable at
its own URL.

### Embedding Spotify and YouTube

Put the URL on its own line, with blank lines around it:

```markdown
Been listening to this on repeat:

https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
```

It becomes an iframe at build time. Spotify tracks, albums, playlists, artists,
shows and episodes work, as do YouTube links (`watch`, `youtu.be`, `shorts`,
with an optional `?t=` timestamp).

An ordinary inline link like `[this playlist](https://open.spotify.com/...)` is
left alone — only a bare URL sitting by itself is converted.

This is deliberately driven by a plain URL rather than pasted `<iframe>` HTML:
rich-text editors escape raw HTML on save, so an iframe written by hand would be
rendered as visible text. See `src/plugins/remark-embeds.mjs`; add a host there
to support more services.

## How content is wired up

Posts are an Astro **content collection**, defined in `src/content.config.ts`.
The files stay in `src/posts/` rather than moving to `src/content/posts/` — the
glob loader can read from anywhere, and keeping the path means
`keystatic.config.ts` needs no special casing.

Frontmatter is validated by the Zod schema in `src/content.config.ts`. A typo'd
field or a missing date now fails the build instead of shipping quietly. Posts
no longer carry a `layout:` key; `src/pages/post/[slug].astro` imports the
layout directly.

### Markdown pipeline

Astro 7 uses **Sätteri** as its default Markdown processor, which does not run
remark plugins. Because `src/plugins/remark-embeds.mjs` is a remark plugin, this
project opts back into the unified pipeline in `astro.config.mjs`:

```js
import { unified } from '@astrojs/markdown-remark';

markdown: {
  processor: unified({ remarkPlugins: [remarkEmbeds], shikiConfig: { ... } }),
}
```

`@astrojs/markdown-remark` is no longer bundled with Astro, so it's an explicit
dependency. If the embeds ever stop working after an upgrade, check this first.

### Dates

`added` and `updated` are plain `YYYY-MM-DD`. They're formatted through
`dateOf()` in `src/scripts/getPosts.js`, which anchors them to local noon — a
date-only value otherwise resolves to UTC midnight and renders a day early in
any timezone west of Greenwich.

## Editing from another machine or phone

Local mode only works on a checkout of this repo. To edit from anywhere, switch
`keystatic.config.ts` to GitHub mode:

```ts
storage: { kind: 'github', repo: 'sduemler/<repo>' }
```

That additionally needs a GitHub App (Keystatic will walk you through creating
one), its credentials in `.env`, and the `/keystatic` route deployed — which
means loading the integration in production and adding the Netlify adapter in
`astro.config.mjs`, where it is currently dev-only.

## Credits

Based on the [blahg template](https://github.com/cassidoo/blahg) by [cassidoo](https://github.com/cassidoo).
