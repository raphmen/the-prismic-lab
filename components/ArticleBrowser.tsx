"use client";

import { useMemo, useState, type ReactNode } from "react";
import { asText } from "@prismicio/client";
import { ArticleList } from "@/components/ArticleList";
import {
	articleAuthors,
	articleCategories,
	articleTechs,
	articleTypes,
	collectRefs,
	sortArticlesByDate,
	type Article,
	type SortDirection,
} from "@/lib/articles";

/** A control the filter bar can render, named after the field it filters on. */
export type ArticleFacet =
	| "search"
	| "article_type"
	| "categories"
	| "stack"
	| "author"
	| "date";

export type ArticleBrowserProps = {
	/** Every article for this index, already fetched with its links resolved. */
	articles: Article[];
	/**
	 * Which controls to offer. Order is ignored — the bar lays its controls out
	 * in a fixed order — so this is a set of names, not a layout.
	 */
	facets: readonly ArticleFacet[];
	/** Shown when the filters match nothing. */
	emptyMessage?: string;
};

/**
 * The filter bar and filtered list for `/experiments` and `/articles`.
 *
 * Filtering happens entirely here, over the array the server component loaded —
 * no query params, no refetching, so the state is local and disappears on
 * navigation by design.
 *
 * Which controls appear is the caller's call, through `facets`: the two indexes
 * want different bars — search and categories on `/experiments`, the full set on
 * `/articles` — and neither is a subset the component could infer from the
 * documents alone. A facet still has to earn its place twice: it renders only if
 * the page asked for it *and* the loaded documents give it options, so an option
 * can never match zero articles and a page cannot ask for a control that would
 * come up empty (an experiment has no `article_type`, for one).
 *
 * A disabled facet is inert, not merely hidden: its filter is skipped, so state
 * left behind by a facet that was switched off cannot quietly narrow the list.
 *
 * Multi-selects (Type, categories, Stack) are OR: an article matches when it has
 * at least one of the selected values. The author select and the title search
 * are AND against those.
 */
