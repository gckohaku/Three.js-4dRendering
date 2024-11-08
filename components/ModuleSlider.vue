<script setup lang="ts">

const modelValue = defineModel<string | number>();

interface Props {
	text: string;
	name?: string;
	id?: string;
	min?: string | number;
	max?: string | number;
	step?: string | number;
}

const props = defineProps<Props>();
</script>

<template>
	<div class="module-wrapper">
		<p>{{ text }}</p>
		<div class="slider-container">
			<button><</button>
			<input type="range" :name="name" :id="id" :min="min" :max="max" :value="modelValue" :step="step" @input="(e) => modelValue = (e.target as HTMLInputElement).value">
			<button>></button>
		</div>
	</div>
</template>

<style scoped>
/* style here */
</style>