export const autoPlaySettingsStore = defineStore("autoPlaySettingsStore", () => {
	const isAutoPlayMode = ref(false);
	const isPlaying = ref(false);
	const actionsQueue = ref<(() => void)[]>([]);

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

	function setActionOnStartAutoPlay(action: () => void) {
		actionsQueue.value.push(action);
	}

	function StartActions() {
		for (const action of actionsQueue.value) {
			action();
		}
	}

	return { isAutoPlayMode, isPlaying, toggleAutoPlayMode, togglePlaying, setActionOnStartAutoPlay, StartActions };
});
