import type { Metadata } from "next";
import { createClient } from "@/prismicio";
import { buildMetadata } from "@/lib/seo";
import { ARTICLE_FETCH_LINKS } from "@/lib/prismic";
import { EditorialHeader } from "@/components/EditorialHeader";
import { ArticleBrowser } from "@/components/ArticleBrowser";

/**
 * The `fixes_index` singleton owns `/fixes`; the repeatable `fix` type owns
 * `/fixes/:uid` next door in `[uid]`.
 *
 * Read optionally for the same reason as `/experiments`: a missing or
 * unpublished index document costs the header, not the route.
 */
async function getIndex() {
	const client = createClient();
	return client.getSingle("fixes_index").catch(() => null);
}

export default async function Page() {
	const client = createClient();

	/**
	 * A fix has no `difficulty` and no `stack`, so `ARTICLE_FETCH_LINKS` resolves
	 * its categories and authors here — the two facets `ArticleBrowser` will find
	 * options for. The whole set is loaded; filtering happens on the client.
	 */
	const [index, fixes] = await Promise.all([
		getIndex(),
		client.getAllByType("fix", { fetchLinks: ARTICLE_FETCH_LINKS }),
	]);

	return (
		<div className="mx-auto w-full max-w-5xl px-6 py-16">
			<EditorialHeader
				title={index?.data.title}
				description={index?.data.description}
				featuredImage={index?.data.featured_image}
			/>

			<ArticleBrowser
				articles={fixes}
				emptyMessage="No fixes match these filters."
			/>
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
