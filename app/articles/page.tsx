import type { Metadata } from "next";
import { createClient } from "@/prismicio";
import { buildMetadata } from "@/lib/seo";
import { ARTICLE_FETCH_LINKS } from "@/lib/prismic";
import { Container } from "@/components/Container";
import { EditorialHeader } from "@/components/EditorialHeader";
import { ArticleBrowser } from "@/components/ArticleBrowser";

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
	 * `ARTICLE_FETCH_LINKS` resolves the categories, authors and stack here — the
	 * three link-backed facets `ArticleBrowser` will find options for. Type needs
	 * no links at all: `article_type` is a Select on the document itself. The
	 * whole set is loaded; filtering happens on the client.
	 */
	const [index, articles] = await Promise.all([
		getIndex(),
		client.getAllByType("article", { fetchLinks: ARTICLE_FETCH_LINKS }),
	]);

	/** Full-bleed header beside the content Container, as on `/experiments`. */
	return (
		<>
			<EditorialHeader
				title={index?.data.title}
				description={index?.data.description}
				featuredImage={index?.data.featured_image}
			/>

			<Container className="py-16">
				<ArticleBrowser
					articles={articles}
					facets={[
						"search",
						"article_type",
						"categories",
						"stack",
						"author",
						"date",
					]}
					emptyMessage="No articles match these filters."
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
