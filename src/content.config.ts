import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Posts stay in src/posts/ rather than moving to src/content/posts/.
 * The glob loader can read from anywhere, and keeping the path means
 * keystatic.config.ts and every existing file location are unchanged.
 *
 * Each entry's `id` is its filename without the extension (e.g. "klack").
 */
const posts = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/posts' }),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		description: z.string(),
		// Absent on older posts written before drafts existed, so default it.
		draft: z.boolean().default(false),
		tags: z.array(z.string()).default([]),
		added: z.coerce.date(),
		updated: z.coerce.date().optional(),
	}),
});

export const collections = { posts };
