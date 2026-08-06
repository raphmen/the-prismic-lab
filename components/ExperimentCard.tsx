import { asText, type Content } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { articleCategories, formatArticleDate } from "@/lib/articles";

export function ExperimentCard({
	experiment,
}: {
	experiment: Content.ExperimentDocument;
}) {
	const title = asText(experiment.data.title);
	const categories = articleCategories(experiment);
	const publishedDate = formatArticleDate(experiment.data.published_date);

	return (
		<PrismicNextLink
			document={experiment}
			aria-label={title || undefined}
			className="experiment-card relative block aspect-video w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
		>
			<PrismicNextImage
				field={experiment.data.featured_image}
				fallbackAlt=""
				sizes="(min-width: 1024px) 33vw, (min-width: 800px) 50vw, 100vw"
				className="experiment-card-media absolute inset-0 size-full object-cover"
				fallback={
					<div className="experiment-card-media absolute inset-0 size-full bg-muted" />
				}
			/>

			<div aria-hidden="true" className="experiment-card-wash absolute inset-0" />
			<div aria-hidden="true" className="experiment-card-scrim absolute inset-0" />
			<div
				aria-hidden="true"
				className="experiment-card-frame absolute inset-0 border border-foreground"
			/>

			{/* `mt-auto` anchors the copy to the foot of the card: the block below the
			    title grows on hover, so the space can only come out of the top and the
			    title is displaced upward rather than translated. */}
			<div className="absolute inset-0 flex flex-col p-5 sm:p-6">
				{categories.length > 0 ? (
					<p className="experiment-card-preview text-right text-[0.6875rem] font-medium tracking-[0.12em] text-accent uppercase">
						{categories.map((category) => category.name).join(" · ")}
					</p>
				) : null}

				<div className="mt-auto">
					<h3 className="experiment-card-preview text-base font-semibold text-foreground sm:text-lg">
						{title}
					</h3>

					{/* Collapsed rather than unmounted, so the excerpt and date are in the
					    static HTML at rest — and below 500px, where the tile is too short to
					    hold them, they stay collapsed at every state. The inner box does the
					    clipping: a `0fr` track collapses only if its content can be
					    overflowed. */}
					{experiment.data.excerpt || publishedDate ? (
						<div className="experiment-card-expand">
							<div className="experiment-card-detail min-h-0 overflow-hidden">
								{experiment.data.excerpt ? (
									<p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
										{experiment.data.excerpt}
									</p>
								) : null}

								{publishedDate ? (
									<time
										dateTime={experiment.data.published_date ?? undefined}
										className="mt-3 block text-xs tracking-wide text-subtle"
									>
										{publishedDate}
									</time>
								) : null}
							</div>
						</div>
					) : null}
				</div>
			</div>
		</PrismicNextLink>
	);
}

export default ExperimentCard;
