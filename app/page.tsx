import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { buildMetadata } from "@/lib/seo";

export default async function Home() {
	const client = createClient();
	const home = await client.getSingle("homepage");

	return (
		<div className="mx-auto w-full max-w-3xl px-6 py-16">
			<SliceZone slices={home.data.slices} components={components} />
		</div>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	const client = createClient();
	const home = await client.getSingle("homepage");

	return buildMetadata({
		meta_title: home.data.meta_title,
		meta_description: home.data.meta_description,
		meta_image: home.data.meta_image,
	});
}
