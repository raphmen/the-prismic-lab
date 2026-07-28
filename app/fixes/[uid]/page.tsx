import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asText, isFilled, type Content } from "@prismicio/client";
import { PrismicText, SliceZone } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { buildMetadata } from "@/lib/seo";

function formatDate(date: string | null) {
	if (!date) return null;
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(date));
}

export default async function Page({ params }: PageProps<"/fixes/[uid]">) {
	const { uid } = await params;
	const client = createClient();
	const fix = await client.getByUID("fix", uid).catch(() => notFound());

	const [category, author] = await Promise.all([
		isFilled.contentRelationship(fix.data.category)
			? client.getByID<Content.CategoryDocument>(fix.data.category.id)
			: null,
		isFilled.contentRelationship(fix.data.author)
			? client.getByID<Content.AuthorDocument>(fix.data.author.id)
			: null,
	]);

	const publishedDate = formatDate(fix.data.published_date);

	return (
		<article className="mx-auto w-full max-w-3xl px-6 py-16">
			<header className="mb-10 border-b border-border pb-10">
				<div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
					<span className="rounded-full bg-muted px-3 py-1 font-medium text-foreground">
						Fix
					</span>
					{category ? (
						<PrismicNextLink
							document={category}
							className="transition-colors hover:text-foreground"
						>
							{asText(category.data.name)}
						</PrismicNextLink>
					) : null}
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

				{author ? (
					<div className="mt-6 text-sm text-muted-foreground">
						<PrismicNextLink
							document={author}
							className="font-medium text-foreground transition-colors hover:text-foreground"
						>
							{asText(author.data.name)}
						</PrismicNextLink>
					</div>
				) : null}
			</header>

			<SliceZone slices={fix.data.slices} components={components} />
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
	});
}

export async function generateStaticParams() {
	const client = createClient();
	const fixes = await client.getAllByType("fix");
	return fixes.map((fix) => ({ uid: fix.uid }));
}
