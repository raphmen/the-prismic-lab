import { asText, isFilled, type Content } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

export type Article = Content.ExperimentDocument | Content.FixDocument;

export function ArticleList({ articles }: { articles: Article[] }) {
	if (articles.length === 0) {
		return <p className="text-sm text-muted-foreground">Nothing here yet.</p>;
	}

	/**
	 * The thumbnail column only exists once something in the list has an image —
	 * an all-empty list keeps its original text-only layout rather than showing a
	 * row of placeholders.
	 */
	const withThumbnails = articles.some((article) =>
		isFilled.image(article.data.featured_image),
	);

	return (
		<ul className="divide-y divide-border border-t border-border">
			{articles.map((article) => (
				<li key={article.id} className="py-6">
					<PrismicNextLink
						document={article}
						className="group flex items-start gap-5"
					>
						{withThumbnails ? (
							<div className="w-28 shrink-0 overflow-hidden rounded-md bg-muted sm:w-36">
								<PrismicNextImage
									field={article.data.featured_image}
									fallbackAlt=""
									sizes="(min-width: 640px) 9rem, 7rem"
									className="aspect-video w-full object-cover"
									fallback={<div className="aspect-video w-full" />}
								/>
							</div>
						) : null}

						<div className="min-w-0">
							<div className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-subtle uppercase">
								{article.type === "experiment" ? "Experiment" : "Fix"}
							</div>
							<h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:underline">
								{asText(article.data.title)}
							</h3>
							{article.data.excerpt ? (
								<p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
									{article.data.excerpt}
								</p>
							) : null}
						</div>
					</PrismicNextLink>
				</li>
			))}
		</ul>
	);
}

export default ArticleList;
