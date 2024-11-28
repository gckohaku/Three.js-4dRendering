export const logTimeManagerStore = defineStore("logTimeManagerStore", () => {
	const logDate: Ref<number> = ref(Date.now());
	const currentDate: Ref<number> = ref(Date.now());
	const logIntervalMilliseconds: Ref<number> = ref(1000);

	function isPushLog(): boolean {
		if (currentDate.value - logDate.value < 1000) {
			return false;
		}

		return true;
	}

	function updateCurrentDate() {
		currentDate.value = Date.now();
	}

	function updateLogDate() {
		logDate.value = Date.now();
	}

	return { logDate, currentDate, logIntervalMilliseconds, isPushLog, updateCurrentDate, updateLogDate };
});
