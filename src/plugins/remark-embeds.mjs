/**
 * remark-embeds
 *
 * Turns a bare URL sitting alone on its own line into an embedded iframe.
 *
 *   Been listening to this on repeat:
 *
 *   https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
 *
 * Only a paragraph whose entire content is one link is converted, so normal
 * inline links like [this one](https://...) are left alone.
 *
 * The point of matching on a bare URL rather than raw <iframe> HTML: a URL is
 * plain text, so no CMS rich-text editor can mangle it on save. Raw HTML gets
 * escaped by Tina, Keystatic, and every other editor that parses the body into
 * a structured tree.
 */

const YOUTUBE_HOSTS = new Set([
	'youtube.com',
	'www.youtube.com',
	'm.youtube.com',
	'youtu.be',
	'www.youtu.be',
]);

const SPOTIFY_HOSTS = new Set(['open.spotify.com']);

// Spotify renders each resource type at a different natural height.
const SPOTIFY_HEIGHTS = {
	track: 152,
	episode: 232,
	album: 352,
	playlist: 352,
	artist: 352,
	show: 352,
};

function attr(value) {
	return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function spotifyEmbed(url) {
	// /track/ID, /album/ID, /playlist/ID... optionally prefixed with a locale
	// segment such as /intl-de/track/ID.
	const parts = url.pathname.split('/').filter(Boolean);
	const start = parts[0]?.startsWith('intl-') ? 1 : 0;
	const type = parts[start];
	const id = parts[start + 1];

	if (!id || !(type in SPOTIFY_HEIGHTS)) return null;

	const height = SPOTIFY_HEIGHTS[type];
	const src = `https://open.spotify.com/embed/${type}/${encodeURIComponent(id)}`;

	return (
		`<div class="embed embed-spotify">` +
		`<iframe src="${attr(src)}" width="100%" height="${height}" ` +
		`style="border-radius:12px" frameborder="0" loading="lazy" ` +
		`allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" ` +
		`title="Spotify embed"></iframe>` +
		`</div>`
	);
}

function youtubeEmbed(url) {
	let id;
	if (url.hostname.endsWith('youtu.be')) {
		id = url.pathname.split('/').filter(Boolean)[0];
	} else if (url.pathname === '/watch') {
		id = url.searchParams.get('v');
	} else if (url.pathname.startsWith('/shorts/') || url.pathname.startsWith('/embed/')) {
		id = url.pathname.split('/').filter(Boolean)[1];
	}

	if (!id) return null;

	const start = url.searchParams.get('t') || url.searchParams.get('start');
	const seconds = start ? parseInt(start, 10) : NaN;
	const src =
		`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` +
		(Number.isFinite(seconds) && seconds > 0 ? `?start=${seconds}` : '');

	return (
		`<div class="embed embed-youtube">` +
		`<iframe src="${attr(src)}" frameborder="0" loading="lazy" ` +
		`allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ` +
		`allowfullscreen title="YouTube embed"></iframe>` +
		`</div>`
	);
}

function embedFor(rawUrl) {
	let url;
	try {
		url = new URL(rawUrl);
	} catch {
		return null;
	}

	if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
	if (SPOTIFY_HOSTS.has(url.hostname)) return spotifyEmbed(url);
	if (YOUTUBE_HOSTS.has(url.hostname)) return youtubeEmbed(url);
	return null;
}

/**
 * Pull the URL out of a paragraph that contains nothing but that URL.
 * Handles both shapes markdown can produce:
 *   - a `link` node (remark-gfm autolinks bare URLs)
 *   - a plain `text` node (when autolinking is off)
 */
function loneUrl(paragraph) {
	const children = (paragraph.children || []).filter(
		(child) => !(child.type === 'text' && child.value.trim() === '')
	);

	if (children.length !== 1) return null;
	const [only] = children;

	if (only.type === 'link') {
		const label = only.children?.length === 1 && only.children[0].type === 'text'
			? only.children[0].value.trim()
			: '';
		// Only autolinks, i.e. where the visible text is the URL itself.
		// [listen to this](https://open.spotify.com/...) stays a normal link.
		if (label && label !== only.url) return null;
		return only.url;
	}

	if (only.type === 'text') {
		const value = only.value.trim();
		return /^https?:\/\/\S+$/.test(value) ? value : null;
	}

	return null;
}

export default function remarkEmbeds() {
	return (tree) => {
		const visit = (node) => {
			if (!node.children) return;

			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];

				if (child.type === 'paragraph') {
					const url = loneUrl(child);
					const html = url && embedFor(url);
					if (html) {
						node.children[i] = { type: 'html', value: html };
						continue;
					}
				}

				visit(child);
			}
		};

		visit(tree);
	};
}
