import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { isFilled } from "@prismicio/client";
import { PrismicPreview } from "@prismicio/next";
import { createClient, repositoryName } from "@/prismicio";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

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
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col bg-white text-neutral-800">
				<Header />
				<main className="flex-1">{children}</main>
				<Footer />
			</body>
			<PrismicPreview repositoryName={repositoryName} />
		</html>
	);
}
