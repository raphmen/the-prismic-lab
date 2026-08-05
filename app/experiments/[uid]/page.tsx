import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asText, isFilled } from "@prismicio/client";
import { PrismicText, SliceZone } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/Container";
import { ARTICLE_FETCH_LINKS } from "@/lib/prismic";
import { formatArticleDate } from "@/lib/articles";
import type { ArticleContext } from "@/slices/Related";

export default async function Page({ params }: PageProps<"/experiments/[uid]">) {
	const { uid } = await params;
	const client = createClient();
	const experiment = await client
		.getByUID("experiment", uid, { fetchLinks: ARTICLE_FETCH_LINKS })
		.catch(() => notFound());

	/**
	 * The categories, authors and stack all resolve their linked names through
	 * `ARTICLE_FETCH_LINKS` above, so each is just a map over its group.
	 *
	 * The API leaves a group out of its response entirely when the document has
	 * no items for it (including documents last saved before the group existed),
	 * so each one is read through a fallback even though its type says array.
	 */
	const categories = (experiment.data.categories ?? [])
		.map((item) => item.category)
		.filter(isFilled.contentRelationship);

	const authors = (experiment.data.authors ?? [])
		.map((item) => item.author)
		.filter(isFilled.contentRelationship);

	const techs = (experiment.data.stack ?? [])
		.map((item) => item.tech)
		.filter(isFilled.contentRelationship);

	const publishedDate = formatArticleDate(experiment.data.published_date);

	/**
	 * The article itself sets no width — the cover banner runs edge to edge, the
	 * masthead asks for the reading measure explicitly, and the Slice Zone below
	 * leaves each slice to choose its own, so a full-bleed slice is not boxed in
	 * by this template.
	 *
	 * The banner stacks the cover, a gradient and the masthead: `isolate` keeps
	 * the two `-z-10` layers above the page background instead of behind it, and
	 * `min-h` sets the band while `items-end` drops the text into the dark end of
	 * the gradient. An unfilled cover simply leaves the band black.
	 */
	return (
		<article className="pb-16">
			<Container
				size="full"
				className="relative isolate mb-16 flex min-h-108 items-end overflow-hidden md:min-h-128"
			>
				<PrismicNextImage
					field={experiment.data.featured_image}
					fallbackAlt=""
					sizes="100vw"
					loading="eager"
					fetchPriority="high"
					className="absolute inset-0 -z-10 size-full object-cover"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-10 bg-linear-to-b from-transparent via-black/70 to-black"
				/>

				<Container size="prose" className="pt-64 pb-10 border-b-1 border-accent/30">
					<header>
						<div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
							{/* Type */}
							<span className="rounded-full px-3 py-1 font-medium text-foreground border border-accent/50">
								Experiment
							</span>

							{/* Date */}
							{publishedDate ? <span>{publishedDate}</span> : null}
						</div>

						<div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
							{/* Separator */}
							<span className="font-medium text-muted-foreground">
								by
							</span>

							{/* Author */}
							{authors.length > 0 ? (
								<div className="flex flex-wrap gap-x-2 gap-y-1">
									{authors.map((author) => (
										<PrismicNextLink
											key={author.id}
											field={author}
											className="font-medium text-foreground transition-colors hover:text-foreground"
										>
											{asText(author.data?.name)}
										</PrismicNextLink>
									))}
								</div>
							) : null}
						</div>

						{/* Title */}
						<h1 className="text-4xl font-semibold tracking-tight text-foreground">
							<PrismicText field={experiment.data.title} />
						</h1>

						{/* Excerpt */}
						{experiment.data.excerpt ? (
							<p className="my-4 text-lg leading-8 text-muted-foreground">
								{experiment.data.excerpt}
							</p>
						) : null}

						{/* Conditional as a whole, for the same reason as the Stack row. */}
						{categories.length > 0 ? (
							<div className="my-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
								<span className="font-medium text-muted-foreground">
									Categories :
								</span>

								{categories.map((category) => (
									<PrismicNextLink
										key={category.id}
										field={category}
										className="transition-colors hover:underline"
									>
										{asText(category.data?.name)}
									</PrismicNextLink>
								))}
							</div>
						) : null}

						{/*
						 * The whole row is conditional, not just the chips inside it — an
						 * experiment without a stack renders no "Stack :" caption and no
						 * margin, instead of an empty labelled row.
						 */}
						{techs.length > 0 ? (
							<div className="my-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
								<span className="font-medium text-muted-foreground">
									Stack :
								</span>

								<div className="flex flex-wrap gap-2">
									{techs.map((tech) => (
										<PrismicNextLink
											key={tech.id}
											field={tech}
											className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-subtle hover:text-foreground"
										>
											{asText(tech.data?.name)}
										</PrismicNextLink>
									))}
								</div>
							</div>
						) : null}
					</header>
				</Container>
			</Container>

			<SliceZone
				slices={experiment.data.slices}
				components={components}
				context={{ article: experiment } satisfies ArticleContext}
			/>
		</article>
	);
}

export async function generateMetadata({
	params,
}: PageProps<"/experiments/[uid]">): Promise<Metadata> {
	const { uid } = await params;
	const client = createClient();
	const experiment = await client
		.getByUID("experiment", uid)
		.catch(() => notFound());

	return buildMetadata({
		meta_title: experiment.data.meta_title,
		meta_description: experiment.data.meta_description || experiment.data.excerpt,
		meta_image: experiment.data.meta_image,
		fallbackTitle: experiment.data.title,
		fallbackImage: experiment.data.featured_image,
	});
}

export async function generateStaticParams() {
	const client = createClient();
	const experiments = await client.getAllByType("experiment");
	return experiments.map((experiment) => ({ uid: experiment.uid }));
}
