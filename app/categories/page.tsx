import type { Metadata } from "next";
import { asText } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/Container";
import { EditorialHeader } from "@/components/EditorialHeader";

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
	 * This page is a directory, not a listing: it names the categories and hands
	 * each one off to its own cluster page, so no article is fetched here.
	 */
	const [index, categories] = await Promise.all([
		getIndex(),
		client.getAllByType("category"),
	]);

	/**
	 * Sorted here rather than through `orderings`: `name` is Rich Text, and
	 * Prismic only exposes a `my.category.name` ordering path once a published
	 * document fills it. Comparing the rendered text avoids that trap entirely.
	 */
	const sortedCategories = [...categories].sort((a, b) =>
		asText(a.data.name).localeCompare(asText(b.data.name)),
	);

	/** Full-bleed header beside the content Container, as on `/experiments`. */
	return (
		<>
			<EditorialHeader
				title={index?.data.title}
				description={index?.data.description}
				featuredImage={index?.data.featured_image}
			/>

			<Container className="py-16">
				{sortedCategories.length > 0 ? (
					<nav aria-label="Categories">
						<ul className="divide-y divide-border border-y border-border">
							{sortedCategories.map((category) => (
								<li key={category.id}>
									{/*
									 * Linked by `document` rather than by a hand-written path, so
									 * the URL keeps coming from the `category` route resolver in
									 * `prismic.config.json`.
									 */}
									<PrismicNextLink
										document={category}
										className="flex py-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-subtle"
									>
										{asText(category.data.name) || "Untitled category"}
									</PrismicNextLink>
								</li>
							))}
						</ul>
					</nav>
				) : (
					<p className="text-sm text-muted-foreground">No categories yet.</p>
				)}
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
