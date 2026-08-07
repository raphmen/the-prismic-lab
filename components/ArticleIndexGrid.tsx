"use client";

import type { Content } from "@prismicio/client";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import {
	ArticleIndexCard,
	type ArticleAvatars,
} from "@/components/ArticleIndexCard";

export type ArticleIndexGridProps = {
	/** Already filtered to the active category and sorted by the browser. */
	articles: Content.ArticleDocument[];
	avatars: ArticleAvatars;
	/**
	 * Remount token. Changing it replays the cascade — it is the active category,
	 * so switching category re-enters the grid instead of swapping its contents
	 * in place.
	 */
	replayKey: string;
	emptyMessage?: string;
};

/** The rise. Far enough to read as arriving from below, short enough not to travel. */
const ENTRANCE_RISE = 24;
const ENTRANCE_DURATION = 0.35;
/** Per-card offset — a cascade, not a wave. */
const ENTRANCE_STAGGER = 0.04;
/**
 * The cascade is capped: at 0.04s a card, a category holding thirty articles
 * would still be arriving more than a second after the click. Past this the tail
 * lands together.
 */
const ENTRANCE_MAX_DELAY = 0.6;

/**
 * The right-hand grid of the `/articles` master-detail layout: one column, two
 * from 800px, three from 1400px, every card a 4:3 poster.
 *
 * The third column waits for 1400px rather than arriving at `lg`: the category
 * column takes its width off the top, and below that the three cards are too
 * small for a cover to be the thing you read them by.
 *
 * Cards rise into place, one after the next, on first paint and again on every
 * category change. The replay is a remount rather than an effect — `replayKey`
 * on the list means React rebuilds it and each card runs its own entrance again,
 * with no "have I animated yet" state to keep in sync.
 *
 * The card keys are document ids, never indices: a card's identity has to follow
 * the article across a category switch, not the slot it happened to land in.
 */
export function ArticleIndexGrid({
	articles,
	avatars,
	replayKey,
	emptyMessage = "No articles in this category yet.",
}: ArticleIndexGridProps) {
	/**
	 * `MotionConfig` already drops the transform under `prefers-reduced-motion`,
	 * which would leave the fade and — worse — the stagger to play out. Zeroing the
	 * transition is what makes the grid genuinely instant rather than merely still.
	 */
	const prefersReducedMotion = useReducedMotion();

	if (articles.length === 0) {
		return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
	}

	return (
		<MotionConfig reducedMotion="user">
			<ul
				key={replayKey}
				className="grid grid-cols-1 gap-4 min-[800px]:grid-cols-2 min-[1400px]:grid-cols-3"
			>
				{articles.map((article, index) => (
					/*
					 * The initial state is rendered on the server too, so the entrance plays
					 * from the first frame the browser paints — including the very first
					 * load, which is the point. Reduced motion keeps that same markup and
					 * simply lands it in one frame, rather than swapping to a different
					 * `initial` the server could not have known about.
					 */
					<motion.li
						key={article.id}
						initial={{ opacity: 0, y: ENTRANCE_RISE }}
						animate={{ opacity: 1, y: 0 }}
						transition={
							prefersReducedMotion
								? { duration: 0 }
								: {
										duration: ENTRANCE_DURATION,
										ease: "easeOut",
										delay: Math.min(
											index * ENTRANCE_STAGGER,
											ENTRANCE_MAX_DELAY,
										),
									}
						}
					>
						<ArticleIndexCard article={article} avatars={avatars} />
					</motion.li>
				))}
			</ul>
		</MotionConfig>
	);
}

export default ArticleIndexGrid;
