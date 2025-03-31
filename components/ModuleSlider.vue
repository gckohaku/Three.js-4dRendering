<script setup lang="ts">
import { step } from 'three/tsl';


const modelValue = defineModel<string | number>();

interface Props {
	text: string;
	name?: string;
	id?: string;
	min?: string;
	max?: string;
	step?: string;
	isRolling?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	min: "0",
	max: "100",
	step: "1",
	isRolling: false,
});

const marginStartHoldTime = ref(200);
const changingValueIntervalTime = ref(50);
const holdEventId: Ref<NodeJS.Timeout | null> = ref(null);

const onPushSliderButton = (buttonSide: "right" | "left") => {
	switch (buttonSide) {
		case "right":
			increaseValue();
			break;

		case "left":
			decreaseValue();
			break;

		default:
			throw new Error(`invalid 'buttonSide' value: expected '"right" | "left"' but got value is ${buttonSide}`);
	}

	holdEventId.value = setTimeout(() => {
		if (buttonSide === "right") {
			holdEventId.value = setInterval(increaseValue, changingValueIntervalTime.value);
		}
		else {
			holdEventId.value = setInterval(decreaseValue, changingValueIntervalTime.value);
		}
	}, marginStartHoldTime.value);
};

const onReleaseSliderButton = () => {
	clearTimeout(Number(holdEventId.value));
}

const increaseValue = () => {
	if (!props.isRolling && Number(modelValue.value) >= Number(props.max)) {
		return;
	}
	
	const numberOfStep = Number(props.step === "" ? 1 : props.step);
	const nextValue = Number(modelValue.value) + numberOfStep;
	

	if (nextValue && props.isRolling && nextValue > Number(props.max)) {
		const afterRollingValue: number = nextValue - (Number(props.max) - Number(props.min));
		modelValue.value = numberOfStep % 1 === 0 ? afterRollingValue : (Math.round(afterRollingValue / numberOfStep) * numberOfStep).toFixed(props.step.split(".")[1].length);
		return;
	}

	modelValue.value = numberOfStep % 1 === 0 ? nextValue : (Math.round(nextValue / numberOfStep) * numberOfStep).toFixed(props.step.split(".")[1].length);
}

const decreaseValue = () => {
	if (!props.isRolling && Number(modelValue.value) <= Number(props.min)) {
		return;
	}

	const numberOfStep = Number(props.step === "" ? 1 : props.step);
	const nextValue = Number(modelValue.value) - numberOfStep;

	if (nextValue && props.isRolling && nextValue < Number(props.min)) {
		const afterRollingValue: number = nextValue + (Number(props.max) - Number(props.min));
		modelValue.value = numberOfStep % 1 === 0 ? afterRollingValue : (Math.round(afterRollingValue / numberOfStep) * numberOfStep).toFixed(props.step.split(".")[1].length);
		return;
	}

	modelValue.value = numberOfStep % 1 === 0 ? nextValue : (Math.round(nextValue / numberOfStep) * numberOfStep).toFixed(props.step.split(".")[1].length);
}


</script>

<template>
	<div class="module-wrapper">
		<p>{{ text }}: {{ modelValue }}</p>
		<div class="slider-container">
			<button @mousedown.left="onPushSliderButton('left')" @mouseup.left="onReleaseSliderButton" @mouseleave="onReleaseSliderButton">&lt;</button>
			<input type="range" :name="name" :id="id" :min="min" :max="max" :step="props.step" v-model="modelValue">
			<button @mousedown.left="onPushSliderButton('right')" @mouseup.left="onReleaseSliderButton" @mouseleave="onReleaseSliderButton">&gt;</button>
		</div>
	</div>
</template>

<style scoped>
.module-wrapper {
	.slider-container {
		display: flex;
	}
}
</style>