import { config, collection, fields } from '@keystatic/core';

/**
 * Keystatic reads and writes the markdown files in src/posts/ directly.
 *
 * Every frontmatter key the site depends on has to appear in this schema.
 * Keystatic rewrites the whole frontmatter block on save, so a key that is
 * missing here gets silently dropped from the file.
 *
 * Storage is `local`: the editor at /keystatic edits files on disk and commits
 * nothing. Publishing is still `git push`. See README for switching to GitHub
 * mode, which needs a GitHub App and a deployed adapter.
 */
export default config({
	storage: { kind: 'local' },

	ui: {
		brand: { name: "sam's writings" },
	},

	collections: {
		posts: collection({
			label: 'Posts',
			path: 'src/posts/*',
			// The filename (minus .md) is the entry slug. Existing files already
			// match their `slug` frontmatter, so nothing gets renamed.
			slugField: 'title',
			format: { contentField: 'content' },
			entryLayout: 'content',
			columns: ['title', 'added', 'draft'],

			schema: {
				title: fields.slug({
					name: {
						label: 'Title',
						validation: { isRequired: true },
					},
					slug: {
						label: 'Filename',
						description:
							'Sets the .md filename. Keep it matching the Slug field below.',
					},
				}),

				slug: fields.text({
					label: 'Slug (URL)',
					description: 'The post lives at /post/<slug>/. Lowercase, hyphenated.',
					validation: { isRequired: true },
				}),

				description: fields.text({
					label: 'Description',
					description: 'Shown under the title in listings, and in RSS.',
					validation: { isRequired: true },
				}),

				draft: fields.checkbox({
					label: 'Draft',
					description:
						'Drafts are hidden from the site, RSS and sitemap, and no page is built for them. They still show up when running locally.',
					defaultValue: true,
				}),

				tags: fields.multiselect({
					label: 'Tags',
					options: [
						{ label: 'Advice', value: 'advice' },
						{ label: 'Events', value: 'events' },
						{ label: 'Gaming', value: 'gaming' },
						{ label: 'Health', value: 'health' },
						{ label: 'Learning', value: 'learning' },
						{ label: 'Meta', value: 'meta' },
						{ label: 'Music', value: 'music' },
						{ label: 'Musings', value: 'musings' },
						{ label: 'Personal', value: 'personal' },
						{ label: 'Technical', value: 'technical' },
						{ label: 'Work', value: 'work' },
						{ label: 'Writing', value: 'writing' },
					],
				}),

				added: fields.date({
					label: 'Added',
					validation: { isRequired: true },
				}),

				updated: fields.date({
					label: 'Updated',
					description: 'Only set this if you meaningfully revise the post.',
				}),

				content: fields.markdoc({
					label: 'Body',
					extension: 'md',
					options: {
						image: {
							directory: 'public/assets',
							publicPath: '/assets/',
						},
					},
				}),
			},
		}),
	},
});
