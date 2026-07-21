import { asText, type Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";

type Article = Content.ExperimentDocument | Content.FixDocument;

export function ArticleList({ articles }: { articles: Article[] }) {
	if (articles.length === 0) {
		return <p className="text-sm text-neutral-500">Nothing here yet.</p>;
	}

	return (
		<ul className="divide-y divide-neutral-200 border-t border-neutral-200">
			{articles.map((article) => (
				<li key={article.id} className="py-6">
					<PrismicNextLink document={article} className="group block">
						<div className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-neutral-400 uppercase">
							{article.type === "experiment" ? "Experiment" : "Fix"}
						</div>
						<h3 className="text-lg font-semibold tracking-tight text-neutral-900 group-hover:underline">
							{asText(article.data.title)}
						</h3>
						{article.data.excerpt ? (
							<p className="mt-1 line-clamp-2 text-sm leading-6 text-neutral-600">
								{article.data.excerpt}
							</p>
						) : null}
					</PrismicNextLink>
				</li>
			))}
		</ul>
	);
}

export default ArticleList;
