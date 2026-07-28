import { FC } from "react";
import { asText, Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Container } from "@/components/Container";

/**
 * Props for `CodeSnippet`.
 */
export type CodeSnippetProps = SliceComponentProps<Content.CodeSnippetSlice>;

/**
 * Component for "Code Snippet" Slices.
 */
const CodeSnippet: FC<CodeSnippetProps> = ({ slice }) => {
	const code = asText(slice.primary.code);

	/**
	 * Two layers, as with `Callout`: the outer one spans the viewport and carries
	 * only the vertical rhythm, the inner one sets the measure and holds the dark
	 * block. Lifting the block's background onto the outer layer is what would
	 * make the snippet a full-bleed band.
	 */
	return (
		<Container
			as="section"
			size="full"
			data-slice-type={slice.slice_type}
			data-slice-variation={slice.variation}
			className="my-8"
		>
			<Container size="prose">
				<div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
					{slice.primary.filename || slice.primary.language ? (
						<div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2 font-mono text-xs text-neutral-400">
							<span>{slice.primary.filename}</span>
							{slice.primary.language ? (
								<span className="uppercase">{slice.primary.language}</span>
							) : null}
						</div>
					) : null}
					<pre className="overflow-x-auto p-4 font-mono text-sm leading-6 text-neutral-100">
						<code>{code}</code>
					</pre>
				</div>
			</Container>
		</Container>
	);
};

export default CodeSnippet;
