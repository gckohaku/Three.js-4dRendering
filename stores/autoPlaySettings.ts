export const autoPlaySettingsStore = defineStore('autoPlaySettingsStore', () => {
	const isAutoPlayMode = ref(false);
	const isPlaying = ref(false);

	return {isAutoPlayMode, isPlaying};
});
