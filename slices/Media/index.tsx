import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

/**
 * Props for `Media`.
 */
export type MediaProps = SliceComponentProps<Content.MediaSlice>;

/**
 * Component for "Media" Slices.
 */
const Media: FC<MediaProps> = ({ slice }) => {
	return (
		<figure
			data-slice-type={slice.slice_type}
			data-slice-variation={slice.variation}
			className="my-10"
		>
			{slice.variation === "video" ? (
				isFilled.embed(slice.primary.video) ? (
					<div
						className="overflow-hidden rounded-lg [&_iframe]:aspect-video [&_iframe]:w-full"
						dangerouslySetInnerHTML={{ __html: slice.primary.video.html ?? "" }}
					/>
				) : null
			) : (
				<PrismicNextImage
					field={slice.primary.image}
					fallbackAlt=""
					className="w-full rounded-lg"
				/>
			)}

			{slice.primary.caption ? (
				<figcaption className="mt-3 text-center text-sm text-neutral-500">
					{slice.primary.caption}
				</figcaption>
			) : null}
		</figure>
	);
};

export default Media;
