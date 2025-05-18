// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	modules: ["@nuxt/ui", "@nuxt/fonts", "motion-v/nuxt"],
	css: ["~/assets/css/main.css"],
	devtools: { enabled: true },
	ui: {
		theme: {
			colors: [
				"primary",
				"secondary",
				"tertiary",
				"info",
				"success",
				"warning",
				"error",
			],
		},
	},
});
