export const autoPlaySettingsStore = defineStore("autoPlaySettingsStore", () => {
	const isAutoPlayMode = ref(false);
	const isPlaying = ref(false);
	const actionsQueue = ref<(() => void)[]>([]);
	const startAutoPlayTime = ref(-1);
	const totalPausedTime = ref(0);

	const getPlayingState = computed(() => isPlaying.value);

	function toggleAutoPlayMode() {
		isAutoPlayMode.value = !isAutoPlayMode.value;
		if (!isAutoPlayMode.value) {
			isPlaying.value = false;
			resetAutoPlayTime();
		}
	}

	function togglePlaying() {
		isPlaying.value = !isPlaying.value;
	}

	function setActionOnStartAutoPlay(action: () => void) {
		actionsQueue.value.push(action);
	}

	function StartActions() {
		for (const action of actionsQueue.value) {
			action();
		}
	}

	function autoPlayTimePassed(currentTime: number): number {
		return (currentTime - startAutoPlayTime.value - totalPausedTime.value) / 1000;
	}

	function resetAutoPlayTime() {
		startAutoPlayTime.value = -1;
	}

	return { isAutoPlayMode, isPlaying, startAutoPlayTime, totalPausedTime, toggleAutoPlayMode, togglePlaying, setActionOnStartAutoPlay, StartActions, autoPlayTimePassed };
});
