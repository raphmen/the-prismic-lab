import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Container } from "@/components/Container";
import { RichText } from "@/components/RichText";

/**
 * Props for `Callout`.
 */
export type CalloutProps = SliceComponentProps<Content.CalloutSlice>;

const STYLES = {
	info: {
		label: "Info",
		container: "border-sky-200 bg-sky-50",
		badge: "text-sky-700",
	},
	warning: {
		label: "Warning",
		container: "border-amber-200 bg-amber-50",
		badge: "text-amber-700",
	},
	tip: {
		label: "Tip",
		container: "border-emerald-200 bg-emerald-50",
		badge: "text-emerald-700",
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
				<div className={`rounded-lg border px-5 py-4 ${style.container}`}>
					<p
						className={`mb-1 text-xs font-semibold tracking-wide uppercase ${style.badge}`}
					>
						{style.label}
					</p>
					<div className="[&_p:first-child]:mt-0 [&_p:last-child]:mb-0 text-neutral-700">
						<RichText field={slice.primary.content} />
					</div>
				</div>
			</Container>
		</Container>
	);
};

export default Callout;
