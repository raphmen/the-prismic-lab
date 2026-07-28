import {
	createClient as baseCreateClient,
	type ClientConfig,
} from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import prismicConfig from "./prismic.config.json";

/**
 * The project's Prismic repository name.
 */
export const repositoryName = prismicConfig.repositoryName;

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * The route resolvers live in `prismic.config.json`, which the Prismic CLI keeps
 * in sync with the page types. They are sent on every API request, and Prismic
 * validates them against the queried ref: a route whose type has no *published*
 * document is rejected, and that rejection fails the whole request. So every
 * routed type needs to keep at least one published document — a publishing rule,
 * not something to work around in code.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: ClientConfig = {}) => {
	const client = baseCreateClient(repositoryName, {
		routes: prismicConfig.routes,
		fetchOptions:
			process.env.NODE_ENV === 'production'
				? { next: { tags: ['prismic'] }, cache: 'force-cache' }
				: { next: { revalidate: 5 } },
		...config,
	});

	enableAutoPreviews({ client });

	return client;
};
