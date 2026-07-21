import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asText, filter } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { buildMetadata } from "@/lib/seo";
import { RichText } from "@/components/RichText";
import { ArticleList } from "@/components/ArticleList";

export default async function Page({ params }: PageProps<"/categories/[uid]">) {
	const { uid } = await params;
	const client = createClient();
	const category = await client
		.getByUID("category", uid)
		.catch(() => notFound());

	const [experiments, fixes] = await Promise.all([
		client.getAllByType("experiment", {
			filters: [filter.at("my.experiment.category", category.id)],
		}),
		client.getAllByType("fix", {
			filters: [filter.at("my.fix.category", category.id)],
		}),
	]);

	return (
		<div className="mx-auto w-full max-w-3xl px-6 py-16">
			<header className="mb-10">
				<p className="mb-2 text-xs font-medium tracking-wide text-neutral-400 uppercase">
					Category
				</p>
				<h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
					{asText(category.data.name)}
				</h1>
				<div className="mt-4 text-neutral-600">
					<RichText field={category.data.description} />
				</div>
			</header>

			<ArticleList articles={[...experiments, ...fixes]} />
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
