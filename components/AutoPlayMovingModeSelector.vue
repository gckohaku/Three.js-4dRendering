<script setup lang="ts">
import { autoPlayMovingMode, isAutoPlayMovingMode, type AutoPlayMovingMode } from '~/utils/defines/AutoPlayMovingMode';

const movingMode = ref<AutoPlayMovingMode>("rolling");

const iconRolling = `<span class="material-symbols-outlined">refresh</span>`
const iconThereAndBackDelta = `<span style"position: relative;"><span class="material-symbols-outlined">arrow_range</span></span>_d`;
const iconThereAndBackTime = `<span style"position: relative;"><span class="material-symbols-outlined">arrow_range</span></span>_t`;

const selectIconViewMap = new Map<string, string>([
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
		<p>selected: <span v-html="selectedIconView"></span></p>
		<select name="" id="" @change="onSelectChange" v-model="movingMode">
			<option value="rolling">Rolling</option>
			<option value="thereAndBackDelta">There and Back (delta)</option>
			<option value="thereAndBackTime">There and Back (time)</option>
		</select>
	</div>
</template>

<style scoped>
.test-area {
	padding: 1rem;
}
</style>