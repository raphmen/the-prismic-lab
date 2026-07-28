import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asText, filter } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { buildMetadata } from "@/lib/seo";
import { ARTICLE_FETCH_LINKS, collectDocuments } from "@/lib/prismic";
import { RichText } from "@/components/RichText";
import { ArticleList } from "@/components/ArticleList";
import type { Article } from "@/lib/articles";

export default async function Page({ params }: PageProps<"/categories/[uid]">) {
	const { uid } = await params;
	const client = createClient();
	const category = await client
		.getByUID("category", uid)
		.catch(() => notFound());

	const articles = await collectDocuments<Article>([
		client.getAllByType("experiment", {
			filters: [filter.at("my.experiment.categories.category", category.id)],
			fetchLinks: ARTICLE_FETCH_LINKS,
		}),
		client.getAllByType("fix", {
			filters: [filter.at("my.fix.categories.category", category.id)],
			fetchLinks: ARTICLE_FETCH_LINKS,
		}),
	]);

	return (
		<div className="mx-auto w-full max-w-3xl px-6 py-16">
			<header className="mb-10">
				<p className="mb-2 text-xs font-medium tracking-wide text-subtle uppercase">
					Category
				</p>
				<h1 className="text-4xl font-semibold tracking-tight text-foreground">
					{asText(category.data.name)}
				</h1>
				<div className="mt-4 text-muted-foreground">
					<RichText field={category.data.description} />
				</div>
			</header>

			<ArticleList articles={articles} />
		</div>
	);
}

export async function generateMetadata({
	params,
}: PageProps<"/categories/[uid]">): Promise<Metadata> {
	const { uid } = await params;
	const client = createClient();
	const category = await client
		.getByUID("category", uid)
		.catch(() => notFound());

	return buildMetadata({
		meta_title: category.data.meta_title,
		meta_description: category.data.meta_description,
		meta_image: category.data.meta_image,
		fallbackTitle: category.data.name,
	});
}

export async function generateStaticParams() {
	const client = createClient();
	const categories = await client.getAllByType("category");
	return categories.map((category) => ({ uid: category.uid }));
}
