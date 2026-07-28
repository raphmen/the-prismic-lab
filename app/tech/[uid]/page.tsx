import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asText, filter, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { buildMetadata } from "@/lib/seo";
import { ARTICLE_FETCH_LINKS, collectDocuments } from "@/lib/prismic";
import { ArticleList } from "@/components/ArticleList";

export default async function Page({ params }: PageProps<"/tech/[uid]">) {
	const { uid } = await params;
	const client = createClient();
	const tech = await client.getByUID("tech", uid).catch(() => notFound());

	const experiments = await collectDocuments([
		client.getAllByType("experiment", {
			filters: [filter.at("my.experiment.stack.tech", tech.id)],
			fetchLinks: ARTICLE_FETCH_LINKS,
		}),
	]);

	return (
		<div className="mx-auto w-full max-w-3xl px-6 py-16">
			<header className="mb-10 flex items-center gap-4">
				{isFilled.image(tech.data.logo) ? (
					<PrismicNextImage
						field={tech.data.logo}
						fallbackAlt=""
						className="h-12 w-12 object-contain"
					/>
				) : null}
				<div>
					<p className="mb-1 text-xs font-medium tracking-wide text-subtle uppercase">
						Tech
					</p>
					<h1 className="text-3xl font-semibold tracking-tight text-foreground">
						{asText(tech.data.name)}
					</h1>
				</div>
			</header>

			<h2 className="mb-4 text-sm font-medium tracking-wide text-muted-foreground uppercase">
				Experiments using {asText(tech.data.name)}
			</h2>
			<ArticleList articles={experiments} />
		</div>
	);
}

export async function generateMetadata({
	params,
}: PageProps<"/tech/[uid]">): Promise<Metadata> {
	const { uid } = await params;
	const client = createClient();
	const tech = await client.getByUID("tech", uid).catch(() => notFound());

	return buildMetadata({
		meta_title: tech.data.meta_title,
		meta_description: tech.data.meta_description,
		meta_image: tech.data.meta_image,
		fallbackTitle: tech.data.name,
	});
}

export async function generateStaticParams() {
	const client = createClient();
	const techs = await client.getAllByType("tech");
	return techs.map((tech) => ({ uid: tech.uid }));
}
