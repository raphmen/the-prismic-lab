import type { ImageField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";

/**
 * The editorial cover shown at the top of an experiment or fix. An empty Image
 * field renders nothing at all — margin included — so the article opens on its
 * title instead of on a gap.
 */
export function ArticleCover({ field }: { field: ImageField }) {
	return (
		<PrismicNextImage
			field={field}
			fallbackAlt=""
			sizes="(min-width: 768px) 48rem, 100vw"
			loading="eager"
			fetchPriority="high"
			className="mb-10 aspect-video w-full rounded-lg object-cover"
		/>
	);
}

export default ArticleCover;
