"use client";

import { useMemo, useState, type ReactNode } from "react";
import { asText } from "@prismicio/client";
import { ArticleList } from "@/components/ArticleList";
import {
	articleAuthors,
	articleCategories,
	articleTechs,
	collectRefs,
	sortArticlesByDate,
	type Article,
	type SortDirection,
} from "@/lib/articles";

export type ArticleBrowserProps = {
	/** Every article for this index, already fetched with its links resolved. */
	articles: Article[];
	/** Shown when the filters match nothing. */
	emptyMessage?: string;
};

/**
 * The filter bar and filtered list for `/experiments` and `/fixes`.
 *
 * Filtering happens entirely here, over the array the server component loaded —
 * no query params, no refetching, so the state is local and disappears on
 * navigation by design.
 *
 * Every facet is derived from the articles actually loaded, so an option can
 * never match zero articles, and a facet with nothing to offer renders no
 * control at all. That is also what makes one component serve both pages: a fix
 * carries no `stack`, so that control is simply absent there.
 *
 * Multi-selects (categories, stack) are OR: an article matches when it has at
 * least one of the selected values. The author select and the title search are
 * AND against those.
 */
export function ArticleBrowser({
	articles,
	emptyMessage = "No articles match these filters.",
}: ArticleBrowserProps) {
	const [search, setSearch] = useState("");
	const [categoryIds, setCategoryIds] = useState<string[]>([]);
	const [techIds, setTechIds] = useState<string[]>([]);
	const [authorId, setAuthorId] = useState("");
	const [direction, setDirection] = useState<SortDirection>("desc");

	const categoryOptions = useMemo(
		() => collectRefs(articles, articleCategories),
		[articles],
	);
	const authorOptions = useMemo(
		() => collectRefs(articles, articleAuthors),
		[articles],
	);
	const techOptions = useMemo(
		() => collectRefs(articles, articleTechs),
		[articles],
	);

	const visible = useMemo(() => {
		const query = search.trim().toLowerCase();

		const matches = articles.filter((article) => {
			if (query && !asText(article.data.title).toLowerCase().includes(query)) {
				return false;
			}

			if (
				categoryIds.length > 0 &&
				!articleCategories(article).some((ref) => categoryIds.includes(ref.id))
			) {
				return false;
			}

			if (
				techIds.length > 0 &&
				!articleTechs(article).some((ref) => techIds.includes(ref.id))
			) {
				return false;
			}

			if (
				authorId &&
				!articleAuthors(article).some((ref) => ref.id === authorId)
			) {
				return false;
			}

			return true;
		});

		return sortArticlesByDate(matches, direction);
	}, [articles, search, categoryIds, techIds, authorId, direction]);

	const isFiltered =
		search !== "" ||
		categoryIds.length > 0 ||
		techIds.length > 0 ||
		authorId !== "";

	function reset() {
		setSearch("");
		setCategoryIds([]);
		setTechIds([]);
		setAuthorId("");
	}

	return (
		<>
			<div className="mb-10 rounded-lg border border-border p-4 sm:p-5">
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<Field label="Search">
						<input
							type="search"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search titles…"
							className={CONTROL_CLASS}
						/>
					</Field>

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
					<div>
						<span className="mb-1.5 block text-xs font-medium tracking-wide text-subtle uppercase">
							Date
						</span>
						<button
							type="button"
							onClick={() =>
								setDirection((current) => (current === "desc" ? "asc" : "desc"))
							}
							className={`${CONTROL_CLASS} flex items-center justify-between text-left transition-colors hover:border-subtle`}
						>
							{direction === "desc" ? "Newest first" : "Oldest first"}
							<span aria-hidden className="text-subtle">
								{direction === "desc" ? "↓" : "↑"}
							</span>
						</button>
					</div>
				</div>

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
