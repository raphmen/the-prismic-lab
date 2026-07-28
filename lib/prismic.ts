import { ParsingError, type PrismicDocument } from "@prismicio/client";

/**
 * Linked fields the article templates need alongside the article itself.
 *
 * An article's categories, authors and stack are content relationships nested
 * inside repeatable groups, and only their IDs come back by default. Asking for
 * the linked names here resolves every one of them in the same request, however
 * many group items there are, instead of one follow-up query per link.
 *
 * The relationships also declare these fields in the content model, which is
 * what types them as `link.data.name` — this list is what actually populates
 * them at query time.
 */
export const ARTICLE_FETCH_LINKS = [
	"category.name",
	"author.name",
	"tech.name",
];

/**
 * Runs document queries side by side and concatenates their results.
 *
 * Prismic only exposes `my.<type>.<field>` as a queryable path once at least one
 * *published* document has that field filled. Until then the API rejects any
 * filter on it with a parsing error — which, inside a plain `Promise.all`, takes
 * down the whole page. An unknown path means "nothing links here yet", so it is
 * treated as an empty result. Any other failure (network, bad ref, …) is
 * rethrown so it is not silently swallowed.
 */
export async function collectDocuments<TDocument extends PrismicDocument>(
	queries: Promise<TDocument[]>[],
): Promise<TDocument[]> {
	const results = await Promise.allSettled(queries);

	return results.flatMap((result) => {
		if (result.status === "fulfilled") return result.value;
		if (result.reason instanceof ParsingError) return [];
		throw result.reason;
	});
}
