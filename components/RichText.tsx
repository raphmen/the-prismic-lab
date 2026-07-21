import type { ReactNode } from "react";
import type { RichTextField } from "@prismicio/client";
import { PrismicRichText, type RichTextComponents } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

/**
 * The single, project-wide serializer for Prismic Rich Text. Every node type
 * is styled here so rich text looks consistent everywhere. Always render rich
 * text through `<RichText />` rather than calling `<PrismicRichText>` directly.
 */
const components: RichTextComponents = {
	heading1: ({ children, key }) => (
		<h1
			key={key}
			className="mt-10 mb-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl"
		>
			{children}
		</h1>
	),
	heading2: ({ children, key }) => (
		<h2
			key={key}
			className="mt-10 mb-4 text-2xl font-semibold tracking-tight text-neutral-900"
		>
			{children}
		</h2>
	),
	heading3: ({ children, key }) => (
		<h3
			key={key}
			className="mt-8 mb-3 text-xl font-semibold tracking-tight text-neutral-900"
		>
			{children}
		</h3>
	),
	heading4: ({ children, key }) => (
		<h4 key={key} className="mt-6 mb-2 text-lg font-semibold text-neutral-900">
			{children}
		</h4>
	),
	heading5: ({ children, key }) => (
		<h5 key={key} className="mt-6 mb-2 text-base font-semibold text-neutral-900">
			{children}
		</h5>
	),
	heading6: ({ children, key }) => (
		<h6
			key={key}
			className="mt-6 mb-2 text-sm font-semibold tracking-wide text-neutral-900 uppercase"
		>
			{children}
		</h6>
	),
	paragraph: ({ children, key }) => (
		<p key={key} className="my-4 leading-7 text-neutral-700">
			{children}
		</p>
	),
	preformatted: ({ node, key }) => (
		<pre
			key={key}
			className="my-6 overflow-x-auto rounded-lg bg-neutral-900 p-4 font-mono text-sm leading-6 text-neutral-100"
		>
			<code>{node.text}</code>
		</pre>
	),
	strong: ({ children, key }) => (
		<strong key={key} className="font-semibold text-neutral-900">
			{children}
		</strong>
	),
	em: ({ children, key }) => (
		<em key={key} className="italic">
			{children}
		</em>
	),
	list: ({ children, key }) => (
		<ul
			key={key}
			className="my-4 list-disc space-y-2 pl-6 text-neutral-700 marker:text-neutral-400"
		>
			{children}
		</ul>
	),
	oList: ({ children, key }) => (
		<ol
			key={key}
			className="my-4 list-decimal space-y-2 pl-6 text-neutral-700 marker:text-neutral-400"
		>
			{children}
		</ol>
	),
	listItem: ({ children, key }) => (
		<li key={key} className="leading-7">
			{children}
		</li>
	),
	oListItem: ({ children, key }) => (
		<li key={key} className="leading-7">
			{children}
		</li>
	),
	hyperlink: ({ children, node, key }) => (
		<PrismicNextLink
			key={key}
			field={node.data}
			className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-2 transition-colors hover:decoration-neutral-900"
		>
			{children}
		</PrismicNextLink>
	),
	image: ({ node, key }) => (
		<figure key={key} className="my-8">
			<PrismicNextImage field={node} fallbackAlt="" className="w-full rounded-lg" />
			{node.alt ? (
				<figcaption className="mt-2 text-center text-sm text-neutral-500">
					{node.alt}
				</figcaption>
			) : null}
		</figure>
	),
	embed: ({ node, key }) => (
		<div
			key={key}
			className="my-8 overflow-hidden rounded-lg [&_iframe]:aspect-video [&_iframe]:w-full"
			dangerouslySetInnerHTML={{ __html: node.oembed.html ?? "" }}
		/>
	),
};

export type RichTextProps = {
	field: RichTextField | null | undefined;
	/** Optional per-usage overrides merged over the project defaults. */
	components?: RichTextComponents;
	fallback?: ReactNode;
};

export function RichText({ field, components: overrides, fallback }: RichTextProps) {
	return (
		<PrismicRichText
			field={field}
			components={overrides ? { ...components, ...overrides } : components}
			fallback={fallback}
		/>
	);
}

export default RichText;
