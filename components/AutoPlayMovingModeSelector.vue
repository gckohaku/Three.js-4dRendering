<script setup lang="ts">
import { autoPlayMovingMode, isAutoPlayMovingMode, type AutoPlayMovingMode } from '~/utils/defines/AutoPlayMovingMode';

const movingMode = ref<AutoPlayMovingMode>("rolling");

const iconRolling = `<span class="material-symbols-outlined">refresh</span>`;
const mutualStyle = "letter-spacing: -3px;";
const iconArrowRangeOnly = `<span class="material-symbols-outlined style="${mutualStyle}">arrow_range</span>`;
const iconThereAndBackDelta = `<span>${iconArrowRangeOnly}<sub><span>Δ</span></sub></span>`;
const iconThereAndBackTime = `<span>${iconArrowRangeOnly}<sub><span class="material-symbols-outlined" style="font-size: .8rem; ${mutualStyle}">timer</span></sub>aaaaaaa</span>`;

const selectIconViewMap = new Map<AutoPlayMovingMode, string>([
	["rolling", iconRolling],
	["thereAndBackDelta", iconThereAndBackDelta],
	["thereAndBackTime", iconThereAndBackTime]
]);

const selectedIconView = computed(() => {
	return selectIconViewMap.get(movingMode.value);
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
	<div class="test-area">
		<p class="flex">selected: <span v-html="selectedIconView"></span></p>
		<select name="" id="" @change="onSelectChange" v-model="movingMode">
			<option value="rolling">Rolling</option>
			<option value="thereAndBackDelta">There and Back (delta)</option>
			<option value="thereAndBackTime">There and Back (time)</option>
		</select>
	</div>
</template>

<style scoped>
p.flex {
	display: flex;
	flex-direction: row;
}

.test-area {
	padding: 1rem;
}
</style>