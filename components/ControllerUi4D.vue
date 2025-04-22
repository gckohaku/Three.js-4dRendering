<script setup lang="ts">
const moveX = defineModel<number | string>("moveX", { required: true });
const moveY = defineModel<number | string>("moveY", { required: true });
const moveZ = defineModel<number | string>("moveZ", { required: true });
const moveW = defineModel<number | string>("moveW", { required: true });
const rotateXW = defineModel<number | string>("rotateXW", { required: true });
const rotateYW = defineModel<number | string>("rotateYW", { required: true });
const rotateZW = defineModel<number | string>("rotateZW", { required: true });
const rotateXY = defineModel<number | string>("rotateXY", { required: true });
const rotateYZ = defineModel<number | string>("rotateYZ", { required: true });
const rotateXZ = defineModel<number | string>("rotateXZ", { required: true });
const sizeX = defineModel<number | string>("sizeX", { required: true });
const sizeY = defineModel<number | string>("sizeY", { required: true });
const sizeZ = defineModel<number | string>("sizeZ", { required: true });
const sizeW = defineModel<number | string>("sizeW", { required: true });

type ControllerProps = Partial<Pick<HTMLInputElement, "max" | "min" | "step">>;

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
	domParamWMax?: string;
	domParamWMin?: string;
	domParamWStep?: string;
	domParamRotateXWMax?: string;
	domParamRotateXWMin?: string;
	domParamRotateXWStep?: string;
	domParamRotateYWMax?: string;
	domParamRotateYWMin?: string;
	domParamRotateYWStep?: string;
	domParamRotateZWMax?: string;
	domParamRotateZWMin?: string;
	domParamRotateZWStep?: string;
	domParamRotateXYMax?: string;
	domParamRotateXYMin?: string;
	domParamRotateXYStep?: string;
	domParamRotateYZMax?: string;
	domParamRotateYZMin?: string;
	domParamRotateYZStep?: string;
	domParamRotateXZMax?: string;
	domParamRotateXZMin?: string;
	domParamRotateXZStep?: string;
	domParamSizeXMax?: string;
	domParamSizeXMin?: string;
	domParamSizeXStep?: string;
	domParamSizeYMax?: string;
	domParamSizeYMin?: string;
	domParamSizeYStep?: string;
	domParamSizeZMax?: string;
	domParamSizeZMin?: string;
	domParamSizeZStep?: string;
	domParamSizeWMax?: string;
	domParamSizeWMin?: string;
	domParamSizeWStep?: string;
}

const props = withDefaults(defineProps<Props>(), {
	domParamX: () => ({max: "500", min: "-500", step: "1"}),
	domParamY: () => ({max: "500", min: "-500", step: "1"}),
	domParamZ: () => ({max: "500", min: "-500", step: "1"}),
	domParamW: () => ({max: "500", min: "-500", step: "1"}),
	domParamRotateXW: () => ({max: "360", min: "-360", step: "1"}),
	domParamRotateYW: () => ({max: "360", min: "-360", step: "1"}),
	domParamRotateZW: () => ({max: "360", min: "-360", step: "1"}),
	domParamRotateXY: () => ({max: "360", min: "-360", step: "1"}),
	domParamRotateYZ: () => ({max: "360", min: "-360", step: "1"}),
	domParamRotateXZ: () => ({max: "360", min: "-360", step: "1"}),
	domParamSizeX: () => ({max: "2.0", min: "0.1", step: "0.1"}),
	domParamSizeY: () => ({max: "2.0", min: "0.1", step: "0.1"}),
	domParamSizeZ: () => ({max: "2.0", min: "0.1", step: "0.1"}),
	domParamSizeW: () => ({max: "2.0", min: "0.1", step: "0.1"}),

	domParamXMax: "500",
	domParamXMin: "-500",
	domParamXStep: "1",
	domParamYMax: "500",
	domParamYMin: "-500",
	domParamYStep: "1",
	domParamZMax: "500",
	domParamZMin: "-500",
	domParamZStep: "1",
	domParamWMax: "500",
	domParamWMin: "-500",
	domParamWStep: "1",
	domParamRotateXWMax: "360",
	domParamRotateXWMin: "-360",
	domParamRotateXWStep: "1",
	domParamRotateYWMax: "360",
	domParamRotateYWMin: "-360",
	domParamRotateYWStep: "1",
	domParamRotateZWMax: "360",
	domParamRotateZWMin: "-360",
	domParamRotateZWStep: "1",
	domParamRotateXYMax: "360",
	domParamRotateXYMin: "-360",
	domParamRotateXYStep: "1",
	domParamRotateYZMax: "360",
	domParamRotateYZMin: "-360",
	domParamRotateYZStep: "1",
	domParamRotateXZMax: "360",
	domParamRotateXZMin: "-360",
	domParamRotateXZStep: "1",
	domParamSizeXMax: "2.0",
	domParamSizeXMin: "0.1",
	domParamSizeXStep: "0.1",
	domParamSizeYMax: "2.0",
	domParamSizeYMin: "0.1",
	domParamSizeYStep: "0.1",
	domParamSizeZMax: "2.0",
	domParamSizeZMin: "0.1",
	domParamSizeZStep: "0.1",
	domParamSizeWMax: "2.0",
	domParamSizeWMin: "0.1",
	domParamSizeWStep: "0.1",
});
</script>

