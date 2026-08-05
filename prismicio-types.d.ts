import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

type ArticleDocumentDataSlicesSlice = RichTextSlice | MediaSlice | CodeSnippetSlice | CalloutSlice | RelatedSlice

/**
 * Item in *Article → Stack*
 */
export interface ArticleDocumentDataStackItem {
	/**
	 * Tech field in *Article → Stack*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.stack[].tech
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	tech: ContentRelationshipFieldWithData<[{"id":"tech","fields":["name"]}]>;
}

/**
 * Item in *Article → Categories*
 */
export interface ArticleDocumentDataCategoriesItem {
	/**
	 * Category field in *Article → Categories*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.categories[].category
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	category: ContentRelationshipFieldWithData<[{"id":"category","fields":["name"]}]>;
}

/**
 * Item in *Article → Authors*
 */
export interface ArticleDocumentDataAuthorsItem {
	/**
	 * Author field in *Article → Authors*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.authors[].author
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	author: ContentRelationshipFieldWithData<[{"id":"author","fields":["name"]}]>;
}

/**
 * Content for Article documents
 */
interface ArticleDocumentData {
	/**
	 * Slice Zone field in *Article*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ArticleDocumentDataSlicesSlice>;
	
	/**
	 * Title field in *Article*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Excerpt field in *Article*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.excerpt
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	excerpt: prismic.KeyTextField;
	
	/**
	 * Featured Image field in *Article*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.featured_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	featured_image: prismic.ImageField<never>;
	
	/**
	 * Article Type field in *Article*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: fix
	 * - **API ID Path**: article.article_type
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	article_type: prismic.SelectField<"fix" | "news" | "tutorial", "filled">;
	
	/**
	 * Stack field in *Article*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.stack[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	stack: prismic.GroupField<Simplify<ArticleDocumentDataStackItem>>;
	
	/**
	 * Categories field in *Article*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.categories[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	categories: prismic.GroupField<Simplify<ArticleDocumentDataCategoriesItem>>;
	
	/**
	 * Authors field in *Article*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.authors[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	authors: prismic.GroupField<Simplify<ArticleDocumentDataAuthorsItem>>;
	
	/**
	 * Published Date field in *Article*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.published_date
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	published_date: prismic.DateField;/**
	 * Meta Title field in *Article*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: article.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Article*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: article.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Article*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Article document from Prismic
 *
 * - **API ID**: `article`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ArticleDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<ArticleDocumentData>, "article", Lang>;

/**
 * Content for Articles Index documents
 */
interface ArticlesIndexDocumentData {
	/**
	 * Title field in *Articles Index*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: articles_index.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Description field in *Articles Index*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: articles_index.description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Featured Image field in *Articles Index*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: articles_index.featured_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	featured_image: prismic.ImageField<never>;/**
	 * Meta Title field in *Articles Index*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: articles_index.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Articles Index*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: articles_index.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Articles Index*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: articles_index.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Articles Index document from Prismic
 *
 * - **API ID**: `articles_index`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ArticlesIndexDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<ArticlesIndexDocumentData>, "articles_index", Lang>;

/**
 * Item in *Author → Links*
 */
export interface AuthorDocumentDataLinksItem {
	/**
	 * Network field in *Author → Links*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.links[].network
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	network: prismic.SelectField<"GitHub" | "Twitter" | "LinkedIn" | "YouTube" | "Bluesky" | "Mastodon" | "Website">;
	
	/**
	 * URL field in *Author → Links*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.links[].url
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	url: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Content for Author documents
 */
interface AuthorDocumentData {
	/**
	 * Name field in *Author*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	name: prismic.RichTextField;
	
	/**
	 * Avatar field in *Author*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.avatar
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	avatar: prismic.ImageField<never>;
	
	/**
	 * Bio field in *Author*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.bio
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	bio: prismic.RichTextField;
	
	/**
	 * Links field in *Author*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.links[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	links: prismic.GroupField<Simplify<AuthorDocumentDataLinksItem>>;/**
	 * Meta Title field in *Author*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: author.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Author*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: author.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Author*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Author document from Prismic
 *
 * - **API ID**: `author`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type AuthorDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<AuthorDocumentData>, "author", Lang>;

/**
 * Content for Categories Index documents
 */
interface CategoriesIndexDocumentData {
	/**
	 * Title field in *Categories Index*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: categories_index.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Description field in *Categories Index*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: categories_index.description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Featured Image field in *Categories Index*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: categories_index.featured_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	featured_image: prismic.ImageField<never>;/**
	 * Meta Title field in *Categories Index*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: categories_index.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Categories Index*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: categories_index.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Categories Index*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: categories_index.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Categories Index document from Prismic
 *
 * - **API ID**: `categories_index`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type CategoriesIndexDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<CategoriesIndexDocumentData>, "categories_index", Lang>;

/**
 * Content for Category documents
 */
interface CategoryDocumentData {
	/**
	 * Name field in *Category*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: category.name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	name: prismic.RichTextField;
	
	/**
	 * Description field in *Category*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: category.description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;/**
	 * Meta Title field in *Category*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: category.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Category*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: category.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Category*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: category.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Category document from Prismic
 *
 * - **API ID**: `category`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type CategoryDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<CategoryDocumentData>, "category", Lang>;

type ExperimentDocumentDataSlicesSlice = RichTextSlice | MediaSlice | CodeSnippetSlice | CalloutSlice | RelatedSlice

/**
 * Item in *Experiment → Stack*
 */
export interface ExperimentDocumentDataStackItem {
	/**
	 * Tech field in *Experiment → Stack*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiment.stack[].tech
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	tech: ContentRelationshipFieldWithData<[{"id":"tech","fields":["name"]}]>;
}

/**
 * Item in *Experiment → Categories*
 */
export interface ExperimentDocumentDataCategoriesItem {
	/**
	 * Category field in *Experiment → Categories*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiment.categories[].category
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	category: ContentRelationshipFieldWithData<[{"id":"category","fields":["name"]}]>;
}

/**
 * Item in *Experiment → Authors*
 */
export interface ExperimentDocumentDataAuthorsItem {
	/**
	 * Author field in *Experiment → Authors*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiment.authors[].author
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	author: ContentRelationshipFieldWithData<[{"id":"author","fields":["name"]}]>;
}

/**
 * Content for Experiment documents
 */
interface ExperimentDocumentData {
	/**
	 * Slice Zone field in *Experiment*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiment.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ExperimentDocumentDataSlicesSlice>;
	
	/**
	 * Title field in *Experiment*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiment.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Excerpt field in *Experiment*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiment.excerpt
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	excerpt: prismic.KeyTextField;
	
	/**
	 * Featured Image field in *Experiment*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiment.featured_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	featured_image: prismic.ImageField<never>;
	
	/**
	 * Stack field in *Experiment*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiment.stack[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	stack: prismic.GroupField<Simplify<ExperimentDocumentDataStackItem>>;
	
	/**
	 * Categories field in *Experiment*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiment.categories[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	categories: prismic.GroupField<Simplify<ExperimentDocumentDataCategoriesItem>>;
	
	/**
	 * Authors field in *Experiment*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiment.authors[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	authors: prismic.GroupField<Simplify<ExperimentDocumentDataAuthorsItem>>;
	
	/**
	 * Published Date field in *Experiment*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiment.published_date
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	published_date: prismic.DateField;/**
	 * Meta Title field in *Experiment*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: experiment.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Experiment*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: experiment.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Experiment*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiment.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Experiment document from Prismic
 *
 * - **API ID**: `experiment`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ExperimentDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<ExperimentDocumentData>, "experiment", Lang>;

/**
 * Content for Experiments Index documents
 */
interface ExperimentsIndexDocumentData {
	/**
	 * Title field in *Experiments Index*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiments_index.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Description field in *Experiments Index*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiments_index.description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Featured Image field in *Experiments Index*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiments_index.featured_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	featured_image: prismic.ImageField<never>;/**
	 * Meta Title field in *Experiments Index*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: experiments_index.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Experiments Index*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: experiments_index.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Experiments Index*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: experiments_index.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Experiments Index document from Prismic
 *
 * - **API ID**: `experiments_index`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ExperimentsIndexDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<ExperimentsIndexDocumentData>, "experiments_index", Lang>;

/**
 * Item in *Footer → Footer Links*
 */
export interface FooterDocumentDataFooterLinksItem {
	/**
	 * Label field in *Footer → Footer Links*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.footer_links[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Link field in *Footer → Footer Links*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.footer_links[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Item in *Footer → Social Links*
 */
export interface FooterDocumentDataSocialLinksItem {
	/**
	 * Network field in *Footer → Social Links*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.social_links[].network
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	network: prismic.SelectField<"GitHub" | "Twitter" | "LinkedIn" | "YouTube" | "Bluesky" | "Mastodon" | "Website">;
	
	/**
	 * URL field in *Footer → Social Links*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.social_links[].url
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	url: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Content for Footer documents
 */
interface FooterDocumentData {
	/**
	 * Logo field in *Footer*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.logo
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo: prismic.ImageField<never>;
	
	/**
	 * Footer Links field in *Footer*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.footer_links[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	footer_links: prismic.GroupField<Simplify<FooterDocumentDataFooterLinksItem>>;
	
	/**
	 * Social Links field in *Footer*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.social_links[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	social_links: prismic.GroupField<Simplify<FooterDocumentDataSocialLinksItem>>;
	
	/**
	 * Copyright field in *Footer*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: footer.copyright
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	copyright: prismic.KeyTextField;
}

/**
 * Footer document from Prismic
 *
 * - **API ID**: `footer`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type FooterDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<FooterDocumentData>, "footer", Lang>;

/**
 * Content for Header documents
 */
interface HeaderDocumentData {
	/**
	 * Logo field in *Header*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: header.logo
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo: prismic.ImageField<never>;
	
	/**
	 * Navigation Links field in *Header*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: header.nav_links
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	nav_links: prismic.Repeatable<prismic.LinkField<string, string, unknown, prismic.FieldState, never>>;
	
	/**
	 * CTAs field in *Header*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: header.ctas
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	ctas: prismic.Repeatable<prismic.LinkField<string, string, unknown, prismic.FieldState, never>>;
}

/**
 * Header document from Prismic
 *
 * - **API ID**: `header`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HeaderDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<HeaderDocumentData>, "header", Lang>;

type HomepageDocumentDataSlicesSlice = RichTextSlice | MediaSlice | CalloutSlice

/**
 * Content for Homepage documents
 */
interface HomepageDocumentData {
	/**
	 * Slice Zone field in *Homepage*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<HomepageDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: homepage.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: homepage.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Homepage*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Homepage document from Prismic
 *
 * - **API ID**: `homepage`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomepageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<HomepageDocumentData>, "homepage", Lang>;

/**
 * Content for Settings documents
 */
interface SettingsDocumentData {
	/**
	 * Site Name field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.site_name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	site_name: prismic.KeyTextField;
	
	/**
	 * Meta Title Template field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.meta_title_template
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title_template: prismic.KeyTextField;
	
	/**
	 * Default Meta Description field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.default_meta_description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	default_meta_description: prismic.KeyTextField;
	
	/**
	 * Default OG Image field in *Settings*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.default_og_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	default_og_image: prismic.ImageField<never>;
}

/**
 * Settings document from Prismic
 *
 * - **API ID**: `settings`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SettingsDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<SettingsDocumentData>, "settings", Lang>;

/**
 * Content for Tech documents
 */
interface TechDocumentData {
	/**
	 * Name field in *Tech*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: tech.name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	name: prismic.RichTextField;
	
	/**
	 * Logo field in *Tech*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: tech.logo
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo: prismic.ImageField<never>;/**
	 * Meta Title field in *Tech*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: tech.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Tech*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: tech.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Tech*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: tech.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Tech document from Prismic
 *
 * - **API ID**: `tech`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type TechDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<TechDocumentData>, "tech", Lang>;

export type AllDocumentTypes = ArticleDocument | ArticlesIndexDocument | AuthorDocument | CategoriesIndexDocument | CategoryDocument | ExperimentDocument | ExperimentsIndexDocument | FooterDocument | HeaderDocument | HomepageDocument | SettingsDocument | TechDocument;

/**
 * Primary content in *Callout → Info → Primary*
 */
export interface CalloutSliceInfoPrimary {
	/**
	 * Content field in *Callout → Info → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: callout.info.primary.content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
}

/**
 * Info variation for Callout Slice
 *
 * - **API ID**: `info`
 * - **Description**: Info
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CalloutSliceInfo = prismic.SharedSliceVariation<"info", Simplify<CalloutSliceInfoPrimary>, never>;

/**
 * Primary content in *Callout → Warning → Primary*
 */
export interface CalloutSliceWarningPrimary {
	/**
	 * Content field in *Callout → Warning → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: callout.warning.primary.content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
}

/**
 * Warning variation for Callout Slice
 *
 * - **API ID**: `warning`
 * - **Description**: Warning
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CalloutSliceWarning = prismic.SharedSliceVariation<"warning", Simplify<CalloutSliceWarningPrimary>, never>;

/**
 * Primary content in *Callout → Tip → Primary*
 */
export interface CalloutSliceTipPrimary {
	/**
	 * Content field in *Callout → Tip → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: callout.tip.primary.content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
}

/**
 * Tip variation for Callout Slice
 *
 * - **API ID**: `tip`
 * - **Description**: Tip
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CalloutSliceTip = prismic.SharedSliceVariation<"tip", Simplify<CalloutSliceTipPrimary>, never>;

/**
 * Slice variation for *Callout*
 */
type CalloutSliceVariation = CalloutSliceInfo | CalloutSliceWarning | CalloutSliceTip

/**
 * Callout Shared Slice
 *
 * - **API ID**: `callout`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CalloutSlice = prismic.SharedSlice<"callout", CalloutSliceVariation>;

/**
 * Primary content in *Code Snippet → Default → Primary*
 */
export interface CodeSnippetSliceDefaultPrimary {
	/**
	 * Language field in *Code Snippet → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: code_snippet.default.primary.language
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	language: prismic.SelectField<"TypeScript" | "JavaScript" | "TSX" | "JSX" | "GLSL" | "Bash" | "JSON" | "CSS" | "HTML">;
	
	/**
	 * Filename field in *Code Snippet → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: code_snippet.default.primary.filename
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	filename: prismic.KeyTextField;
	
	/**
	 * Code field in *Code Snippet → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: code_snippet.default.primary.code
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	code: prismic.RichTextField;
}

/**
 * Default variation for Code Snippet Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CodeSnippetSliceDefault = prismic.SharedSliceVariation<"default", Simplify<CodeSnippetSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Code Snippet*
 */
type CodeSnippetSliceVariation = CodeSnippetSliceDefault

/**
 * Code Snippet Shared Slice
 *
 * - **API ID**: `code_snippet`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CodeSnippetSlice = prismic.SharedSlice<"code_snippet", CodeSnippetSliceVariation>;

/**
 * Primary content in *Media → Image → Primary*
 */
export interface MediaSliceImagePrimary {
	/**
	 * Image field in *Media → Image → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media.image.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Caption field in *Media → Image → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media.image.primary.caption
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	caption: prismic.KeyTextField;
}

/**
 * Image variation for Media Slice
 *
 * - **API ID**: `image`
 * - **Description**: Image
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MediaSliceImage = prismic.SharedSliceVariation<"image", Simplify<MediaSliceImagePrimary>, never>;

/**
 * Primary content in *Media → Video → Primary*
 */
export interface MediaSliceVideoPrimary {
	/**
	 * Video field in *Media → Video → Primary*
	 *
	 * - **Field Type**: Embed
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media.video.primary.video
	 * - **Documentation**: https://prismic.io/docs/fields/embed
	 */
	video: prismic.EmbedField
	
