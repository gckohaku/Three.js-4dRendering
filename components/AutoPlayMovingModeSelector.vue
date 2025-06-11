<script setup lang="ts">
import { autoPlayMovingMode, isAutoPlayMovingMode, type AutoPlayMovingMode } from '~/utils/defines/AutoPlayMovingMode';
import type ModuleSelectorIconDisplayButton from './ModuleSelectorIconDisplayButton.vue';

const modelValue = defineModel<AutoPlayMovingMode>();

interface Props {
	disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	disabled: true
});

const movingMode = ref<AutoPlayMovingMode>("rolling");

const iconRolling = `<span class="material-symbols-outlined">refresh</span>`;
const letterSpacing = "letter-spacing: -5px;";
const iconArrowRangeOnly = `<span class="material-symbols-outlined"  style="${letterSpacing}">arrow_range</span>`;
const iconThereAndBackDelta = `<span>${iconArrowRangeOnly}<sub><span style="font-size: .87rem;">Δ</span></sub></span>`;
const iconThereAndBackTime = `<span>${iconArrowRangeOnly}<sub><span class="material-symbols-outlined" style="font-size: .7rem;">timer</span></sub></span>`;

const selectIconViewOptions: InstanceType<typeof ModuleSelectorIconDisplayButton>["$props"]["options"] = [
	{
		value: "rolling",
		label: "Rolling",
		icon: iconRolling
	},
	{
		value: "thereAndBackDelta",
		label: "There and Back (delta)",
		icon: iconThereAndBackDelta
	},
	{
		value: "thereAndBackTime",
		label: "There and Back (time)",
		icon: iconThereAndBackTime
	}
];

const selectedIconView = computed(() => {
	const selectedOption = selectIconViewOptions.find(option => option.value === movingMode.value);
	if (!selectedOption) {
		console.error("Selected moving mode not found in options:", movingMode.value);
		return "";
	}
	return selectedOption.icon;
});

const onSelectChange = (event: Event) => {
	const target = event.target;

	if (!(target instanceof HTMLSelectElement)) {
		console.error("Event target is not a select element.");
		return;
	}

	if (!isAutoPlayMovingMode(target.value)) {
		console.error("Invalid moving mode selected:", target.value);
		return;
	}

	movingMode.value = target.value;
};
</script>

<template>
	<ModuleSelectorIconDisplayButton :options="selectIconViewOptions" :disabled="props.disabled" v-model="modelValue" />
</template>

<style scoped>
p.flex {
	display: flex;
	flex-direction: row;
}

.test-area {
	padding: 1rem;
}

.moving-mode-icon {
	letter-spacing: -3px;
	;
}
</style>