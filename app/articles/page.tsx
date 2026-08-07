import type { Metadata } from "next";
import { asText } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { buildMetadata } from "@/lib/seo";
import { ARTICLE_FETCH_LINKS } from "@/lib/prismic";
import { Container } from "@/components/Container";
import { EditorialHeader } from "@/components/EditorialHeader";
import { ArticleIndexBrowser } from "@/components/ArticleIndexBrowser";
import type { ArticleAvatars } from "@/components/ArticleIndexCard";

/**
 * The `articles_index` singleton owns `/articles`; the repeatable `article` type
 * owns `/articles/:uid` next door in `[uid]`.
 *
 * Read optionally for the same reason as `/experiments`: a missing or
 * unpublished index document costs the header, not the route.
 */
async function getIndex() {
	const client = createClient();
	return client.getSingle("articles_index").catch(() => null);
}

export default async function Page() {
	const client = createClient();

	/**
	 * `ARTICLE_FETCH_LINKS` resolves the categories, authors and stack names onto
	 * each article, which is what a card renders and what the category column
	 * filters on. The whole set is loaded; switching category happens on the
	 * client.
	 *
	 * The categories are read as documents rather than collected off the articles:
	 * this page is a directory of the site's categories, so one that has nothing
	 * filed under it yet is still a box — it just opens on the empty state.
	 *
	 * The authors come along for their avatars only. An author's *name* already
	 * arrives with the article; the avatar is wanted on this page alone, so it is
	 * fetched here instead of being added to a link resolution every listing on
	 * the site would pay for.
	 */
	const [index, articles, categories, authors] = await Promise.all([
		getIndex(),
		client.getAllByType("article", { fetchLinks: ARTICLE_FETCH_LINKS }),
		client.getAllByType("category"),
		client.getAllByType("author"),
	]);

	/**
	 * Sorted here rather than through `orderings`, for the same reason
	 * `/categories` does it: `name` is Rich Text, and Prismic only exposes
	 * `my.category.name` as an ordering path once a published document fills it.
	 * An unnamed category is dropped rather than rendered as a blank box.
	 */
	const categoryOptions = categories
		.map((category) => ({ id: category.id, name: asText(category.data.name) }))
		.filter((category) => category.name !== "")
		.sort((a, b) => a.name.localeCompare(b.name));

	const avatars: ArticleAvatars = Object.fromEntries(
		authors.map((author) => [author.id, author.data.avatar]),
	);

	/** Full-bleed header beside the content Container, as on `/experiments`. */
	return (
		<>
			<EditorialHeader
				title={index?.data.title}
				description={index?.data.description}
				featuredImage={index?.data.featured_image}
			/>

			<Container size="full" className="py-16">
				<ArticleIndexBrowser
					articles={articles}
					categories={categoryOptions}
					avatars={avatars}
				/>
			</Container>
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	const index = await getIndex();

	return buildMetadata({
		meta_title: index?.data.meta_title,
		meta_description: index?.data.meta_description,
		meta_image: index?.data.meta_image,
		fallbackTitle: index?.data.title,
		fallbackImage: index?.data.featured_image,
	});
}
