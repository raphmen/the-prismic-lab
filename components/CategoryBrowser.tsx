"use client";

import { useMemo, useState } from "react";
import { asText, type Content } from "@prismicio/client";
import { ArticleList } from "@/components/ArticleList";
import { articleCategories, sortArticlesByDate, type Article } from "@/lib/articles";

export type CategoryBrowserProps = {
	categories: Content.CategoryDocument[];
	/** Every experiment and fix, already fetched with its links resolved. */
	articles: Article[];
};

/**
 * The master-detail for `/categories`: categories on the left, the articles in
 * the selected one on the right.
 *
 * Selection is the only interaction, so the whole set is loaded once by the
 * server component and switching categories costs nothing. The right pane mixes
 * experiments and fixes — each card carries its own type badge — and scrolls on
 * its own so a long category never pushes the category list out of view.
 */
export function CategoryBrowser({ categories, articles }: CategoryBrowserProps) {
	const [selectedId, setSelectedId] = useState(() => categories[0]?.id ?? null);

	/**
	 * Grouped once per article set rather than re-filtered on every click. The
	 * `categories` group is read through `articleCategories`, which tolerates the
	 * group being absent from the API response entirely.
	 */
	const articlesByCategory = useMemo(() => {
		const grouped = new Map<string, Article[]>();

		for (const article of sortArticlesByDate(articles, "desc")) {
			for (const ref of articleCategories(article)) {
				const bucket = grouped.get(ref.id);
				if (bucket) bucket.push(article);
				else grouped.set(ref.id, [article]);
			}
		}

		return grouped;
	}, [articles]);

	if (categories.length === 0) {
		return <p className="text-sm text-muted-foreground">No categories yet.</p>;
	}

	const selected = categories.find((category) => category.id === selectedId);
	const selectedArticles = selectedId
		? (articlesByCategory.get(selectedId) ?? [])
		: [];

	return (
		<div className="grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
			<nav aria-label="Categories">
				<ul className="divide-y divide-border border-y border-border">
					{categories.map((category) => {
						const active = category.id === selectedId;
						const name = asText(category.data.name);

						return (
							<li key={category.id}>
								<button
									type="button"
									aria-current={active ? "true" : undefined}
									onClick={() => setSelectedId(category.id)}
									className={`flex w-full items-baseline justify-between gap-3 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-subtle ${
										active
											? "font-semibold text-foreground"
											: "text-muted-foreground hover:text-foreground hover:cursor-pointer"
									}`}
								>
									<span>{name || "Untitled category"}</span>
									<span className="text-xs text-subtle">
										{(articlesByCategory.get(category.id) ?? []).length}
									</span>
								</button>
							</li>
						);
					})}
				</ul>
			</nav>

			<section
				aria-label={
					selected ? `Articles in ${asText(selected.data.name)}` : "Articles"
				}
				className="max-h-[70vh] overflow-y-auto lg:pr-2"
			>
				<ArticleList
					articles={selectedArticles}
					emptyMessage="No articles in this category yet."
				/>
			</section>
		</div>
	);
}

export default CategoryBrowser;
