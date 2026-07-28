import type { Metadata } from "next";
import { asText } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { buildMetadata } from "@/lib/seo";
import { ARTICLE_FETCH_LINKS } from "@/lib/prismic";
import { EditorialHeader } from "@/components/EditorialHeader";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import type { Article } from "@/lib/articles";

/**
 * The `categories_index` singleton owns `/categories`; the repeatable `category`
 * type owns `/categories/:uid` next door in `[uid]`.
 *
 * Read optionally so a missing or unpublished index document costs the header
 * rather than the whole route.
 */
async function getIndex() {
	const client = createClient();
	return client.getSingle("categories_index").catch(() => null);
}

export default async function Page() {
	const client = createClient();

	/**
	 * The detail pane matches articles to the selected category on the client, so
	 * both article types are loaded whole and up front with their categories
	 * resolved. Nothing here filters on a `my.<type>.…` path, so there is no
	 * unqueryable-path risk to work around.
	 */
	const [index, categories, experiments, fixes] = await Promise.all([
		getIndex(),
		client.getAllByType("category"),
		client.getAllByType("experiment", { fetchLinks: ARTICLE_FETCH_LINKS }),
		client.getAllByType("fix", { fetchLinks: ARTICLE_FETCH_LINKS }),
	]);

	/**
	 * Sorted here rather than through `orderings`: `name` is Rich Text, and
	 * Prismic only exposes a `my.category.name` ordering path once a published
	 * document fills it. Comparing the rendered text avoids that trap entirely.
	 */
	const sortedCategories = [...categories].sort((a, b) =>
		asText(a.data.name).localeCompare(asText(b.data.name)),
	);

	const articles: Article[] = [...experiments, ...fixes];

	return (
		<div className="mx-auto w-full max-w-5xl px-6 py-16">
			<EditorialHeader
				title={index?.data.title}
				description={index?.data.description}
				featuredImage={index?.data.featured_image}
			/>

			<CategoryBrowser categories={sortedCategories} articles={articles} />
		</div>
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
