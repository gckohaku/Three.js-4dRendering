export const logTimeManagerStore = defineStore("logTimeManagerStore", () => {
	const logDate: Ref<number> = ref(Date.now());
	const currentDate: Ref<number> = ref(Date.now())

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

	return { logDate, isPushLog, updateCurrentDate, updateLogDate };
});
