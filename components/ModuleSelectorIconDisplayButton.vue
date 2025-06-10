<script setup lang="ts">
import {vOnClickOutside} from '@vueuse/components';

interface Props {
	options: {
		value: string;
		label: string;
		icon: string;
	}[];
	disabled?: boolean;
	width?: number;
	height?: number;
}

const props = withDefaults(defineProps<Props>(), {
	width: 25,
	height: 25
});

const uiManager = uiManagerStore();

const buttonWidth = props.width; // px
const buttonHeight = props.height; // px

const currentMovingModeOption = ref(props.options[0]);
const isVisibleOptions = ref(false);

const toggleOptionVisibility = () => {
	isVisibleOptions.value = !isVisibleOptions.value;
};

const onClickButton = () => {
	if (isVisibleOptions.value) {
		uiManager.removeClosingOptionEvent(closeMovingOption);
		closeMovingOption();
		return;
	}
	uiManager.executeClosingOptionEvents();
	toggleOptionVisibility();
	uiManager.registerClosingOptionEvent(closeMovingOption);
};

const onClickOption = (option: { value: string; label: string; icon: string }) => {
	uiManager.removeClosingOptionEvent(closeMovingOption);
	currentMovingModeOption.value = option;
	isVisibleOptions.value = false;
};

const closeMovingOption = () => {
	isVisibleOptions.value = false;
};
</script>

<template>
	<div class="selector-container">
		<button class="selector-button" v-html="currentMovingModeOption.icon" @click.stop="onClickButton" :disabled="props.disabled"></button>
		<div v-if="isVisibleOptions" class="options-container" v-on-click-outside.bubble="() => isVisibleOptions = false">
			<div v-for="option of props.options" class="option-area" :key="option.value" @click.self="onClickOption(option)">
				{{ option.label }}
			</div>
		</div>
	</div>
</template>

<style scoped>
.selector-container {
	position: relative;
	user-select: none;

	.selector-button {
		width: v-bind('buttonWidth + "px"');
		height: v-bind('buttonHeight + "px"');

		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.options-container {
		position: absolute;
		bottom: v-bind(-'buttonHeight + "px"');;
		border: 1px solid #1c1c1c;
		border-radius: 5px;
		z-index: 100;
		background-color: #fff;
		width: max-content;

		.option-area {
			padding: .1rem .2rem;
			cursor: default;

			&:hover {
				background-color: #186060;
				color: #fff;
			}
		}
	}
}
</style>