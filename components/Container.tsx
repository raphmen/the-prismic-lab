import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/**
 * The horizontal measures the layout offers.
 *
 * Vertical rhythm is deliberately absent: page shells and slices each own their
 * own spacing (`py-16`, `my-8`, …), so a Container never contributes padding a
 * caller did not ask for. Pass it through `className` where you want it.
 *
 * `full` carries no gutter either — it is the outer, edge-to-edge layer, meant
 * to hold a background and a second Container inside it for the content:
 *
 *     <Container size="full" className="bg-muted">
 *       <Container size="prose">…</Container>
 *     </Container>
 */
const SIZES = {
	/** Reading measure — article bodies, prose, single-column detail pages. */
	prose: "mx-auto w-full max-w-3xl px-6",
	/** Listing measure — index pages, card grids, filter bars. */
	default: "mx-auto w-full max-w-5xl px-6",
	/** Edge to edge, no gutter. */
	full: "w-full",
} as const;

export type ContainerSize = keyof typeof SIZES;

export type ContainerProps<T extends ElementType> = {
	/**
	 * The element to render. Slices need their own semantics — `section`,
	 * `aside`, `figure` — and their `data-slice-*` attributes ride along through
	 * the rest props, so a slice needs no extra wrapper to stay a valid slice.
	 */
	as?: T;
	size?: ContainerSize;
	className?: string;
	children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "size" | "className" | "children">;

/**
 * The one place a horizontal width is decided.
 *
 * Page shells are generic — they set vertical padding and nothing else — and
 * each slice picks its own measure, so a slice can go full-bleed without its
 * template's permission.
 */
export function Container<T extends ElementType = "div">({
	as,
	size = "default",
	className,
	children,
	...rest
}: ContainerProps<T>) {
	const Component = (as ?? "div") as ElementType;
	const classes = className ? `${SIZES[size]} ${className}` : SIZES[size];

	return (
		<Component className={classes} {...rest}>
			{children}
		</Component>
	);
}

export default Container;
