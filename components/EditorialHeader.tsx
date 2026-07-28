import { isFilled, type ImageField, type RichTextField } from "@prismicio/client";
import { PrismicText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { RichText } from "@/components/RichText";

export type EditorialHeaderProps = {
	title: RichTextField | null | undefined;
	description: RichTextField | null | undefined;
	featuredImage: ImageField | null | undefined;
};

/**
 * The header shared by the three index singletons (`/experiments`, `/fixes`,
 * `/categories`).
 *
 * Each part is rendered only when it is filled, and the header disappears
 * entirely when none of them are — an index page whose singleton is still empty
 * (or not published yet, hence the nullable props) opens straight on its content
 * instead of on a stray rule and a block of whitespace.
 */
export function EditorialHeader({
	title,
	description,
	featuredImage,
}: EditorialHeaderProps) {
	const hasTitle = isFilled.richText(title);
	const hasDescription = isFilled.richText(description);
	const hasImage = isFilled.image(featuredImage);

	if (!hasTitle && !hasDescription && !hasImage) return null;

	return (
		<header className="mb-10 border-b border-border pb-10">
			{hasTitle ? (
				<h1 className="text-4xl font-semibold tracking-tight text-foreground">
					<PrismicText field={title} />
				</h1>
			) : null}

			{hasDescription ? (
				<div className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
					<RichText field={description} />
				</div>
			) : null}

			{hasImage ? (
				<PrismicNextImage
					field={featuredImage}
					fallbackAlt=""
					sizes="(min-width: 1024px) 64rem, 100vw"
					loading="eager"
					fetchPriority="high"
					className="mt-8 aspect-video w-full rounded-lg border border-border object-cover"
				/>
			) : null}
		</header>
	);
}

export default EditorialHeader;
