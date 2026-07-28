import { asText, type Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";

type Article = Content.ExperimentDocument | Content.FixDocument;

export function ArticleList({ articles }: { articles: Article[] }) {
	if (articles.length === 0) {
		return <p className="text-sm text-muted-foreground">Nothing here yet.</p>;
	}

	return (
		<ul className="divide-y divide-border border-t border-border">
			{articles.map((article) => (
				<li key={article.id} className="py-6">
					<PrismicNextLink document={article} className="group block">
						<div className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-subtle uppercase">
							{article.type === "experiment" ? "Experiment" : "Fix"}
						</div>
						<h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:underline">
							{asText(article.data.title)}
						</h3>
						{article.data.excerpt ? (
							<p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
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
