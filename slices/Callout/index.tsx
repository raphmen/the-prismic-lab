import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Container } from "@/components/Container";
import { RichText } from "@/components/RichText";

/**
 * Props for `Callout`.
 */
export type CalloutProps = SliceComponentProps<Content.CalloutSlice>;

/**
 * Every class has to appear here in full: Tailwind scans this file as text, so
 * a class assembled at runtime (`${style.badge}/50`) generates no CSS.
 *
 * `content` reaches into the rich text with descendant selectors rather than
 * relying on inherited color — the serializer sets `text-foreground` on the
 * nodes themselves, and inheritance never beats a declaration on the element.
 */
const STYLES = {
	info: {
		label: "Info",
		container: "border-sky-300/20 bg-sky-50/10",
		badge: "text-sky-300",
		content: "[&_p]:text-sky-100 [&_li]:text-sky-100 [&_strong]:text-sky-50",
	},
	warning: {
		label: "Warning",
		container: "border-amber-300/20 bg-amber-50/10",
		badge: "text-amber-300",
		content: "[&_p]:text-amber-100 [&_li]:text-amber-100 [&_strong]:text-amber-50",
	},
	tip: {
		label: "Tip",
		container: "border-emerald-300/20 bg-emerald-50/10",
		badge: "text-emerald-300",
		content:
			"[&_p]:text-emerald-100 [&_li]:text-emerald-100 [&_strong]:text-emerald-50",
	},
} as const;

/**
 * Component for "Callout" Slices.
 */
const Callout: FC<CalloutProps> = ({ slice }) => {
	const style = STYLES[slice.variation] ?? STYLES.info;

	/**
	 * Two layers, because this slice carries a background. The outer one spans
	 * the viewport and owns nothing but the vertical rhythm; the inner one sets
	 * the measure and holds the tinted card. Moving the card's background up to
	 * the outer layer is all it takes to turn the callout into a full-bleed band.
	 */
	return (
		<Container
			as="aside"
			size="full"
			data-slice-type={slice.slice_type}
			data-slice-variation={slice.variation}
			className="my-8"
		>
			<Container size="prose">
				<div className={`rounded-lg border-2 px-5 py-4 ${style.container}`}>
					<p
						className={`mb-1 text-xs font-semibold tracking-wide uppercase ${style.badge}`}
					>
						{style.label}
					</p>
					<div
						className={`[&_p:first-child]:mt-0 [&_p:last-child]:mb-0 ${style.content}`}
					>
						<RichText field={slice.primary.content} />
					</div>
				</div>
			</Container>
		</Container>
	);
};

export default Callout;
