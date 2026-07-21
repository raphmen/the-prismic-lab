import { FC } from "react";
import { asText, Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `CodeSnippet`.
 */
export type CodeSnippetProps = SliceComponentProps<Content.CodeSnippetSlice>;

/**
 * Component for "Code Snippet" Slices.
 */
const CodeSnippet: FC<CodeSnippetProps> = ({ slice }) => {
	const code = asText(slice.primary.code);

	return (
		<section
			data-slice-type={slice.slice_type}
			data-slice-variation={slice.variation}
			className="my-8 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900"
		>
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
		</section>
	);
};

export default CodeSnippet;
