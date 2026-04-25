# sam's writings

Personal blog built with [Astro](https://astro.build) and [TinaCMS](https://tina.io), deployed on Netlify.

## Dev

```bash
npm install
npm run dev        # starts dev server + TinaCMS at localhost:4321
npm run build      # builds to ./dist/
npm run preview    # preview production build locally
```

CMS editor: `localhost:4321/admin/index.html`

Requires a `.env.development` file:

```
TINACLIENTID=<from tina.io>
TINATOKEN=<from tina.io>
TINASEARCH=<from tina.io>
```

## Credits

Based on the [blahg template](https://github.com/cassidoo/blahg) by [cassidoo](https://github.com/cassidoo).

## Content

Posts live in `src/posts/` as Markdown files. Site metadata is in `src/config.js`.
