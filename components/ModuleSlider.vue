<script setup lang="ts">
import { autoPlaySettingsStore } from '~/stores/autoPlaySettings';
import { mx_fractal_noise_float } from 'three/tsl';
import { vOnClickOutside } from '@vueuse/components';
import type { AutoPlayMovingMode } from '~/utils/defines/AutoPlayMovingMode';

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
const uiManager = uiManagerStore();

const marginStartHoldTime = ref(200);
const changingValueIntervalTime = ref(50);
const holdEventId: Ref<NodeJS.Timeout | null> = ref(null);
const isPopupParams = ref(false);
const isStarted = ref(false);
const autoPlayMovingMode: Ref<AutoPlayMovingMode> = ref("rolling");

const firstInitValue = ref(modelValue.value);
const initValue = ref(modelValue.value);
const deltaValue = ref(0);
const timeValue = ref(3); // seconds
const autoMinValue = ref(props.min);
const autoMaxValue = ref(props.max);
const firstDirection = ref<"+" | "-">("+");
const requestAnimationFrameId = ref(0);

const onPushSliderButton = (buttonSide: "right" | "left") => {
	if (autoPlaySettings.isPlaying && deltaValue.value !== 0) {
		return;
	}

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
	if (autoPlaySettings.isPlaying && deltaValue.value !== 0) {
		return;
	}

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
	if (autoPlaySettings.isAutoPlayMode) {
		initValue.value = modelValue.value;
	}
}

const onInputSlider = (e: Event) => {
	const target = e.target;
	if (!(target instanceof HTMLInputElement)) {
		console.error("target is not HTMLInputElement");
		return;
	}

	if (autoPlaySettings.isPlaying) {
		return;
	}

	initValue.value = target.value;
}

const onInputInitValue = (e: Event) => {
	const target = e.target;
	if (!(target instanceof HTMLInputElement)) {
		console.error("target is not HTMLInputElement");
		return;
	}

	if (autoPlaySettings.isPlaying && deltaValue.value !== 0) {
		return;
	}

	initValue.value = target.value;
	modelValue.value = target.value;
}

const onInputDeltaValue = (e: Event) => {
	const target = e.target;
	if (!(target instanceof HTMLInputElement)) {
		console.error("target is not HTMLInputElement");
		return;
	}

	deltaValue.value = Number(target.value);
}

const onInputTimeValue = (e: Event) => {
	const target = e.target;
	if (!(target instanceof HTMLInputElement)) {
		console.error("target is not HTMLInputElement");
		return;
	}

	timeValue.value = Number(target.value);
}

const onInputAutoMinValue = (e: Event) => {
	const target = e.target;
	if (!(target instanceof HTMLInputElement)) {
		console.error("target is not HTMLInputElement");
		return;
	}

	autoMinValue.value = target.value;
}

const onInputAutoMaxValue = (e: Event) => {
	const target = e.target;
	if (!(target instanceof HTMLInputElement)) {
		console.error("target is not HTMLInputElement");
		return;
	}

	autoMaxValue.value = target.value;
}

const onClickParamsButton = () => {
	if (isPopupParams.value) {
		uiManager.removeClosingOptionEvent(closeParamsPopup);
		closeParamsPopup();
		return;
	}

	uiManager.executeClosingOptionEvents();
	isPopupParams.value = true;
	uiManager.registerClosingOptionEvent(closeParamsPopup);
}

const closeParamsPopup = () => {
	console.log("closeParamsPopup called");
	isPopupParams.value = false;
}

const onMouseUpPlayButton = () => {
	requestAnimationFrameId.value = requestAnimationFrame((timeStamp: DOMHighResTimeStamp) => {
		if (autoPlaySettings.startAutoPlayTime === -1) {
			autoPlaySettings.startAutoPlayTime = timeStamp;
		}
		console.log(timeStamp);
		onRequestAnimationFrame(timeStamp);
	});
}

