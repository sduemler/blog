/**
 * The single place posts get filtered and sorted.
 *
 * Everything that lists, links to, or builds a page for a post goes through
 * here. Filtering inline at each call site is how a draft ends up published:
 * miss the filter in `getStaticPaths` and the post is unlisted but still live
 * at its own URL.
 *
 * Drafts render during `npm run dev` so you can preview them, and disappear
 * from production builds.
 *
 * Input is content-collection entries from `getCollection('posts')`, so
 * frontmatter lives on `entry.data` and the filename is `entry.id`.
 */

export const showDrafts = import.meta.env.DEV;

/** Route slug for a post. Falls back to the filename if `slug` is missing. */
export function slugOf(entry) {
	return entry.data?.slug || entry.id;
}

/**
 * Post date, anchored to local noon.
 *
 * A bare `added: 2026-05-31` in frontmatter is a date, not an instant, but YAML
 * resolves it to *UTC* midnight. Formatting that with toLocaleDateString
 * anywhere west of Greenwich renders the previous day, so every post would be
 * dated a day early. Rebuilding at local noon keeps the date the author typed.
 */
export function dateOf(value) {
	const d = value instanceof Date ? value : new Date(String(value ?? ''));
	if (Number.isNaN(d.valueOf())) return d;

	const isMidnightUTC =
		d.getUTCHours() === 0 &&
		d.getUTCMinutes() === 0 &&
		d.getUTCSeconds() === 0 &&
		d.getUTCMilliseconds() === 0;

	return isMidnightUTC
		? new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12)
		: d;
}

/** Sort key: most recently touched first. */
function recency(entry) {
	return dateOf(entry.data.updated || entry.data.added).valueOf();
}

/** Published posts, newest first. */
export default function getPosts(entries) {
	return entries
		.filter((entry) => showDrafts || !entry.data.draft)
		.sort((a, b) => recency(b) - recency(a));
}

/** Every tag in use, across the posts passed in. */
export function getTags(entries) {
	return [...new Set(entries.flatMap((entry) => entry.data.tags ?? []))];
}
