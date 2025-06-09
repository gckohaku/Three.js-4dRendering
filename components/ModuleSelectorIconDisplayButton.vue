<script setup lang="ts">
import {vOnClickOutside} from '@vueuse/components';

interface Props {
	options: {
		value: string;
		label: string;
		icon: string;
	}[];
}

const props = defineProps<Props>();

const buttonWidth = 25; // px
const buttonHeight = 25; // px

const currentMovingModeOption = ref(props.options[0]);
const isVisibleOptions = ref(false);

const toggleOptionVisibility = () => {
	isVisibleOptions.value = !isVisibleOptions.value;
};

const onClickButton = () => {
	toggleOptionVisibility();
};

const onClickOption = (option: { value: string; label: string; icon: string }) => {
	currentMovingModeOption.value = option;
	isVisibleOptions.value = false;
};
</script>

<template>
	<div class="selector-container">
		<button class="selector-button" v-html="currentMovingModeOption.icon" @click.stop="onClickButton"></button>
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