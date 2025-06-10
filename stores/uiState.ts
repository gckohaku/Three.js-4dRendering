import { e } from "mathjs";

export const uiStateStore = defineStore("uiStateStore", () => {
	const closingOptionEvents = ref<(() => void)[]>([]);

	function registerClosingOptionEvent(event: () => void) {
		closingOptionEvents.value.push(event);
	}

	function removeClosingOptionEvent(event: () => void) {
		const index = closingOptionEvents.value.indexOf(event);
		if (index !== -1) {
			closingOptionEvents.value.splice(index, 1);
		}
	}

	function executeClosingOptionEvents() {
		for (const e of closingOptionEvents.value) {
			e();
		}
		closingOptionEvents.value.splice(0);
	}

	return { closingOptionEvents, registerClosingOptionEvent, executeClosingOptionEvents, removeClosingOptionEvent };
});
