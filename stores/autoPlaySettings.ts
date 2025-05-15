export const autoPlaySettingsStore = defineStore("autoPlaySettingsStore", () => {
	const isAutoPlayMode = ref(false);
	const isPlaying = ref(false);

	const getPlayingState = computed(() => isPlaying.value);

	function toggleAutoPlayMode() {
		isAutoPlayMode.value = !isAutoPlayMode.value;
		if (!isAutoPlayMode.value) {
			isPlaying.value = false;
		}
	};

	function togglePlaying() {
		isPlaying.value = !isPlaying.value;
	};

	return { isAutoPlayMode, isPlaying, toggleAutoPlayMode, togglePlaying };
});
