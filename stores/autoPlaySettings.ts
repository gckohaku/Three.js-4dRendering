export const autoPlaySettingsStore = defineStore('autoPlaySettingsStore', () => {
	const isAutoPlay = ref(false);
	const isPlaying = ref(false);

	return {isAutoPlay, isPlaying};
});
