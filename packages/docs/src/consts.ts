export const SITE = {
	title: 'Documentation',
	description: 'Your website description.',
	defaultLanguage: 'en-us',
} as const;

export const OPEN_GRAPH = {
	image: {
		src: 'https://github.com/withastro/astro/blob/main/assets/social/banner-minimal.png?raw=true',
		alt:
			'astro logo on a starry expanse of space,' +
			' with a purple saturn-like planet floating in the right foreground',
	},
	twitter: 'astrodotbuild',
};

export const KNOWN_LANGUAGES = {
	English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/withastro/astro/tree/main/examples/docs`;

export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
	indexName: 'XXXXXXXXXX',
	appId: 'XXXXXXXXXX',
	apiKey: 'XXXXXXXXXX',
};

export type Sidebar = Record<
	(typeof KNOWN_LANGUAGE_CODES)[number],
	Record<string, { text: string; link: string, soon?: boolean }[]>
>;
export const SIDEBAR: Sidebar = {
	en: {
		'Start here': [
			{ text: 'Introduction', link: 'en/introduction' },
			{ text: 'Quick start', link: 'en/quick-start' },
			{ text: 'Installation', link: 'en/installation' },
		],
		'Core concepts': [
			{ text: 'SPA vs MPA', link: 'en/concepts/spa' },
			{ text: 'Frames', link: 'en/concepts/frames' },
			{ text: 'Forms', link: 'en/concepts/forms' },
			{ text: 'Stores', link: 'en/concepts/stores' },
		],
		'Guides': [
			{ text: 'Building with Frames', link: 'en/guides/building-with-frames' },
			{ text: 'Using forms', link: 'en/guides/building-with-forms' },
			{ text: 'Sharing UI state with the server ', link: 'en/guides/sharing-state', soon: true },
			{ text: 'Using the router ', link: 'en/guides/routing', soon: true },
			{ text: 'Building a SPA', link: 'en/guides/building-with-spa' },
			{ text: 'Building a SPA with React', link: 'en/guides/building-with-spa', soon: true },
			{ text: 'Building a SPA with Preact', link: 'en/guides/building-with-spa', soon: true },
			{ text: 'Building a SPA with Vue', link: 'en/guides/building-with-spa', soon: true },
			{ text: 'Building a SPA with Svelte', link: 'en/guides/building-with-spa', soon: true },
			{ text: 'Building a SPA with Solid', link: 'en/guides/building-with-spa', soon: true },
		],
	},
};
