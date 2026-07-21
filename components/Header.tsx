import { isFilled } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { createClient } from "@/prismicio";

export async function Header() {
	const client = createClient();
	const [header, settings] = await Promise.all([
		client.getSingle("header"),
		client.getSingle("settings"),
	]);

	const siteName = settings.data.site_name || "The Prismic Lab";

	return (
		<header className="border-b border-neutral-200">
			<div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-6 px-6">
				<PrismicNextLink
					href="/"
					className="flex items-center gap-2 text-neutral-900"
					aria-label={siteName}
				>
					{isFilled.image(header.data.logo) ? (
						<PrismicNextImage
							field={header.data.logo}
							fallbackAlt=""
							className="h-8 w-auto"
						/>
					) : (
						<span className="text-base font-semibold tracking-tight">
							{siteName}
						</span>
					)}
				</PrismicNextLink>

				<nav className="flex items-center gap-6">
					{header.data.nav_links.map((link, i) => (
						<PrismicNextLink
							key={i}
							field={link}
							className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
						/>
					))}
					{header.data.ctas.map((cta, i) => (
						<PrismicNextLink
							key={i}
							field={cta}
							className="rounded-full bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
						/>
					))}
				</nav>
			</div>
		</header>
	);
}

export default Header;
