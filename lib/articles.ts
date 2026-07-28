import { asText, isFilled, type Content } from "@prismicio/client";

/**
 * The two document types that behave as articles across the site. They share
 * `title`, `excerpt`, `featured_image`, `categories`, `authors` and
 * `published_date`, which is exactly what every listing renders and filters on.
 */
export type Article = Content.ExperimentDocument | Content.FixDocument;

/** The label shown on an article's type badge. */
export const ARTICLE_TYPE_LABELS = {
	experiment: "Experiment",
	fix: "Fix",
} as const satisfies Record<Article["type"], string>;

/**
 * Difficulty in the order the model declares it, so the dropdown reads
 * Beginner → Advanced instead of alphabetically. Typed against the Select
 * field, so dropping or renaming an option in Prismic breaks the build here
 * rather than silently hiding it from the filter.
 */
export const DIFFICULTY_ORDER = [
	"Beginner",
	"Intermediate",
	"Advanced",
] as const satisfies readonly NonNullable<
	Content.ExperimentDocument["data"]["difficulty"]
>[];

/**
 * A linked category / author / tech reduced to what a listing needs: the id to
 * filter on and the name to display.
 */
export type ArticleRef = { id: string; name: string };

/**
 * Every group read below goes through `?? []`. The API leaves a group out of
 * its response entirely when a document has no items for it — including
 * documents last saved before the group existed — so the generated array type
 * is not a guarantee at runtime.
 *
 * The names come from `ARTICLE_FETCH_LINKS`; a link queried without them
 * resolves to an id with no `data`, which reads as an empty name and is dropped
 * rather than rendered as a blank chip.
 */
function toRefs(
	links: { id: string; data?: { name: Content.CategoryDocument["data"]["name"] } }[],
): ArticleRef[] {
	return links
		.map((link) => ({ id: link.id, name: asText(link.data?.name) ?? "" }))
		.filter((ref) => ref.name !== "");
}

export function articleCategories(article: Article): ArticleRef[] {
	return toRefs(
		(article.data.categories ?? [])
			.map((item) => item.category)
			.filter(isFilled.contentRelationship),
	);
}

export function articleAuthors(article: Article): ArticleRef[] {
	return toRefs(
		(article.data.authors ?? [])
			.map((item) => item.author)
			.filter(isFilled.contentRelationship),
	);
}

/** Only experiments carry a stack; a fix has none, so this is always empty. */
export function articleTechs(article: Article): ArticleRef[] {
	if (article.type !== "experiment") return [];

	return toRefs(
		(article.data.stack ?? [])
			.map((item) => item.tech)
			.filter(isFilled.contentRelationship),
	);
}

/**
 * Collects the distinct values a facet actually has across a set of articles,
 * alphabetically. Filter bars are built from this so an option can never match
 * zero articles.
 */
export function collectRefs(
	articles: Article[],
	pick: (article: Article) => ArticleRef[],
): ArticleRef[] {
	const byId = new Map<string, ArticleRef>();

	for (const ref of articles.flatMap(pick)) {
		if (!byId.has(ref.id)) byId.set(ref.id, ref);
	}

	return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export type SortDirection = "desc" | "asc";

/**
 * Orders articles by publication date, newest first by default.
 *
 * Prismic Date fields are `YYYY-MM-DD`, so comparing them as strings is already
 * chronological — no parsing, no timezone drift. Undated articles sort to the
 * end whichever direction is active, so flipping the toggle never promotes them
 * to the top of the list.
 */
export function sortArticlesByDate(
	articles: Article[],
	direction: SortDirection,
): Article[] {
	return [...articles].sort((a, b) => {
		const left = a.data.published_date;
		const right = b.data.published_date;

		if (!left && !right) return 0;
		if (!left) return 1;
		if (!right) return -1;

		return direction === "asc"
			? left.localeCompare(right)
			: right.localeCompare(left);
	});
}

/** Formats a Prismic Date field for display, or `null` when it is empty. */
export function formatArticleDate(date: string | null): string | null {
	if (!date) return null;

	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC",
	}).format(new Date(date));
}
