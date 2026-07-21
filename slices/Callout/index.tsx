import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
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

	return (
		<aside
			data-slice-type={slice.slice_type}
			data-slice-variation={slice.variation}
			className={`my-8 rounded-lg border px-5 py-4 ${style.container}`}
		>
			<p
				className={`mb-1 text-xs font-semibold tracking-wide uppercase ${style.badge}`}
			>
				{style.label}
			</p>
			<div className="[&_p:first-child]:mt-0 [&_p:last-child]:mb-0 text-neutral-700">
				<RichText field={slice.primary.content} />
			</div>
		</aside>
	);
};

export default Callout;