const onStopAutoPlay = () => {
	modelValue.value = initValue.value = firstInitValue.value;
	isStarted.value = false;
}

autoPlaySettings.setActionOnStartAutoPlay(onMouseUpPlayButton);
autoPlaySettings.setActionOnStopAutoPlay(onStopAutoPlay);

const onRequestAnimationFrame = (timeStamp: DOMHighResTimeStamp) => {
	if (!isStarted.value) {
		firstInitValue.value = initValue.value;
		isStarted.value = true;
	}
	if (
		!autoPlaySettings.isPlaying
		|| (autoPlayMovingMode.value !== "thereAndBackTime" && deltaValue.value === 0)
		|| (autoPlayMovingMode.value === "thereAndBackTime" && timeValue.value === 0)
	) {
		modelValue.value = initValue.value;
		return;
	}

	if (autoPlaySettings.requestPlayingState === "pause") {
		autoPlaySettings.pause(timeStamp);
	}
	else if (autoPlaySettings.requestPlayingState === "resume") {
		autoPlaySettings.resume(timeStamp);
	}
	else if (autoPlaySettings.requestPlayingState === "stop") {
		autoPlaySettings.stop(timeStamp);
		return;
	}

	const animationTime = autoPlaySettings.autoPlayTimePassed(timeStamp);
	const calculableInit = Number(initValue.value) / Number(props.step);
	const calculableDelta = Number(deltaValue.value) / Number(props.step);
	const nextValue = Math.floor(calculableInit + (calculableDelta * animationTime)) * Number(props.step);

	modelValue.value = nextValue.toFixed(props.step.includes(".") ? props.step.split(".")[1].length : 0);

	if (autoPlayMovingMode.value === "rolling") {
		if (nextValue > Number(props.max)) {
			const afterRollingValue: number = (nextValue - Number(props.min)) % (Number(props.max) - Number(props.min)) + Number(props.min);
			modelValue.value = afterRollingValue.toFixed(props.step.includes(".") ? props.step.split(".")[1].length : 0);

		}
		if (nextValue < Number(props.min)) {
			const afterRollingValue: number = (nextValue + Number(props.min)) % (Number(props.max) - Number(props.min)) - Number(props.min);
			modelValue.value = afterRollingValue.toFixed(props.step.includes(".") ? props.step.split(".")[1].length : 0);
		}
	}
	else if (autoPlayMovingMode.value === "thereAndBackDelta") {
		const currentValue = thereAndBackDeltaPosition(animationTime, Number(initValue.value), Number(autoMinValue.value), Number(autoMaxValue.value), Number(deltaValue.value));
		modelValue.value = currentValue.toFixed(props.step.includes(".") ? props.step.split(".")[1].length : 0);
	}
	else if (autoPlayMovingMode.value === "thereAndBackTime") {
		const currentValue = thereAndBackTimePosition(animationTime, Number(initValue.value), Number(autoMinValue.value), Number(autoMaxValue.value), Number(timeValue.value), firstDirection.value);
		modelValue.value = currentValue.toFixed(props.step.includes(".") ? props.step.split(".")[1].length : 0);
	}

	requestAnimationFrameId.value = requestAnimationFrame(onRequestAnimationFrame);
}

// material icons 関連の変数
const iconParams = `<span class="material-symbols-outlined">notes</span>`;
const iconLeft = `<span class="material-symbols-outlined">arrow_back</span>`;
const iconRight = `<span class="material-symbols-outlined">arrow_forward</span>`;
</script>

