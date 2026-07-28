import { ArticleCard } from "@/components/ArticleCard";
import type { Article } from "@/lib/articles";

export type ArticleListProps = {
	articles: Article[];
	/** Shown instead of the grid when there is nothing to list. */
	emptyMessage?: string;
};

/**
 * A grid of `ArticleCard`s, plus the empty state. This component is only the
 * layout — what an article looks like lives in `ArticleCard`, which every
 * listing on the site shares.
 */
export function ArticleList({
	articles,
	emptyMessage = "Nothing here yet.",
}: ArticleListProps) {
	if (articles.length === 0) {
		return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
	}

	return (
		<ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
			{articles.map((article) => (
				<li key={article.id}>
					<ArticleCard article={article} />
				</li>
			))}
		</ul>
	);
}

export default ArticleList;
