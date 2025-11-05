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
					href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
				},
			],
		},

		cdnURL: "/Three.js-4dRendering/"
	},
});
