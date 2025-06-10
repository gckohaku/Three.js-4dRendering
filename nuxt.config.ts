// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	imports: {
		dirs: ["utils"],
	},

	modules: ["@pinia/nuxt", "@vueuse/nuxt"],

	app: {
		head: {
			title: "ここにタイトルを入れる",
			link: [
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
				},
			],
		},
	},
});
