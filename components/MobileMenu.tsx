"use client";

import { useEffect, useState } from "react";
import type { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";

type MobileMenuProps = {
	navLinks: Content.HeaderDocumentData["nav_links"];
	ctas: Content.HeaderDocumentData["ctas"];
};

export function MobileMenu({ navLinks, ctas }: MobileMenuProps) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!open) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};

		// The panel is hidden from `md` up, so drop the state when we cross that
		// line — otherwise the scroll lock below would outlive the visible panel.
		const desktop = window.matchMedia("(min-width: 48rem)");
		const onBreakpointChange = () => {
			if (desktop.matches) setOpen(false);
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		document.addEventListener("keydown", onKeyDown);
		desktop.addEventListener("change", onBreakpointChange);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", onKeyDown);
			desktop.removeEventListener("change", onBreakpointChange);
		};
	}, [open]);

	return (
		<div className="md:hidden">
			<button
				type="button"
				onClick={() => setOpen((isOpen) => !isOpen)}
				aria-expanded={open}
				aria-controls="mobile-menu"
				aria-label={open ? "Close menu" : "Open menu"}
				className="-mr-2 flex h-10 w-10 items-center justify-center text-foreground cursor-pointer"
			>
				<span aria-hidden="true" className="relative block h-3.5 w-5">
					<span
						className={`absolute left-0 h-px w-full bg-current transition-all duration-200 ease-out ${
							open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
						}`}
					/>
					<span
						className={`absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current transition-opacity duration-200 ease-out ${
							open ? "opacity-0" : "opacity-100"
						}`}
					/>
					<span
						className={`absolute left-0 h-px w-full bg-current transition-all duration-200 ease-out ${
							open ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0"
						}`}
					/>
				</span>
			</button>

			{open ? (
				<div
					id="mobile-menu"
					className="absolute inset-x-0 top-16 max-h-[calc(100dvh-4rem)] pt-12 animate-panel-in overflow-y-auto border-b border-border bg-background"
				>
					<nav className="flex flex-col px-6 pb-8">
						{navLinks.map((link, i) => (
							<PrismicNextLink
								key={i}
								field={link}
								onClick={() => setOpen(false)}
								className="border-b border-border py-4 text-base text-muted-foreground transition-colors hover:text-foreground"
							/>
						))}
						{ctas.map((cta, i) => (
							<PrismicNextLink
								key={i}
								field={cta}
								onClick={() => setOpen(false)}
								className="mt-6 rounded-full bg-accent px-4 py-3 text-center text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
							/>
						))}
					</nav>
				</div>
			) : null}
		</div>
	);
}

export default MobileMenu;