<template>
	<div class="module-wrapper">
		<div class="heading-container">
			<p>{{ text }}: {{ modelValue }}</p>
		</div>
		<div class="slider-container">
			<div class="slider-area">
				<button @mousedown.left="onPushSliderButton('left')" @mouseup.left="onReleaseSliderButton"
					@mouseleave="onReleaseSliderButton" v-html="iconLeft"></button>
				<input type="range" :name="props.name" :id="props.id" :min="props.min" :max="props.max"
					:step="props.step" v-model="modelValue" @mouseup="onInputSlider">
				<button @mousedown.left="onPushSliderButton('right')" @mouseup.left="onReleaseSliderButton"
					@mouseleave="onReleaseSliderButton" v-html="iconRight"></button>
			</div>



			<div class="toggle-button-container">
				<button @click.stop="onClickParamsButton" :disabled="!autoPlaySettings.isAutoPlayMode"
					v-html="iconParams"></button>

				<div class="auto-play-setting-area" v-if="autoPlaySettings.isAutoPlayMode && isPopupParams"
					v-on-click-outside.bubble="closeParamsPopup">
					<div class="init-input-area input-subgrid" title="再生時の初期値">
						<label for="init-value">init:&nbsp;</label>
						<input type="number" id="init-value" :min="min" :max="max" :step="step" v-model="initValue"
							@change="(e: Event) => onInputInitValue(e)">
					</div>
					<div v-if="autoPlayMovingMode !== 'rolling'" class="auto-min-input-area input-subgrid"
						title="自動再生の最小値">
						<label for="auto-min-value">min:&nbsp;</label>
						<input type="number" id="auto-min-value" :min="min" :max="max" :step="step"
							@change="(e: Event) => onInputAutoMinValue(e)" v-model="autoMinValue">
					</div>
					<div v-if="autoPlayMovingMode !== 'rolling'" class="auto-max-input-area input-subgrid"
						title="自動再生の最大値">
						<label for="auto-max-value">max:&nbsp;</label>
						<input type="number" id="auto-max-value" :min="min" :max="max" :step="step"
							@change="(e: Event) => onInputAutoMaxValue(e)" v-model="autoMaxValue">
					</div>
					<div v-if="autoPlayMovingMode !== 'thereAndBackTime'" class="delta-input-area input-subgrid"
						title="1秒ごとの変化量">
						<label for="delta-value">delta:&nbsp;</label>
						<input type="number" id="delta-value" :min="-99999" :max="99999" :step="step"
							@change="(e: Event) => onInputDeltaValue(e)" v-model="deltaValue">
					</div>
					<div v-if="autoPlayMovingMode === 'thereAndBackTime'" class="time-input-area input-subgrid"
						title="片道にかかる時間">
						<label for="time-value">time:&nbsp;</label>
						<input type="number" id="time-value" :min="0" :max="99999" :step="0.1"
							@change="(e: Event) => onInputTimeValue(e)" v-model="timeValue">
					</div>
					<div v-if="autoPlayMovingMode === 'thereAndBackTime'"
						class="first-direction-input-area input-subgrid" title="自動再生開始時の方向">
						<label for="first-direction">first direction:&nbsp;</label>
						<select id="first-direction" v-model="firstDirection">
							<option value="+">+</option>
							<option value="-">-</option>
						</select>

					</div>
				</div>
			</div>

			<AutoPlayMovingModeSelector class="moving-mode-selector" :disabled="!autoPlaySettings.isAutoPlayMode" v-model="autoPlayMovingMode" />
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
		position: relative;
		display: grid;
		justify-content: space-between;
		align-items: center;
		grid-template-areas: "slider gap params moving-mode";
		grid-template-columns: 1fr .25rem 1.7rem 1.7rem;

		.slider-area {
			display: flex;
			grid-area: slider;
		}

		.toggle-button-container {
			grid-area: params;

			.auto-play-setting-area {
				padding: .5rem;
				position: absolute;
				z-index: 100;
				top: 20px;
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: .25rem;
				background-color: #fff;
				border: 2px solid #1c1c1c;
				border-radius: 5px;

				.input-subgrid {
					display: grid;
					grid-template-columns: subgrid;
					grid-column: 1 / -1;

					label {
						text-wrap: nowrap;
					}
				}
			}
		}

		.moving-mode-selector {
			grid-area: moving-mode;
		}

		button, ::v-deep(button) {
			height: 1.7rem;
			width: 1.7rem;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}
</style>