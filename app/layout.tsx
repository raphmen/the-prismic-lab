import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from 'next/font/local'
import { isFilled } from "@prismicio/client";
import { PrismicPreview } from "@prismicio/next";
import { createClient, repositoryName } from "@/prismicio";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const clashDisplay = localFont({
  src: '../public/fonts/ClashDisplay-Variable.ttf',
  variable: '--font-display',
})

const geistPixel = localFont({
  src: '../public/fonts/GeistPixel-Square.ttf',
  variable: '--font-sans',
})

export async function generateMetadata(): Promise<Metadata> {
	const client = createClient();
	const settings = await client.getSingle("settings");
	const siteName = settings.data.site_name || "The Prismic Lab";

	return {
		// The per-page title (incl. the Settings `meta_title_template`) is applied
		// in `buildMetadata`; this plain title only covers pages without their own.
		title: siteName,
		description: settings.data.default_meta_description || undefined,
		openGraph: {
			siteName,
			images: isFilled.image(settings.data.default_og_image)
				? [{ url: settings.data.default_og_image.url }]
				: [],
		},
	};
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className={`${clashDisplay.variable} ${geistPixel.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col bg-background text-foreground">
				<Header />
				<main className="flex-1">{children}</main>
				<Footer />
			</body>
			<PrismicPreview repositoryName={repositoryName} />
		</html>
	);
}
