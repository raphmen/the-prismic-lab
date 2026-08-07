"use client";

import type { ArticleRef } from "@/lib/articles";

export type ArticleCategoryNavProps = {
	/** Every category the site has, already named and ordered by the page. */
	categories: ArticleRef[];
	/** The one category currently on. Never empty while `categories` is not. */
	activeId: string;
	onSelect: (id: string) => void;
};

/**
 * The category picker for the `/articles` master-detail layout.
 *
 * Single select, and no ALL: `/articles` is read one category at a time, so the
 * control is a row of tabs rather than a filter that can be cleared. There is no
 * "none selected" state to design for — the page hands it the first category at
 * first paint and every click replaces the selection.
 *
 * Dedicated to that page. The multi-select bars (`ExperimentBrowser`,
 * `ArticleBrowser`) keep their own boxes, because the rule they express — a set
 * that can be empty, ORed together — is not this one.
 *
 * Column on desktop, wrapping row above the grid on narrow screens; the sticky
 * offset that goes with it belongs to the page shell, not here.
 */
export function ArticleCategoryNav({
	categories,
	activeId,
	onSelect,
}: ArticleCategoryNavProps) {
	if (categories.length === 0) return null;

	return (
		<div role="group" aria-labelledby="article-category-nav-label">
			{/*
			 * The heading is the group's accessible name rather than a second,
			 * screen-reader-only label saying the same thing twice.
			 */}
			<p
				id="article-category-nav-label"
				className="mb-4 text-xs font-medium tracking-[0.12em] text-subtle uppercase"
			>
				Filter by category :
			</p>

			<div className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
				{categories.map((category) => (
					/*
					 * `aria-pressed` rather than `aria-current`: nothing here navigates,
					 * these are toggles over the grid beside them — and it is the same
					 * contract the site's other filter boxes announce.
					 */
					<button
						key={category.id}
						type="button"
						aria-pressed={category.id === activeId}
						onClick={() => onSelect(category.id)}
						className={`cursor-pointer border border-foreground px-4 py-2 text-left text-xs font-medium tracking-[0.12em] uppercase transition-all duration-200 ease-out motion-reduce:transition-none hover:scale-98 lg:w-full ${
							category.id === activeId
								? "bg-foreground text-background"
								: "bg-transparent text-foreground hover:bg-foreground/10"
						}`}
					>
						{category.name}
					</button>
				))}
			</div>
		</div>
	);
}

export default ArticleCategoryNav;
