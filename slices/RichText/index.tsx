import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Container } from "@/components/Container";
import { RichText } from "@/components/RichText";

/**
 * Props for `RichText`.
 */
export type RichTextProps = SliceComponentProps<Content.RichTextSlice>;

/**
 * Component for "Rich Text" Slices.
 */
const RichTextSlice: FC<RichTextProps> = ({ slice }) => {
	return (
		<Container
			as="section"
			size="prose"
			data-slice-type={slice.slice_type}
			data-slice-variation={slice.variation}
			className="my-8"
		>
			<RichText field={slice.primary.content} />
		</Container>
	);
};

export default RichTextSlice;
