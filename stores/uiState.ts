export const uiStateStore = defineStore("uiStateStore", () => {
	const isSomeMovingOptionsOpened = ref(false);

	function sendingMovingOptionsState(value: boolean) {
		isSomeMovingOptionsOpened.value = value;
	}

	return { isSomeMovingOptionsOpened, sendingMovingOptionsState };
});
