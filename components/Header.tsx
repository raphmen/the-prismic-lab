import { isFilled } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { MobileMenu } from "@/components/MobileMenu";

export async function Header() {
	const client = createClient();
	const [header, settings] = await Promise.all([
		client.getSingle("header"),
		client.getSingle("settings"),
	]);

	const siteName = settings.data.site_name || "The Prismic Lab";

	/**
	 * `z-50` is not decoration: the bar is fixed, so it is a positioned element
	 * with an automatic stacking order, and any later positioned element in the
	 * page — an article's overlay banner, a slice with its own `relative` — would
	 * otherwise paint straight over it. The mobile panel is a child, so it rides
	 * along inside this layer.
	 */
	return (
		<header className="fixed top-0 z-50 w-full bg-background">
			<div className="mx-auto flex w-full max-w-5xl py-1 items-center justify-between gap-6 px-6">
				<PrismicNextLink
					href="/"
					className="flex items-center gap-2 text-foreground"
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

				<nav className="hidden items-center gap-6 md:flex">
					{header.data.nav_links.map((link, i) => (
						<PrismicNextLink
							key={i}
							field={link}
							className="text-sm text-muted-foreground transition-colors hover:text-foreground"
						/>
					))}
					{header.data.ctas.map((cta, i) => (
						<PrismicNextLink
							key={i}
							field={cta}
							className="bg-accent px-3 py-1 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
						/>
					))}
				</nav>

				<MobileMenu
					navLinks={header.data.nav_links}
					ctas={header.data.ctas}
				/>
			</div>
		</header>
	);
}

export default Header;
