import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asText, isFilled } from "@prismicio/client";
import { PrismicText, SliceZone } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/Container";
import { ArticleCover } from "@/components/ArticleCover";
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
	 * The article itself sets no width — the cover and the masthead ask for the
	 * reading measure explicitly, and the Slice Zone below leaves each slice to
	 * choose its own, so a full-bleed slice is not boxed in by this template.
	 */
	return (
		<article className="py-16">
			<Container size="prose">
				<ArticleCover field={fix.data.featured_image} />

				<header className="mb-10 border-b border-border pb-10">
					<div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
						<span className="rounded-full bg-muted px-3 py-1 font-medium text-foreground">
							Fix
						</span>
						{categories.map((category) => (
							<PrismicNextLink
								key={category.id}
								field={category}
								className="transition-colors hover:text-foreground"
							>
								{asText(category.data?.name)}
							</PrismicNextLink>
						))}
						{publishedDate ? <span>{publishedDate}</span> : null}
					</div>

					<h1 className="text-4xl font-semibold tracking-tight text-foreground">
						<PrismicText field={fix.data.title} />
					</h1>

					{fix.data.excerpt ? (
						<p className="mt-4 text-lg leading-8 text-muted-foreground">
							{fix.data.excerpt}
						</p>
					) : null}

					{authors.length > 0 ? (
						<div className="mt-6 flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
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
				</header>
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
