<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components';

const modelValue = defineModel<string>();

interface Props {
	options: {
		value: string;
		label: string;
		icon: string;
	}[];
	disabled?: boolean;
	buttonTitlePropText?: string;
}

const props = defineProps<Props>();

const uiManager = uiManagerStore();

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
	modelValue.value = option.value;
	isVisibleOptions.value = false;
};

const closeMovingOption = () => {
	isVisibleOptions.value = false;
};
</script>

<template>
	<div class="selector-container">
		<button class="selector-button" v-html="currentMovingModeOption.icon" @click.stop="onClickButton" :disabled="props.disabled" :title="props.buttonTitlePropText"></button>
		<div v-if="isVisibleOptions" class="options-container" v-on-click-outside.bubble="closeMovingOption">
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
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.options-container {
		position: absolute;
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