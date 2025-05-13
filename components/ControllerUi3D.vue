<script setup lang="ts">
const moveX = defineModel<number | string>("moveX", { required: true });
const moveY = defineModel<number | string>("moveY", { required: true });
const moveZ = defineModel<number | string>("moveZ", { required: true });
const rotateX = defineModel<number | string>("rotateX", { required: true });
const rotateY = defineModel<number | string>("rotateY", { required: true });
const rotateZ = defineModel<number | string>("rotateZ", { required: true });
const sizeX = defineModel<number | string>("sizeX", { required: true });
const sizeY = defineModel<number | string>("sizeY", { required: true });
const sizeZ = defineModel<number | string>("sizeZ", { required: true });

interface Props {
	domParamXMax?: string;
	domParamXMin?: string;
	domParamXStep?: string;
	domParamYMax?: string;
	domParamYMin?: string;
	domParamYStep?: string;
	domParamZMax?: string;
	domParamZMin?: string;
	domParamZStep?: string;
	domParamRotateXMax?: string;
	domParamRotateXMin?: string;
	domParamRotateXStep?: string;
	domParamRotateYMax?: string;
	domParamRotateYMin?: string;
	domParamRotateYStep?: string;
	domParamRotateZMax?: string;
	domParamRotateZMin?: string;
	domParamRotateZStep?: string;
	domParamSizeXMax?: string;
	domParamSizeXMin?: string;
	domParamSizeXStep?: string;
	domParamSizeYMax?: string;
	domParamSizeYMin?: string;
	domParamSizeYStep?: string;
	domParamSizeZMax?: string;
	domParamSizeZMin?: string;
	domParamSizeZStep?: string;
}

const props = withDefaults(defineProps<Props>(), {
	domParamXMax: "500",
	domParamXMin: "-500",
	domParamXStep: "1",
	domParamYMax: "500",
	domParamYMin: "-500",
	domParamYStep: "1",
	domParamZMax: "500",
	domParamZMin: "-500",
	domParamZStep: "1",
	domParamRotateXMax: "360",
	domParamRotateXMin: "-360",
	domParamRotateXStep: "1",
	domParamRotateYMax: "360",
	domParamRotateYMin: "-360",
	domParamRotateYStep: "1",
	domParamRotateZMax: "360",
	domParamRotateZMin: "-360",
	domParamRotateZStep: "1",
	domParamSizeXMax: "2.0",
	domParamSizeXMin: "0.1",
	domParamSizeXStep: "0.1",
	domParamSizeYMax: "2.0",
	domParamSizeYMin: "0.1",
	domParamSizeYStep: "0.1",
	domParamSizeZMax: "2.0",
	domParamSizeZMin: "0.1",
	domParamSizeZStep: "0.1",
});

console.log(props.domParamSizeXStep);
console.log(props.domParamSizeYStep);
console.log(props.domParamSizeZStep);
</script>

<template>
	<div class="controller-container">
		<ModuleSlider text="x" :max="domParamXMax" :min="domParamXMin" :step="domParamXStep" v-model="moveX" />
		<ModuleSlider text="y" :max="domParamYMax" :min="domParamYMin" :step="domParamYStep" v-model="moveY" />
		<ModuleSlider text="z" :max="domParamZMax" :min="domParamZMin" :step="domParamZStep" v-model="moveZ" />
		<ModuleSlider text="rotateX" :max="domParamRotateXMax" :min="domParamRotateXMin" :step="domParamRotateXStep" v-model="rotateX" :isRolling="true" />
		<ModuleSlider text="rotateY" :max="domParamRotateYMax" :min="domParamRotateYMin" :step="domParamRotateYStep" v-model="rotateY" :isRolling="true" />
		<ModuleSlider text="rotateZ" :max="domParamRotateZMax" :min="domParamRotateZMin" :step="domParamRotateZStep" v-model="rotateZ" :isRolling="true" />
		<ModuleSlider text="sizeX" :max="domParamSizeXMax" :min="domParamSizeXMin" :step="domParamSizeXStep" v-model="sizeX" />
		<ModuleSlider text="sizeY" :max="domParamSizeYMax" :min="domParamSizeYMin" :step="domParamSizeYStep" v-model="sizeY" />
		<ModuleSlider text="sizeZ" :max="domParamSizeZMax" :min="domParamSizeZMin" :step="domParamSizeZStep" v-model="sizeZ" />
	</div>
</template>

<style scoped>
.controller-container {
	display: grid;
	grid-template-columns: auto;
	height: min-content;
}
</style>