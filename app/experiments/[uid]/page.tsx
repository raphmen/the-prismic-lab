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

export default async function Page({ params }: PageProps<"/experiments/[uid]">) {
	const { uid } = await params;
	const client = createClient();
	const experiment = await client
		.getByUID("experiment", uid)
		.catch(() => notFound());

	const [category, author] = await Promise.all([
		isFilled.contentRelationship(experiment.data.category)
			? client.getByID<Content.CategoryDocument>(experiment.data.category.id)
			: null,
		isFilled.contentRelationship(experiment.data.author)
			? client.getByID<Content.AuthorDocument>(experiment.data.author.id)
			: null,
	]);

	const techs = await Promise.all(
		experiment.data.stack
			.map((item) => item.tech)
			.filter(isFilled.contentRelationship)
			.map((tech) => client.getByID<Content.TechDocument>(tech.id)),
	);

	const publishedDate = formatDate(experiment.data.published_date);

	return (
		<article className="mx-auto w-full max-w-3xl px-6 py-16">
			<header className="mb-10 border-b border-border pb-10">
				<div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
					{experiment.data.difficulty ? (
						<span className="rounded-full bg-muted px-3 py-1 font-medium text-foreground">
							{experiment.data.difficulty}
						</span>
					) : null}
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
					<PrismicText field={experiment.data.title} />
				</h1>

				{experiment.data.excerpt ? (
					<p className="mt-4 text-lg leading-8 text-muted-foreground">
						{experiment.data.excerpt}
					</p>
				) : null}

				<div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
					{author ? (
						<PrismicNextLink
							document={author}
							className="font-medium text-foreground transition-colors hover:text-foreground"
						>
							{asText(author.data.name)}
						</PrismicNextLink>
					) : null}
					{techs.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{techs.map((tech) => (
								<PrismicNextLink
									key={tech.id}
									document={tech}
									className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-subtle hover:text-foreground"
								>
									{asText(tech.data.name)}
								</PrismicNextLink>
							))}
						</div>
					) : null}
				</div>
			</header>

			<SliceZone slices={experiment.data.slices} components={components} />
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
	});
}

export async function generateStaticParams() {
	const client = createClient();
	const experiments = await client.getAllByType("experiment");
	return experiments.map((experiment) => ({ uid: experiment.uid }));
}
