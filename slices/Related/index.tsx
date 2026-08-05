import { Content, filter, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { ARTICLE_FETCH_LINKS, collectDocuments } from "@/lib/prismic";
import { Container } from "@/components/Container";
import { ArticleList } from "@/components/ArticleList";
import type { Article } from "@/lib/articles";

/**
 * Context the article templates pass down through their Slice Zone. The Auto
 * variation needs the article it sits on to know which categories to match and
 * which document to leave out. It is optional because other Slice Zones — the
 * Slice Simulator, for one — render slices without an article.
 */
export type ArticleContext = { article?: Article };

/** How many related articles the Auto variation shows at most. */
const AUTO_LIMIT = 4;

/**
 * Props for `Related`.
 */
export type RelatedProps = SliceComponentProps<
	Content.RelatedSlice,
	ArticleContext
>;

/**
 * Component for "Related" Slices.
 */
const Related = async ({ slice, context }: RelatedProps) => {
	const client = createClient();
	let articles: Article[] = [];

	if (slice.variation === "manual") {
		const ids = slice.primary.items
			.map((item) => item.article)
			.filter(isFilled.contentRelationship)
			.map((article) => article.id);

		if (ids.length > 0) {
			articles = await client.getAllByIDs<Article>(ids, {
				fetchLinks: ARTICLE_FETCH_LINKS,
			});
		}
	} else if (slice.variation === "auto") {
		const article = context?.article;

		/**
		 * Articles carry several categories now, so "related" means sharing *at
		 * least one* of them: `any` is an OR over the current article's category
		 * IDs. The article itself is filtered out so it never lists itself.
		 */
		const categoryIds = (article?.data.categories ?? [])
			.map((item) => item.category)
			.filter(isFilled.contentRelationship)
			.map((category) => category.id);

		if (article && categoryIds.length > 0) {
			const sharedCategory = (type: "experiment" | "article") => [
				filter.any(`my.${type}.categories.category`, categoryIds),
				filter.not("document.id", article.id),
			];

			articles = (
				await collectDocuments<Article>([
					client.getAllByType("experiment", {
						filters: sharedCategory("experiment"),
						fetchLinks: ARTICLE_FETCH_LINKS,
						limit: AUTO_LIMIT,
					}),
					client.getAllByType("article", {
						filters: sharedCategory("article"),
						fetchLinks: ARTICLE_FETCH_LINKS,
						limit: AUTO_LIMIT,
					}),
				])
			).slice(0, AUTO_LIMIT);
		}
	}

	if (articles.length === 0) return null;

	/**
	 * Kept at the reading measure so the rule above it lines up with the prose it
	 * follows. `size="default"` would give the card grid the wider listing measure
	 * instead — a design call, not a constraint.
	 */
	return (
		<Container
			as="section"
			size="prose"
			data-slice-type={slice.slice_type}
			data-slice-variation={slice.variation}
			className="my-12 border-t border-neutral-200 pt-10"
		>
			{slice.primary.title ? (
				<h2 className="text-xl font-semibold tracking-tight text-neutral-900">
					{slice.primary.title}
				</h2>
			) : null}
			{slice.primary.subtitle ? (
				<p className="mt-1 mb-4 text-sm text-neutral-500">
					{slice.primary.subtitle}
				</p>
			) : null}

			<ArticleList articles={articles} />
		</Container>
	);
};

export default Related;
