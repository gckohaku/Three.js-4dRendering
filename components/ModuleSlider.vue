<script setup lang="ts">
import { autoPlaySettingsStore } from '~/stores/autoPlaySettings';

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

const autoPlaySettings = autoPlaySettingsStore();

const marginStartHoldTime = ref(200);
const changingValueIntervalTime = ref(50);
const holdEventId: Ref<NodeJS.Timeout | null> = ref(null);
const isSliderInput = ref(true);

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

const onInputInitValue = (e: Event) => {
	if (e instanceof InputEvent) {
		const target = e.target;
		if (target instanceof HTMLInputElement) {
			modelValue.value = target.value;
		}
	}
}

const onClickToggleButton = () => {
	isSliderInput.value = !isSliderInput.value;
}

// material icons 関連の変数
const iconToggle = `<span class="material-symbols-outlined">swap_horiz</span>`;
const iconLeft = `<span class="material-symbols-outlined">arrow_back</span>`;
const iconRight = `<span class="material-symbols-outlined">arrow_forward</span>`;
</script>

<template>
	<div class="module-wrapper">
		<div class="heading-container">
			<p>{{ text }}: {{ modelValue }}</p>
		</div>
		<div class="slider-container">
			<div class="slider-area" v-if="!autoPlaySettings.isAutoPlayMode || isSliderInput">
				<button @mousedown.left="onPushSliderButton('left')" @mouseup.left="onReleaseSliderButton"
					@mouseleave="onReleaseSliderButton" v-html="iconLeft"></button>
				<input type="range" :name="props.name" :id="props.id" :min="props.min" :max="props.max"
					:step="props.step" v-model="modelValue">
				<button @mousedown.left="onPushSliderButton('right')" @mouseup.left="onReleaseSliderButton"
					@mouseleave="onReleaseSliderButton" v-html="iconRight"></button>

			</div>

			<div class="auto-play-setting-area" v-if="autoPlaySettings.isAutoPlayMode && !isSliderInput">
				<!-- TODO: アクセシビリティをちゃんとする -->
				<div class="number-input-area flex-row">
					<label>init:&nbsp;</label>
					<input type="number" :min="min" :max="max" :step="step" @input="(e) => onInputInitValue(e)"
						v-model="modelValue">
				</div>
				<div class="delta-input-area flex-row">
					<label>delta:&nbsp;</label>
					<input type="number" value="0">
				</div>
			</div>

			<button @click="onClickToggleButton" :disabled="!autoPlaySettings.isAutoPlayMode"
				v-html="iconToggle"></button>
		</div>
	</div>
</template>

<style scoped>
.module-wrapper {

	.heading-container,
	.auto-play-setting-area {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		input {
			width: 3rem;
		}
	}

	.slider-container {
		display: flex;
		justify-content: space-between;

		.slider-area {
			display: flex;
		}

		.auto-play-setting-area {
			display: flex;
			gap: .25rem;

			.flex-row {
				display: flex;
				flex-direction: row;
			}
		}

		button {
			height: 1.5rem;
			width: 1.5rem;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}
</style>