export function ArticleBrowser({
	articles,
	facets,
	emptyMessage = "No articles match these filters.",
}: ArticleBrowserProps) {
	const enabled = useMemo(() => new Set(facets), [facets]);
	const [search, setSearch] = useState("");
	const [typeIds, setTypeIds] = useState<string[]>([]);
	const [categoryIds, setCategoryIds] = useState<string[]>([]);
	const [techIds, setTechIds] = useState<string[]>([]);
	const [authorId, setAuthorId] = useState("");
	const [direction, setDirection] = useState<SortDirection>("desc");

	const typeOptions = useMemo(
		() => (enabled.has("article_type") ? collectRefs(articles, articleTypes) : []),
		[enabled, articles],
	);
	const categoryOptions = useMemo(
		() => (enabled.has("categories") ? collectRefs(articles, articleCategories) : []),
		[enabled, articles],
	);
	const techOptions = useMemo(
		() => (enabled.has("stack") ? collectRefs(articles, articleTechs) : []),
		[enabled, articles],
	);
	const authorOptions = useMemo(
		() => (enabled.has("author") ? collectRefs(articles, articleAuthors) : []),
		[enabled, articles],
	);

	const visible = useMemo(() => {
		const query = search.trim().toLowerCase();

		const matches = articles.filter((article) => {
			if (
				enabled.has("search") &&
				query &&
				!asText(article.data.title).toLowerCase().includes(query)
			) {
				return false;
			}

			if (
				enabled.has("article_type") &&
				typeIds.length > 0 &&
				!articleTypes(article).some((ref) => typeIds.includes(ref.id))
			) {
				return false;
			}

			if (
				enabled.has("categories") &&
				categoryIds.length > 0 &&
				!articleCategories(article).some((ref) => categoryIds.includes(ref.id))
			) {
				return false;
			}

			if (
				enabled.has("stack") &&
				techIds.length > 0 &&
				!articleTechs(article).some((ref) => techIds.includes(ref.id))
			) {
				return false;
			}

			if (
				enabled.has("author") &&
				authorId &&
				!articleAuthors(article).some((ref) => ref.id === authorId)
			) {
				return false;
			}

			return true;
		});

		/**
		 * Only the date toggle owns the order. Without it the caller's order is the
		 * order — re-sorting here would silently override whatever the page decided,
		 * which is the one thing a page that dropped the control cannot correct.
		 */
		return enabled.has("date")
			? sortArticlesByDate(matches, direction)
			: matches;
	}, [
		enabled,
		articles,
		search,
		typeIds,
		categoryIds,
		techIds,
		authorId,
		direction,
	]);

	const isFiltered =
		(enabled.has("search") && search !== "") ||
		(enabled.has("article_type") && typeIds.length > 0) ||
		(enabled.has("categories") && categoryIds.length > 0) ||
		(enabled.has("stack") && techIds.length > 0) ||
		(enabled.has("author") && authorId !== "");

	function reset() {
		setSearch("");
		setTypeIds([]);
		setCategoryIds([]);
		setTechIds([]);
		setAuthorId("");
	}

	/**
	 * The inline controls share a row; the chip rows below always span the bar.
	 * Widening the grid past what is actually in it would strand a lone search box
	 * at a quarter of the bar, so the track count follows the control count — and
	 * lands back on the original `sm:2 / lg:4` for the full set.
	 */
	const inlineControls = [
		enabled.has("search"),
		enabled.has("author") && authorOptions.length > 0,
		enabled.has("date"),
	].filter(Boolean).length;

	const gridColumns =
		inlineControls >= 3
			? "sm:grid-cols-2 lg:grid-cols-4"
			: inlineControls === 2
				? "sm:grid-cols-2"
				: "";

	return (
		<>
			<div className="mb-10 rounded-lg border border-border p-4 sm:p-5">
				<div className={`grid gap-4 ${gridColumns}`}>
					{enabled.has("search") ? (
						<Field label="Search">
							<input
								type="search"
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder="Search titles…"
								className={CONTROL_CLASS}
							/>
						</Field>
					) : null}

					{authorOptions.length > 0 ? (
						<Field label="Author">
							<select
								value={authorId}
								onChange={(event) => setAuthorId(event.target.value)}
								className={CONTROL_CLASS}
							>
								<option value="">Anyone</option>
								{authorOptions.map((author) => (
									<option key={author.id} value={author.id}>
										{author.name}
									</option>
								))}
							</select>
						</Field>
					) : null}

					{/*
					 * A plain wrapper rather than a `Field`: the caption belongs to a
					 * toggle, not to a form control, and wrapping a button in a `<label>`
					 * would fold "Date" into its accessible name.
					 */}
					{enabled.has("date") ? (
						<div>
							<span className="mb-1.5 block text-xs font-medium tracking-wide text-subtle uppercase">
								Date
							</span>
							<button
								type="button"
								onClick={() =>
									setDirection((current) =>
										current === "desc" ? "asc" : "desc",
									)
								}
								className={`${CONTROL_CLASS} flex items-center justify-between text-left transition-colors hover:border-subtle`}
							>
								{direction === "desc" ? "Newest first" : "Oldest first"}
								<span aria-hidden className="text-subtle">
									{direction === "desc" ? "↓" : "↑"}
								</span>
							</button>
						</div>
					) : null}
				</div>

				{typeOptions.length > 0 ? (
					<ChipRow
						label="Type"
						options={typeOptions}
						selected={typeIds}
						onToggle={(id) => setTypeIds(toggle(typeIds, id))}
					/>
				) : null}

				{categoryOptions.length > 0 ? (
					<ChipRow
						label="Categories"
						options={categoryOptions}
						selected={categoryIds}
						onToggle={(id) => setCategoryIds(toggle(categoryIds, id))}
					/>
				) : null}

				{techOptions.length > 0 ? (
					<ChipRow
						label="Stack"
						options={techOptions}
						selected={techIds}
						onToggle={(id) => setTechIds(toggle(techIds, id))}
					/>
				) : null}

				<div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
					<p aria-live="polite">
						{visible.length} of {articles.length}
					</p>
					{isFiltered ? (
						<button
							type="button"
							onClick={reset}
							className="font-medium text-foreground underline decoration-subtle underline-offset-2 transition-colors hover:decoration-foreground"
						>
							Clear filters
						</button>
					) : null}
				</div>
			</div>

			<ArticleList articles={visible} emptyMessage={emptyMessage} />
		</>
	);
}

const CONTROL_CLASS =
	"w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground [color-scheme:dark] placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-subtle";

function toggle(values: string[], value: string) {
	return values.includes(value)
		? values.filter((current) => current !== value)
		: [...values, value];
}

function Field({ label, children }: { label: string; children: ReactNode }) {
	return (
		<label className="block">
			<span className="mb-1.5 block text-xs font-medium tracking-wide text-subtle uppercase">
				{label}
			</span>
			{children}
		</label>
	);
}

function ChipRow({
	label,
	options,
	selected,
	onToggle,
}: {
	label: string;
	options: { id: string; name: string }[];
	selected: string[];
	onToggle: (id: string) => void;
}) {
	return (
		<fieldset className="mt-4">
			<legend className="mb-1.5 text-xs font-medium tracking-wide text-subtle uppercase">
				{label}
			</legend>
			<div className="flex flex-wrap gap-2">
				{options.map((option) => {
					const active = selected.includes(option.id);

					return (
						<button
							key={option.id}
							type="button"
							aria-pressed={active}
							onClick={() => onToggle(option.id)}
							className={`rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-subtle ${
								active
									? "border-accent bg-accent text-accent-foreground"
									: "border-border text-muted-foreground hover:border-subtle hover:text-foreground"
							}`}
						>
							{option.name}
						</button>
					);
				})}
			</div>
		</fieldset>
	);
}

export default ArticleBrowser;
