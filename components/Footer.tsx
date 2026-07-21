import { isFilled } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { createClient } from "@/prismicio";

export async function Footer() {
	const client = createClient();
	const [footer, settings] = await Promise.all([
		client.getSingle("footer"),
		client.getSingle("settings"),
	]);

	const siteName = settings.data.site_name || "The Prismic Lab";

	return (
		<footer className="mt-24 border-t border-neutral-200">
			<div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex flex-col gap-3">
					<PrismicNextLink href="/" aria-label={siteName}>
						{isFilled.image(footer.data.logo) ? (
							<PrismicNextImage
								field={footer.data.logo}
								fallbackAlt=""
								className="h-8 w-auto"
							/>
						) : (
							<span className="text-base font-semibold tracking-tight text-neutral-900">
								{siteName}
							</span>
						)}
					</PrismicNextLink>
					{footer.data.copyright ? (
						<p className="text-sm text-neutral-500">{footer.data.copyright}</p>
					) : null}
				</div>

				{footer.data.footer_links.length > 0 ? (
					<nav className="flex flex-col gap-2">
						{footer.data.footer_links.map((item, i) => (
							<PrismicNextLink
								key={i}
								field={item.link}
								className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
							>
								{item.label}
							</PrismicNextLink>
						))}
					</nav>
				) : null}

				{footer.data.social_links.length > 0 ? (
					<nav className="flex flex-col gap-2">
						{footer.data.social_links.map((item, i) => (
							<PrismicNextLink
								key={i}
								field={item.url}
								className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
							>
								{item.network || "Link"}
							</PrismicNextLink>
						))}
					</nav>
				) : null}
			</div>
		</footer>
	);
}

export default Footer;
