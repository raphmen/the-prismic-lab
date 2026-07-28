import { asText } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import {
	ARTICLE_TYPE_LABELS,
	articleCategories,
	formatArticleDate,
	type Article,
} from "@/lib/articles";

/**
 * The one card every article listing uses — the index pages, the author, tech
 * and category pages, and the Related slice. Changing how an article is
 * summarised anywhere means changing it here.
 *
 * It carries no `"use client"` of its own, so it renders on the server in the
 * listings that need no interaction and joins the client bundle only where a
 * Client Component imports it.
 *
 * Everything below the title is empty-safe: an article with no image, no
 * categories, no excerpt and no date still renders as a complete card rather
 * than a collapsed one.
 */
export function ArticleCard({ article }: { article: Article }) {
	const categories = articleCategories(article);
	const publishedDate = formatArticleDate(article.data.published_date);

	return (
		<PrismicNextLink
			document={article}
			className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-subtle"
		>
			{/*
			 * The bordered, muted box is the placeholder: an empty Image field falls
			 * back to a plain block of the same aspect ratio, so a card without a
			 * cover lines up with its neighbours instead of shrinking.
			 */}
			<div className="mb-4 overflow-hidden rounded-lg border border-border bg-muted">
				<PrismicNextImage
					field={article.data.featured_image}
					fallbackAlt=""
					sizes="(min-width: 640px) 24rem, 100vw"
					className="aspect-video w-full object-cover transition-opacity group-hover:opacity-90"
					fallback={<div className="aspect-video w-full" />}
				/>
			</div>

			<div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium tracking-wide uppercase">
				<span className="rounded-full border border-border px-2 py-0.5 text-foreground">
					{ARTICLE_TYPE_LABELS[article.type]}
				</span>
				{categories.map((category) => (
					<span key={category.id} className="text-subtle">
						{category.name}
					</span>
				))}
			</div>

			<h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:underline">
				{asText(article.data.title)}
			</h3>

			{article.data.excerpt ? (
				<p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
					{article.data.excerpt}
				</p>
			) : null}

			{publishedDate ? (
				<time
					dateTime={article.data.published_date ?? undefined}
					className="mt-3 pt-1 text-xs text-subtle"
				>
					{publishedDate}
				</time>
			) : null}
		</PrismicNextLink>
	);
}

export default ArticleCard;
