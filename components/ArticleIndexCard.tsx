import { Fragment } from "react";
import { asText, type Content, type ImageField } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import {
	articleAuthors,
	articleTechs,
	articleTypeLabel,
	formatArticleDate,
	type ArticleRef,
} from "@/lib/articles";

/**
 * Author id → avatar, built once by the page from the `author` documents.
 *
 * `ARTICLE_FETCH_LINKS` resolves an author's *name* onto the article, which is
 * all every other listing needs; the avatar is only wanted here, so it is
 * carried in beside the articles rather than added to a fetch every page on the
 * site pays for.
 */
export type ArticleAvatars = Record<string, ImageField | undefined>;

export type ArticleIndexCardProps = {
	article: Content.ArticleDocument;
	avatars: ArticleAvatars;
};

/**
 * The card for the `/articles` index, and only there — `ArticleCard` still
 * summarises an article everywhere else (the Related slice, `/categories/:uid`,
 * `/authors/:uid`, `/tech/:uid`).
 *
 * Image-first, with two states rather than two designs. At rest it is a poster:
 * type badge, title and excerpt at three-quarter strength over a deep gradient.
 * On hover it commits — the frame arrives, the gradient lifts, the copy comes up
 * to full, and the stack, the authors and the date appear.
 *
 * Everything is in the DOM at every state; the resting state only ever hides
 * with opacity, and it is declared in `globals.css` so the first painted frame
 * is already correct rather than corrected after hydration. The reveal itself
 * lives there too, as one block of custom properties — see
 * `.article-index-card`.
 *
 * The whole card is a single link. The stack, the authors and the date are text
 * and images inside it, never nested links.
 */
export function ArticleIndexCard({ article, avatars }: ArticleIndexCardProps) {
	const title = asText(article.data.title);
	const techs = articleTechs(article);
	const authors = articleAuthors(article);
	const publishedDate = formatArticleDate(article.data.published_date);

	return (
		<PrismicNextLink
			document={article}
			aria-label={title || undefined}
			className="article-index-card relative block aspect-[4/3] w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
		>
			{/* An empty Image field falls back to a plain block, so a card without a
			    cover keeps the 4:3 slot and its copy stays legible over it. */}
			<PrismicNextImage
				field={article.data.featured_image}
				fallbackAlt=""
				sizes="(min-width: 1400px) 30vw, (min-width: 800px) 50vw, 100vw"
				className="article-index-card-media absolute inset-0 size-full object-cover"
				fallback={
					<div className="article-index-card-media absolute inset-0 size-full bg-muted" />
				}
			/>

			{/* Two gradients cross-fading, not one gradient animating: `background-image`
			    is not interpolable, so a single layer could only cut. Both are black, so
			    no frame of the blend can brighten the image. */}
			<div
				aria-hidden="true"
				className="article-index-card-scrim-rest absolute inset-0"
			/>
			<div
				aria-hidden="true"
				className="article-index-card-scrim-hover absolute inset-0"
			/>
			<div
				aria-hidden="true"
				className="article-index-card-frame absolute inset-0 border border-foreground"
			/>

			<div className="absolute inset-0 flex flex-col p-5">
				<div className="flex items-start justify-between gap-3">
					<span className="article-index-card-info border border-foreground px-2 py-1 text-[0.625rem] font-medium tracking-[0.12em] text-foreground uppercase">
						{articleTypeLabel(article)}
					</span>

					{techs.length > 0 ? (
						<p className="article-index-card-extra text-right text-[0.625rem] font-medium tracking-[0.12em] text-accent uppercase">
							{techs.map((tech) => tech.name).join(" · ")}
						</p>
					) : null}
				</div>

				{/* `mt-auto` anchors the copy to the foot of the card: the byline row below
				    the title grows on hover, so the space can only come out of the top and
				    the title and excerpt are displaced upward rather than translated. */}
				<div className="mt-auto">
					<h3 className="article-index-card-info text-base font-semibold text-foreground">
						{title}
					</h3>

					{article.data.excerpt ? (
						<p className="article-index-card-info mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
							{article.data.excerpt}
						</p>
					) : null}

					{/* Collapsed rather than unmounted — at rest, and below 400px at every
					    state, where the card is too short to hold a byline. The authors and
					    the date are in the static HTML either way. The inner box does the
					    clipping: a `0fr` track only collapses if what sits in it can be
					    overflowed. */}
					{authors.length > 0 || publishedDate ? (
						<div className="article-index-card-expand">
							<div className="min-h-0 overflow-hidden">
								<div className="article-index-card-extra mt-4 flex items-end justify-between gap-3">
									<ArticleIndexByline authors={authors} avatars={avatars} />

									{publishedDate ? (
										<time
											dateTime={article.data.published_date ?? undefined}
											className="shrink-0 text-xs tracking-wide text-subtle"
										>
											{publishedDate}
										</time>
									) : null}
								</div>
							</div>
						</div>
					) : null}
				</div>
			</div>
		</PrismicNextLink>
	);
}

/**
 * The byline, in the two shapes the count asks for.
 *
 * One author is a single line — avatar, then "By Name" — because a name beside
 * its own face needs no second row. Several authors stack: the avatars overlap
 * into one cluster, and the names run underneath, where a horizontal line of
 * them would have wrapped into the excerpt.
 *
 * No authors renders nothing rather than an empty row, so the date keeps its
 * corner on its own.
 */
function ArticleIndexByline({
	authors,
	avatars,
}: {
	authors: ArticleRef[];
	avatars: ArticleAvatars;
}) {
	if (authors.length === 0) return null;

	if (authors.length === 1) {
		const author = authors[0];

		return (
			<p className="flex min-w-0 items-center gap-2 text-xs">
				<ArticleIndexAvatar avatar={avatars[author.id]} />
				<span className="truncate">
					<span className="text-subtle">By </span>
					<span className="text-foreground">{author.name}</span>
				</span>
			</p>
		);
	}

	return (
		<div className="min-w-0 text-xs">
			{/* Negative margin on every avatar but the first: the row reads as one
			    cluster rather than a queue, and the width it saves is width the names
			    below get to use. */}
			<div className="flex items-center">
				{authors.map((author, index) => (
					<ArticleIndexAvatar
						key={author.id}
						avatar={avatars[author.id]}
						className={index > 0 ? "-ml-2" : undefined}
					/>
				))}
			</div>

			<p className="mt-3">
				<span className="text-subtle">By </span>
				{authors.map((author, index) => (
					<Fragment key={author.id}>
						{index > 0 ? <span className="text-subtle">, </span> : null}
						<span className="text-foreground">{author.name}</span>
					</Fragment>
				))}
			</p>
		</div>
	);
}

/**
 * A round, cropped avatar with a hairline and a soft shadow, so it reads as a
 * face lifted off the cover image rather than a hole punched in it.
 *
 * An author with no avatar gets the same circle, empty — the alignment of the
 * cluster and of the line beside it does not depend on the image being filled.
 */
function ArticleIndexAvatar({
	avatar,
	className,
}: {
	avatar: ImageField | undefined;
	className?: string;
}) {
	const shape = [
		"size-7 shrink-0 rounded-full border border-foreground object-cover shadow-[0_2px_8px_rgb(0_0_0/0.55)]",
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<PrismicNextImage
			field={avatar}
			fallbackAlt=""
			sizes="32px"
			className={shape}
			fallback={<span className={`block bg-muted ${shape}`} />}
		/>
	);
}

export default ArticleIndexCard;
