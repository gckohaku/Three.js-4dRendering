export const autoPlaySettingsStore = defineStore("autoPlaySettingsStore", () => {
	const isAutoPlayMode = ref(false);
	const isPlaying = ref(false);
	const isPausing = ref(false);
	const startActionsQueue = ref<(() => void)[]>([]);
	const stopActionsQueue = ref<(() => void)[]>([]);
	const startAutoPlayTime = ref(-1);
	const totalPausedTime = ref(0);
	const startPauseTime = ref(0);
	const requestPlayingState: Ref<"none" | "start" | "pause" | "resume" | "stop"> = ref("none");

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
		startActionsQueue.value.push(action);
	}

	function startActions() {
		for (const action of startActionsQueue.value) {
			action();
		}
	}

	function setActionOnStopAutoPlay(action: () => void) {
		stopActionsQueue.value.push(action);
	}

	function stopActions() {
		for (const action of stopActionsQueue.value) {
			action();
		}
	}

	function autoPlayTimePassed(currentTime: number): number {
		if (startAutoPlayTime.value !== -1 && isPausing.value) {
			return (startPauseTime.value - startAutoPlayTime.value - totalPausedTime.value) / 1000;
		}
		return (currentTime - startAutoPlayTime.value - totalPausedTime.value) / 1000;
	}

	function resetAutoPlayTime() {
		startAutoPlayTime.value = -1;
	}

	function start(timeStamp: number) {
		if (startAutoPlayTime.value === -1) {
			startAutoPlayTime.value = timeStamp;
			startActions();
		}
		isPlaying.value = true;
		isPausing.value = false;
		totalPausedTime.value = 0;
	}

	function pause(timeStamp: number) {
		requestPlayingState.value = "none";
		isPausing.value = true;
		startPauseTime.value = timeStamp;
	}

	function resume(timeStamp: number) {
		requestPlayingState.value = "none";
		isPausing.value = false;

		const pauseDuration = timeStamp - startPauseTime.value;
		totalPausedTime.value += pauseDuration;
	}

	function stop(timeStamp: number) {
		requestPlayingState.value = "none";
		isPlaying.value = false;
		isPausing.value = false;
		totalPausedTime.value = 0;
		stopActions();
		resetAutoPlayTime();
	}

	return {
		isAutoPlayMode,
		isPlaying,
		isPausing,
		startAutoPlayTime,
		totalPausedTime,
		startPauseTime,
		requestPlayingState,
		toggleAutoPlayMode,
		togglePlaying,
		setActionOnStartAutoPlay,
		setActionOnStopAutoPlay,
		autoPlayTimePassed,
		start,
		pause,
		resume,
		stop,
	};
});
