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

const firstInitValue = ref(modelValue.value);
const initValue = ref(modelValue.value);
const deltaValue = ref(0);
const requestAnimationFrameId = ref(0);
const startAutoPlayTime = ref(-1);

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

	nextTick(() => {
		initValue.value = modelValue.value;
	});
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
	if (autoPlaySettings.isAutoPlayMode) {
		initValue.value = modelValue.value;
	}
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

const onInputSlider = (e: Event) => {
	if (e instanceof InputEvent) {
		const target = e.target;
		if (target instanceof HTMLInputElement) {
			initValue.value = target.value;
		}
	}
}

const onInputInitValue = (e: Event) => {
	const target = e.target;
	if (!(target instanceof HTMLInputElement)) {
		console.error("target is not HTMLInputElement");
		return;
	}

	initValue.value = target.value;
	if (autoPlaySettings.isAutoPlayMode) {
		modelValue.value = target.value;
	}
}

const onInputDeltaValue = (e: Event) => {
	console.log(e.constructor.name);
	const target = e.target;
	if (!(target instanceof HTMLInputElement)) {
		console.error("target is not HTMLInputElement");
		return;
	}

	deltaValue.value = Number(target.value);
}

const onClickToggleButton = () => {
	isSliderInput.value = !isSliderInput.value;
}

const onMouseUpPlayButton = () => {
	requestAnimationFrameId.value = requestAnimationFrame((timeStamp: DOMHighResTimeStamp) => {
		startAutoPlayTime.value = timeStamp;
		initValue.value;
		onRequestAnimationFrame(timeStamp);
	});
}

autoPlaySettings.setActionOnStartAutoPlay(onMouseUpPlayButton);

const onRequestAnimationFrame = (timeStamp: DOMHighResTimeStamp) => {
	if (!autoPlaySettings.isPlaying || deltaValue.value === 0) {
		modelValue.value = initValue.value;
		return;
	}

	const animationTime = (timeStamp - startAutoPlayTime.value) / 1000;
	const calculableInit = Number(initValue.value) / Number(props.step);
	const calculableDelta = Number(deltaValue.value) / Number(props.step);
	const nextValue = Math.floor(calculableInit + (calculableDelta * animationTime)) * Number(props.step);

	modelValue.value = nextValue.toFixed(props.step.includes(".") ? props.step.split(".")[1].length : 0);

	if (props.isRolling) {
		if (nextValue > Number(props.max)) {
			const afterRollingValue: number = (nextValue - Number(props.min)) % (Number(props.max) - Number(props.min)) + Number(props.min);
			modelValue.value = afterRollingValue.toFixed(props.step.includes(".") ? props.step.split(".")[1].length : 0);

		}
		if (nextValue < Number(props.min)) {
			const afterRollingValue: number = (nextValue + Number(props.min)) % (Number(props.max) - Number(props.min)) - Number(props.min);
			modelValue.value = afterRollingValue.toFixed(props.step.includes(".") ? props.step.split(".")[1].length : 0);
		}
	}


	requestAnimationFrameId.value = requestAnimationFrame(onRequestAnimationFrame);
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
					:step="props.step" v-model="modelValue" @mouseup="onInputSlider">
				<button @mousedown.left="onPushSliderButton('right')" @mouseup.left="onReleaseSliderButton"
					@mouseleave="onReleaseSliderButton" v-html="iconRight"></button>

			</div>

			<div class="auto-play-setting-area" v-if="autoPlaySettings.isAutoPlayMode && !isSliderInput">
				<div class="number-input-area flex-row" title="再生時の初期値">
					<label for="init-value">init:&nbsp;</label>
					<input type="number" id="init-value" :min="min" :max="max" :step="step" v-model="initValue"
						@change="(e: Event) => onInputInitValue(e)">
				</div>
				<div class="delta-input-area flex-row" title="1秒ごとの変化量">
					<label for="delta-value">delta:&nbsp;</label>
					<input type="number" id="delta-value" :min="min" :max="max" :step="step"
						@change="(e: Event) => onInputDeltaValue(e)" v-model="deltaValue">
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