"use client";

import { useMemo, useState } from "react";
import type { Content } from "@prismicio/client";
import { ExperimentList } from "@/components/ExperimentList";
import {
	articleCategories,
	collectRefs,
	sortArticlesByDate,
} from "@/lib/articles";

export type ExperimentBrowserProps = {
	/** Every experiment for the index, already fetched with its links resolved. */
	experiments: Content.ExperimentDocument[];
	/** Shown when the filters match nothing. */
	emptyMessage?: string;
};

/**
 * The filter bar and grid for `/experiments`.
 *
 * Options come from the loaded experiments, so a category that matches nothing
 * never appears as a box that returns nothing.
 *
 * Multiple categories are OR: an experiment matches when it carries at least one
 * of them.
 */
export function ExperimentBrowser({
	experiments,
	emptyMessage = "No experiments match these filters.",
}: ExperimentBrowserProps) {
	const [categoryIds, setCategoryIds] = useState<string[]>([]);

	const categoryOptions = useMemo(
		() => collectRefs(experiments, articleCategories),
		[experiments],
	);

	/**
	 * ALL is not a fourth piece of state — it *is* the empty selection, read back
	 * as a label. Every rule the bar has to keep then holds for free rather than
	 * as three separate handlers that can drift apart: ALL is on at first paint,
	 * picking a category turns it off, picking ALL clears the categories, and
	 * unpicking the last category lands back on ALL instead of on a bar that
	 * matches nothing.
	 */

	const showAll = categoryIds.length === 0;

	const visible = useMemo(() => {
		const matches = showAll
			? experiments
			: experiments.filter((experiment) =>
					articleCategories(experiment).some((ref) =>
						categoryIds.includes(ref.id),
					),
				);

		/**
		 * The order is fixed here, not offered as a control: newest first, undated
		 * last. Sorting after the filter rather than trusting the caller's order
		 * means the grid reads the same however the page fetched it.
		 */
		return sortArticlesByDate(matches, "desc");
	}, [experiments, categoryIds, showAll]);

	return (
		<>
			{categoryOptions.length > 0 ? (
				<fieldset className="w-full flex justify-center flex-wrap mb-8">
					{/*
					 * The boxes say what they filter; a visible caption above them would
					 * only repeat it. The legend stays for anyone who arrives at the group
					 * without seeing it.
					 */}
					<legend className="sr-only">Filter experiments by category</legend>

					<div className="flex flex-wrap gap-2">
						<FilterBox
							label="All"
							active={showAll}
							onClick={() => setCategoryIds([])}
						/>

						{categoryOptions.map((category) => (
							<FilterBox
								key={category.id}
								label={category.name}
								active={categoryIds.includes(category.id)}
								onClick={() => setCategoryIds(toggle(categoryIds, category.id))}
							/>
						))}
					</div>
				</fieldset>
			) : null}

			<ExperimentList experiments={visible} emptyMessage={emptyMessage} />
		</>
	);
}

function toggle(values: string[], value: string) {
	return values.includes(value)
		? values.filter((current) => current !== value)
		: [...values, value];
}

/**
 * A square filter box: hairline outline at rest, solid inversion when selected.
 *
 * `aria-pressed` rather than a checkbox, because ALL and the categories are one
 * row of the same control and ALL is not a value in the set — a fieldset of
 * checkboxes would have to explain that in markup.
 */
function FilterBox({
	label,
	active,
	onClick,
}: {
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			aria-pressed={active}
			onClick={onClick}
			className={`cursor-pointer border border-foreground px-4 py-2 text-xs font-medium tracking-[0.12em] uppercase transition-all duration-200 ease-out motion-reduce:transition-none hover:scale-98 ${
				active
					? "bg-foreground text-background"
					: "bg-transparent text-foreground hover:bg-foreground/10"
			}`}
		>
			{label}
		</button>
	);
}

export default ExperimentBrowser;
