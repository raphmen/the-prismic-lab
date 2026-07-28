import type { Metadata } from "next";
import {
	asText,
	isFilled,
	type ImageField,
	type KeyTextField,
	type RichTextField,
} from "@prismicio/client";
import { createClient } from "@/prismicio";

/**
 * The "SEO & Metadata" tab fields shared by every page type, plus an optional
 * fallback title (e.g. the document's own title) used when `meta_title` is empty.
 */
export type SeoInput = {
	meta_title?: KeyTextField;
	meta_description?: KeyTextField;
	meta_image?: ImageField;
	/** Used as the title when `meta_title` is empty (e.g. the page's own title). */
	fallbackTitle?: string | RichTextField;
	/**
	 * Used as the OG image when `meta_image` is empty, before falling back to the
	 * Settings default (e.g. an article's editorial `featured_image`).
	 */
	fallbackImage?: ImageField;
};

/**
 * Builds Next.js `Metadata` from a page's SEO tab, falling back to the values
 * configured on the Settings singleton (site name, title template, default
 * description, default OG image).
 *
 * The OG image resolves in order: `meta_image`, then `fallbackImage`, then the
 * Settings default.
 */
export async function buildMetadata(input: SeoInput): Promise<Metadata> {
	const client = createClient();
	const settings = await client.getSingle("settings");

	const siteName = settings.data.site_name || "The Prismic Lab";
	const template = settings.data.meta_title_template;

	const fallback =
		typeof input.fallbackTitle === "string"
			? input.fallbackTitle
			: input.fallbackTitle
				? asText(input.fallbackTitle)
				: "";

	const baseTitle = input.meta_title || fallback || siteName;
	const title =
		template && baseTitle !== siteName
			? template.replace("%s", baseTitle)
			: baseTitle;

	const description =
		input.meta_description || settings.data.default_meta_description || undefined;

	const ogImage = isFilled.image(input.meta_image)
		? input.meta_image
		: isFilled.image(input.fallbackImage)
			? input.fallbackImage
			: settings.data.default_og_image;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			siteName,
			images: isFilled.image(ogImage)
				? [{ url: ogImage.url, alt: ogImage.alt || siteName }]
				: [],
		},
	};
}
