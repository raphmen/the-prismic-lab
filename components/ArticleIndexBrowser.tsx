"use client";

import { useMemo, useState } from "react";
import type { Content } from "@prismicio/client";
import { ArticleCategoryNav } from "@/components/ArticleCategoryNav";
import { ArticleIndexGrid } from "@/components/ArticleIndexGrid";
import type { ArticleAvatars } from "@/components/ArticleIndexCard";
import {
	articleCategories,
	sortArticlesByDate,
	type ArticleRef,
} from "@/lib/articles";

export type ArticleIndexBrowserProps = {
	/** Every article, already fetched with its links resolved. */
	articles: Content.ArticleDocument[];
	/** The site's categories, named and ordered by the page. */
	categories: ArticleRef[];
	avatars: ArticleAvatars;
	emptyMessage?: string;
};

/**
 * The master-detail shell of `/articles`: the category column on the left, the
 * grid on the right.
 *
 * One category is always on — the first at first paint, and a click replaces it
 * rather than adding to it. There is no ALL and no empty selection, so the page
 * is never a wall of every article the site has ever published; it is read one
 * category at a time. An article filed under several categories appears under
 * each of them.
 *
 * `ArticleBrowser` is untouched and still serves the multi-facet listings — this
 * is a different rule, not a variant of that one.
 */
export function ArticleIndexBrowser({
	articles,
	categories,
	avatars,
	emptyMessage,
}: ArticleIndexBrowserProps) {
	/**
	 * The selection is an id, never an index: the category list is derived from
	 * documents, and an id keeps pointing at the same category however that list
	 * is ordered.
	 */
	const [activeId, setActiveId] = useState(() => categories[0]?.id ?? "");

	const visible = useMemo(() => {
		const matches = articles.filter((article) =>
			articleCategories(article).some((ref) => ref.id === activeId),
		);

		/**
		 * The order is fixed rather than offered as a control: newest first, undated
		 * last. Sorting after the filter, not trusting the fetch order, means every
		 * category reads the same.
		 */
		return sortArticlesByDate(matches, "desc");
	}, [articles, activeId]);

	return (
		/*
		 * `items-start` is what makes the column sticky: a stretched grid item is
		 * already as tall as the row, leaving the sticky box nothing to travel
		 * through. Nothing above this — `main`, the page, the Container — clips its
		 * overflow, which would have killed it just as quietly.
		 *
		 * Below `lg` the column is a plain block above the grid, where a wrapping row
		 * of boxes reads better than a sidebar squeezed beside two columns.
		 */
		<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] lg:gap-10">
			<aside className="lg:sticky lg:top-20 pl-6">
				<ArticleCategoryNav
					categories={categories}
					activeId={activeId}
					onSelect={setActiveId}
				/>
			</aside>

			<ArticleIndexGrid
				articles={visible}
				avatars={avatars}
				replayKey={activeId}
				emptyMessage={emptyMessage}
			/>
		</div>
	);
}

export default ArticleIndexBrowser;
