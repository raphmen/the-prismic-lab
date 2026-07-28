import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asText, filter, isFilled } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { buildMetadata } from "@/lib/seo";
import { collectDocuments } from "@/lib/prismic";
import { RichText } from "@/components/RichText";
import { ArticleList, type Article } from "@/components/ArticleList";

export default async function Page({ params }: PageProps<"/authors/[uid]">) {
	const { uid } = await params;
	const client = createClient();
	const author = await client.getByUID("author", uid).catch(() => notFound());

	const articles = await collectDocuments<Article>([
		client.getAllByType("experiment", {
			filters: [filter.at("my.experiment.authors.author", author.id)],
		}),
		client.getAllByType("fix", {
			filters: [filter.at("my.fix.authors.author", author.id)],
		}),
	]);

	return (
		<div className="mx-auto w-full max-w-3xl px-6 py-16">
			<header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
				{isFilled.image(author.data.avatar) ? (
					<PrismicNextImage
						field={author.data.avatar}
						fallbackAlt=""
						className="h-20 w-20 rounded-full object-cover"
					/>
				) : null}
				<div>
					<p className="mb-1 text-xs font-medium tracking-wide text-subtle uppercase">
						Author
					</p>
					<h1 className="text-3xl font-semibold tracking-tight text-foreground">
						{asText(author.data.name)}
					</h1>
					{author.data.links.length > 0 ? (
						<div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
							{author.data.links.map((link, i) => (
								<PrismicNextLink
									key={i}
									field={link.url}
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									{link.network || "Link"}
								</PrismicNextLink>
							))}
						</div>
					) : null}
				</div>
			</header>

			{isFilled.richText(author.data.bio) ? (
				<div className="mb-12 border-b border-border pb-8 text-muted-foreground">
					<RichText field={author.data.bio} />
				</div>
			) : null}

			<ArticleList articles={articles} />
		</div>
	);
}

export async function generateMetadata({
	params,
}: PageProps<"/authors/[uid]">): Promise<Metadata> {
	const { uid } = await params;
	const client = createClient();
	const author = await client.getByUID("author", uid).catch(() => notFound());

	return buildMetadata({
		meta_title: author.data.meta_title,
		meta_description: author.data.meta_description,
		meta_image: author.data.meta_image,
		fallbackTitle: author.data.name,
	});
}

export async function generateStaticParams() {
	const client = createClient();
	const authors = await client.getAllByType("author");
	return authors.map((author) => ({ uid: author.uid }));
}
