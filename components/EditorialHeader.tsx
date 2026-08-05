import { isFilled, type ImageField, type RichTextField } from "@prismicio/client";
import { PrismicText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { Container } from "@/components/Container";
import { RichText } from "@/components/RichText";

export type EditorialHeaderProps = {
	title: RichTextField | null | undefined;
	description: RichTextField | null | undefined;
	featuredImage: ImageField | null | undefined;
};

/**
 * The header shared by the three index singletons (`/experiments`, `/articles`,
 * `/categories`).
 *
 * Same three layers as an article's cover banner — image, gradient, copy — with
 * the copy centred in the band rather than dropped at its foot. It is full-bleed,
 * so it must be rendered *outside* a page's content Container, as a sibling of
 * it.
 *
 * `isolate` keeps the two `-z-10` layers above the page background instead of
 * behind it, and `min-h` sets the band while `items-center` puts the copy in the
 * middle of the gradient. An unfilled image simply leaves the band black.
 *
 * Each part is rendered only when it is filled, and the header disappears
 * entirely when none of them are — an index page whose singleton is still empty
 * (or not published yet, hence the nullable props) opens straight on its content
 * instead of on a stray black band.
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
		<Container
			size="full"
			className="relative isolate flex min-h-80 items-end overflow-hidden md:min-h-96"
		>
			<PrismicNextImage
				field={featuredImage}
				fallbackAlt=""
				sizes="100vw"
				loading="eager"
				fetchPriority="high"
				className="absolute inset-0 -z-10 size-full object-cover"
			/>
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 bg-linear-to-b from-black/50 via-black/70 to-black"
			/>

			<Container as="header" size="prose" className="h-full pb-4 text-center">
				{hasTitle ? (
					<h1 className="text-4xl font-semibold tracking-tight text-foreground">
						<PrismicText field={title} />
					</h1>
				) : null}

				{hasDescription ? (
					<div className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
						<RichText field={description} />
					</div>
				) : null}
			</Container>
		</Container>
	);
}

export default EditorialHeader;
