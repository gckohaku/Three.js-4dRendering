<script setup lang="ts">
const modelValue = defineModel<string[]>({required: true});

// const contentsList = ref(modelValue.value.map(content => content));
const isSelectedContentOfList = ref([...Array(modelValue.value.length)].map(() => false));

function onClickContent(index: number) {
	isSelectedContentOfList.value.fill(false);
	isSelectedContentOfList.value[index] = true;
}

function onClickUpButton() {
	const isSelected = isSelectedContentOfList.value;
	const index = isSelected.indexOf(true);
	if (index <= 0) {
		return;
	}
	const contents = modelValue.value;
	[contents[index], contents[index - 1]] = [contents[index - 1], contents[index]];
	[isSelected[index], isSelected[index - 1]] = [false, true];
}

function onClickDownButton() {
	const isSelected = isSelectedContentOfList.value;
	const index = isSelected.indexOf(true);
	if (index >= isSelected.length - 1) {
		console.log(index, isSelected);
		return;
	}
	const contents = modelValue.value;
	[contents[index], contents[index + 1]] = [contents[index + 1], contents[index]];
	[isSelected[index], isSelected[index + 1]] = [false, true];
}
</script>

<template>
	<div class="list-wrapper">
		<div class="list-container">
			<div v-for="(content, index) of modelValue" class="content" :class="isSelectedContentOfList[index] ? 'selected' : ''" :key="content" @click="onClickContent(index)">
				{{ content }}
			</div>
		</div>
		<div class="button-container">
			<button @click="onClickUpButton">up</button>
			<button @click="onClickDownButton">down</button>
		</div>
	</div>

</template>

<style scoped>
.list-wrapper {
	display: flex;
	align-items: end;
	gap: .25rem;
	height: fit-content;

	.list-container {
		width: 5rem;
		border: #1c1c1c 2px solid;
		border-radius: 5px;

		.content {
			padding: .1rem .25rem;

			&:hover {
				font-weight: bold;
				background-color: #e0e8ec;
			}

			&.selected {
				background-color: #d0f0ff;
			}
		}
	}

	.button-container {
		display: grid;
		gap: .25rem;

		button {
			padding: .1rem;
			outline: none;
			border-width: 1px;
			border-radius: 3px;
			background-color: #f0f8f8;

			&:hover {
				background-color: #d8e0e0;
			}

			&:active {
				background-color: #c0c8c8;
			}
		}
	}
}
</style>