	/**
	 * Caption field in *Media → Video → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media.video.primary.caption
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	caption: prismic.KeyTextField;
}

/**
 * Video variation for Media Slice
 *
 * - **API ID**: `video`
 * - **Description**: Video
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MediaSliceVideo = prismic.SharedSliceVariation<"video", Simplify<MediaSliceVideoPrimary>, never>;

/**
 * Slice variation for *Media*
 */
type MediaSliceVariation = MediaSliceImage | MediaSliceVideo

/**
 * Media Shared Slice
 *
 * - **API ID**: `media`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MediaSlice = prismic.SharedSlice<"media", MediaSliceVariation>;

/**
 * Item in *Related → Manual → Primary → Items*
 */
export interface RelatedSliceManualPrimaryItemsItem {
	/**
	 * Article field in *Related → Manual → Primary → Items*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: related.manual.primary.items[].article
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	article: prismic.ContentRelationshipField<"experiment"> | prismic.ContentRelationshipField<"article">;
}

/**
 * Primary content in *Related → Manual → Primary*
 */
export interface RelatedSliceManualPrimary {
	/**
	 * Title field in *Related → Manual → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: related.manual.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Subtitle field in *Related → Manual → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: related.manual.primary.subtitle
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	subtitle: prismic.KeyTextField;
	
	/**
	 * Items field in *Related → Manual → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: related.manual.primary.items[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	items: prismic.GroupField<Simplify<RelatedSliceManualPrimaryItemsItem>>;
}

/**
 * Manual variation for Related Slice
 *
 * - **API ID**: `manual`
 * - **Description**: Manual
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RelatedSliceManual = prismic.SharedSliceVariation<"manual", Simplify<RelatedSliceManualPrimary>, never>;

/**
 * Primary content in *Related → Auto → Primary*
 */
export interface RelatedSliceAutoPrimary {
	/**
	 * Title field in *Related → Auto → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: related.auto.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Subtitle field in *Related → Auto → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: related.auto.primary.subtitle
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	subtitle: prismic.KeyTextField;
}

/**
 * Auto variation for Related Slice
 *
 * - **API ID**: `auto`
 * - **Description**: Auto
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RelatedSliceAuto = prismic.SharedSliceVariation<"auto", Simplify<RelatedSliceAutoPrimary>, never>;

/**
 * Slice variation for *Related*
 */
type RelatedSliceVariation = RelatedSliceManual | RelatedSliceAuto

/**
 * Related Shared Slice
 *
 * - **API ID**: `related`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RelatedSlice = prismic.SharedSlice<"related", RelatedSliceVariation>;

/**
 * Primary content in *Rich Text → Default → Primary*
 */
export interface RichTextSliceDefaultPrimary {
	/**
	 * Content field in *Rich Text → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: rich_text.default.primary.content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
}

/**
 * Default variation for Rich Text Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RichTextSliceDefault = prismic.SharedSliceVariation<"default", Simplify<RichTextSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Rich Text*
 */
type RichTextSliceVariation = RichTextSliceDefault

/**
 * Rich Text Shared Slice
 *
 * - **API ID**: `rich_text`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RichTextSlice = prismic.SharedSlice<"rich_text", RichTextSliceVariation>;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			ArticleDocument,
			ArticleDocumentData,
			ArticleDocumentDataSlicesSlice,
			ArticleDocumentDataStackItem,
			ArticleDocumentDataCategoriesItem,
			ArticleDocumentDataAuthorsItem,
			ArticlesIndexDocument,
			ArticlesIndexDocumentData,
			AuthorDocument,
			AuthorDocumentData,
			AuthorDocumentDataLinksItem,
			CategoriesIndexDocument,
			CategoriesIndexDocumentData,
			CategoryDocument,
			CategoryDocumentData,
			ExperimentDocument,
			ExperimentDocumentData,
			ExperimentDocumentDataSlicesSlice,
			ExperimentDocumentDataStackItem,
			ExperimentDocumentDataCategoriesItem,
			ExperimentDocumentDataAuthorsItem,
			ExperimentsIndexDocument,
			ExperimentsIndexDocumentData,
			FooterDocument,
			FooterDocumentData,
			FooterDocumentDataFooterLinksItem,
			FooterDocumentDataSocialLinksItem,
			HeaderDocument,
			HeaderDocumentData,
			HomepageDocument,
			HomepageDocumentData,
			HomepageDocumentDataSlicesSlice,
			SettingsDocument,
			SettingsDocumentData,
			TechDocument,
			TechDocumentData,
			AllDocumentTypes,
			CalloutSlice,
			CalloutSliceInfoPrimary,
			CalloutSliceWarningPrimary,
			CalloutSliceTipPrimary,
			CalloutSliceVariation,
			CalloutSliceInfo,
			CalloutSliceWarning,
			CalloutSliceTip,
			CodeSnippetSlice,
			CodeSnippetSliceDefaultPrimary,
			CodeSnippetSliceVariation,
			CodeSnippetSliceDefault,
			MediaSlice,
			MediaSliceImagePrimary,
			MediaSliceVideoPrimary,
			MediaSliceVariation,
			MediaSliceImage,
			MediaSliceVideo,
			RelatedSlice,
			RelatedSliceManualPrimaryItemsItem,
			RelatedSliceManualPrimary,
			RelatedSliceAutoPrimary,
			RelatedSliceVariation,
			RelatedSliceManual,
			RelatedSliceAuto,
			RichTextSlice,
			RichTextSliceDefaultPrimary,
			RichTextSliceVariation,
			RichTextSliceDefault
		}
	}
}