<template>
	<div class="controller-container">
		<ModuleSlider text="x" :max="domParamXMax" :min="domParamXMin" :step="domParamXStep" v-model="moveX" />
		<ModuleSlider text="y" :max="domParamYMax" :min="domParamYMin" :step="domParamYStep" v-model="moveY" />
		<ModuleSlider text="z" :max="domParamZMax" :min="domParamZMin" :step="domParamZStep" v-model="moveY" />
		<ModuleSlider text="w" :max="domParamWMax" :min="domParamWMin" :step="domParamWStep" v-model="moveW" />
		<ModuleSlider text="rotateXW" :max="domParamRotateXWMax" :min="domParamRotateXWMin" :step="domParamRotateXWStep" v-model="rotateXW" :isRolling="true" />
		<ModuleSlider text="rotateYW" :max="domParamRotateYWMax" :min="domParamRotateYWMin" :step="domParamRotateYWStep" v-model="rotateYW" :isRolling="true" />
		<ModuleSlider text="rotateZW" :max="domParamRotateZWMax" :min="domParamRotateZWMin" :step="domParamRotateZWStep" v-model="rotateZW" :isRolling="true" />
		<ModuleSlider text="rotateXY" :max="domParamRotateXYMax" :min="domParamRotateXYMin" :step="domParamRotateXYStep" v-model="rotateXY" :isRolling="true" />
		<ModuleSlider text="rotateYZ" :max="domParamRotateYZMax" :min="domParamRotateYZMin" :step="domParamRotateYZStep" v-model="rotateYZ" :isRolling="true" />
		<ModuleSlider text="rotateXZ" :max="domParamRotateXZMax" :min="domParamRotateXZMin" :step="domParamRotateXZStep" v-model="rotateXZ" :isRolling="true" />
		<ModuleSlider text="sizeX" :max="domParamSizeXMax" :min="domParamSizeXMin" :step="domParamSizeXStep" v-model="sizeX" />
		<ModuleSlider text="sizeY" :max="domParamSizeYMax" :min="domParamSizeYMin" :step="domParamSizeYStep" v-model="sizeY" />
		<ModuleSlider text="sizeZ" :max="domParamSizeZMax" :min="domParamSizeZMin" :step="domParamSizeZStep" v-model="sizeZ" />
		<ModuleSlider text="sizeW" :max="domParamSizeWMax" :min="domParamSizeWMin" :step="domParamSizeWStep" v-model="sizeW" />
	</div>
</template>

<style scoped>
.controller-container {
	display: grid;
	grid-template-columns: auto;
	height: min-content;
}
</style>