import { Content, filter, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { collectDocuments } from "@/lib/prismic";
import { ArticleList, type Article } from "@/components/ArticleList";

/**
 * Props for `Related`.
 */
export type RelatedProps = SliceComponentProps<Content.RelatedSlice>;

/**
 * Component for "Related" Slices.
 */
const Related = async ({ slice }: RelatedProps) => {
	const client = createClient();
	let articles: Article[] = [];

	if (slice.variation === "manual") {
		const ids = slice.primary.items
			.map((item) => item.article)
			.filter(isFilled.contentRelationship)
			.map((article) => article.id);

		if (ids.length > 0) {
			articles = await client.getAllByIDs<Article>(ids);
		}
	} else if (slice.variation === "auto") {
		const category = slice.primary.category;
		if (isFilled.contentRelationship(category)) {
			articles = await collectDocuments<Article>([
				client.getAllByType("experiment", {
					filters: [filter.at("my.experiment.category", category.id)],
				}),
				client.getAllByType("fix", {
					filters: [filter.at("my.fix.category", category.id)],
				}),
			]);
		}
	}

	if (articles.length === 0) return null;

	return (
		<section
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
		</section>
	);
};

export default Related;
