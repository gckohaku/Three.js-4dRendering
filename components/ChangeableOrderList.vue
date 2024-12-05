<script setup lang="ts">
interface Props {
	contents: string[];
}

const props = defineProps<Props>();

const contentsList = ref(props.contents.map(content => content));
const isSelectedContentOfList = ref([...Array(props.contents.length)].map(() => false));

function onContentClick(index: number) {
	isSelectedContentOfList.value.fill(false);
	isSelectedContentOfList.value[index] = true;
}
</script>

<template>
	<div class="list-wrapper">
		<div class="list-container">
			<div v-for="(content, index) of contentsList" class="content" :class="isSelectedContentOfList[index] ? 'selected' : ''" :key="content" @click="onContentClick(index)">
				{{ content }}
			</div>
		</div>
		<div class="button-container">
			<button>up</button>
			<button>down</button>
		</div>
	</div>

</template>

<style scoped>
.list-wrapper {
	display: flex;
	align-items: end;
	gap: .25rem;

	.list-container {
		width: 5rem;
		border: #1c1c1c 2px solid;
		border-radius: 5px;

		.content {
			padding: .1rem .25rem;

			&:hover {
				text-decoration: underline;
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