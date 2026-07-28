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

export default async function Page({ params }: PageProps<"/fixes/[uid]">) {
	const { uid } = await params;
	const client = createClient();
	const fix = await client
		.getByUID("fix", uid, { fetchLinks: ARTICLE_FETCH_LINKS })
		.catch(() => notFound());

	/**
	 * The categories and authors both resolve their linked names through
	 * `ARTICLE_FETCH_LINKS` above, so each is just a map over its group.
	 *
	 * The API leaves a group out of its response entirely when the document has
	 * no items for it (including documents last saved before the group existed),
	 * so each one is read through a fallback even though its type says array.
	 */
	const categories = (fix.data.categories ?? [])
		.map((item) => item.category)
		.filter(isFilled.contentRelationship);

	const authors = (fix.data.authors ?? [])
		.map((item) => item.author)
		.filter(isFilled.contentRelationship);

	const publishedDate = formatArticleDate(fix.data.published_date);

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
					field={fix.data.featured_image}
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
						<div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
							<span className="rounded-full px-3 py-1 font-medium text-foreground border border-accent/50">
								Fix
							</span>
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

						<h1 className="text-4xl font-semibold tracking-tight text-foreground">
							<PrismicText field={fix.data.title} />
						</h1>

						{fix.data.excerpt ? (
							<p className="mt-4 text-lg leading-8 text-muted-foreground">
								{fix.data.excerpt}
							</p>
						) : null}
						
						<div className="my-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
							<span className="font-medium text-muted-foreground">
								Categories :
							</span>
							{categories.map((category) => (
									<PrismicNextLink
										key={category.id}
										field={category}
										className="transition-colors  hover:underline"
									>
										{asText(category.data?.name)}
									</PrismicNextLink>
								))}

						</div>

					</header>
				</Container>
			</Container>

			<SliceZone
				slices={fix.data.slices}
				components={components}
				context={{ article: fix } satisfies ArticleContext}
			/>
		</article>
	);
}

export async function generateMetadata({
	params,
}: PageProps<"/fixes/[uid]">): Promise<Metadata> {
	const { uid } = await params;
	const client = createClient();
	const fix = await client.getByUID("fix", uid).catch(() => notFound());

	return buildMetadata({
		meta_title: fix.data.meta_title,
		meta_description: fix.data.meta_description || fix.data.excerpt,
		meta_image: fix.data.meta_image,
		fallbackTitle: fix.data.title,
		fallbackImage: fix.data.featured_image,
	});
}

export async function generateStaticParams() {
	const client = createClient();
	const fixes = await client.getAllByType("fix");
	return fixes.map((fix) => ({ uid: fix.uid }));
}
