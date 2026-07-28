import type { Metadata } from "next";
import { createClient } from "@/prismicio";
import { buildMetadata } from "@/lib/seo";
import { ARTICLE_FETCH_LINKS } from "@/lib/prismic";
import { Container } from "@/components/Container";
import { EditorialHeader } from "@/components/EditorialHeader";
import { ArticleBrowser } from "@/components/ArticleBrowser";

/**
 * The `experiments_index` singleton owns `/experiments`; the repeatable
 * `experiment` type owns `/experiments/:uid` next door in `[uid]`.
 *
 * The singleton is read optionally: the list is what this page is for, so an
 * index document that has not been created or published yet costs the editorial
 * header, not the whole route.
 */
async function getIndex() {
	const client = createClient();
	return client.getSingle("experiments_index").catch(() => null);
}

export default async function Page() {
	const client = createClient();

	/**
	 * Everything the page needs, in one round of requests: the header copy, and
	 * every experiment with its categories, authors and stack resolved by
	 * `ARTICLE_FETCH_LINKS` so the filter bar and the cards can read names
	 * without a follow-up query per link. No pagination — the whole set is loaded
	 * and filtered on the client.
	 */
	const [index, experiments] = await Promise.all([
		getIndex(),
		client.getAllByType("experiment", { fetchLinks: ARTICLE_FETCH_LINKS }),
	]);

	return (
		<Container className="py-16">
			<EditorialHeader
				title={index?.data.title}
				description={index?.data.description}
				featuredImage={index?.data.featured_image}
			/>

			<ArticleBrowser
				articles={experiments}
				emptyMessage="No experiments match these filters."
			/>
		</Container>
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
