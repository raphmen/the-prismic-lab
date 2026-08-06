"use client";

import type { Content } from "@prismicio/client";
import {
	AnimatePresence,
	MotionConfig,
	motion,
	useReducedMotion,
	type Transition,
} from "motion/react";
import { ExperimentCard } from "@/components/ExperimentCard";

export type ExperimentListProps = {
	experiments: Content.ExperimentDocument[];
	emptyMessage?: string;
};

/** The glide to a new grid position. Nearly critically damped, so it settles without bouncing. */
const LAYOUT_TRANSITION: Transition = {
	type: "spring",
	stiffness: 320,
	damping: 32,
	mass: 0.9,
};

/** Enter and leave. The ease is the card's own `--reveal-ease`, so the grid and the cards agree. */
const FADE_TRANSITION: Transition = {
	duration: 0.24,
	ease: [0.22, 1, 0.36, 1],
};

const INSTANT: Transition = { duration: 0 };

export function ExperimentList({
	experiments,
	emptyMessage = "Nothing here yet.",
}: ExperimentListProps) {
	/**
	 * `MotionConfig` already drops transforms under `prefers-reduced-motion`, which
	 * would still leave the fades to play out. Zeroing the durations too is what
	 * makes a filter change genuinely instant rather than merely still.
	 */
	const prefersReducedMotion = useReducedMotion();

	return (
		<MotionConfig reducedMotion="user">
			{/*
			 * `relative` is load-bearing: `popLayout` pops an exiting card out of the
			 * flow so the survivors can close the gap immediately, and an absolutely
			 * positioned card needs this element to position against.
			 *
			 * The list is not unmounted when it empties — the early return it replaces
			 * would have taken `AnimatePresence` with it and cut the exit animation off.
			 * (Unreachable through the filter bar, whose options are derived from the
			 * loaded set, but the grid should not depend on that to behave.)
			 */}
			<ul className="relative grid grid-cols-1 gap-4 min-[800px]:grid-cols-2 lg:grid-cols-3">
				{/*
				 * `initial={false}` mounts the first render in its resting state. Without
				 * it every card would be server-rendered at `opacity: 0` and fade in after
				 * hydration — a load flash, and a worse LCP, for an animation that only
				 * has anything to say when a filter changes.
				 */}
				<AnimatePresence mode="popLayout" initial={false}>
					{experiments.map((experiment) => (
						/*
						 * `motion.li` rather than a wrapper div: this is the grid item, and a
						 * `div` between `ul` and `li` would be invalid markup.
						 *
						 * The document id — never the array index, which would hand a card's
						 * identity to whatever lands in its slot and break the FLIP.
						 *
						 * `layout` transforms this element; the hover zoom transforms elements
						 * inside the card, so the two never write to the same transform.
						 */
						<motion.li
							key={experiment.id}
							layout
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							/* An exiting card is out of the flow and can overlap a survivor;
							   opacity alone would leave it swallowing that card's hover. */
							exit={{ opacity: 0, scale: 0.96, pointerEvents: "none" }}
							transition={
								prefersReducedMotion
									? INSTANT
									: {
											layout: LAYOUT_TRANSITION,
											opacity: FADE_TRANSITION,
											scale: FADE_TRANSITION,
										}
							}
						>
							<ExperimentCard experiment={experiment} />
						</motion.li>
					))}
				</AnimatePresence>
			</ul>

			{experiments.length === 0 ? (
				<p className="text-sm text-muted-foreground">{emptyMessage}</p>
			) : null}
		</MotionConfig>
	);
}

export default ExperimentList;
