import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../config";
import getPosts, { dateOf, slugOf } from "../scripts/getPosts";

export async function GET(context) {
	const posts = getPosts(await getCollection("posts"));

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			link: `/post/${slugOf(post)}/`,
			title: post.data.title,
			pubDate: dateOf(post.data.added),
			description: post.data.description,
			// The content layer keeps the compiled HTML on the entry.
			content: post.rendered?.html,
			customData: post.data.updated
				? `<updated>${dateOf(post.data.updated).toISOString()}</updated>`
				: "",
		})),
	});
}
