<script setup lang="ts">
const moveX = defineModel<number | string>("moveX", {required: true});
const moveY = defineModel<number | string>("moveY", {required: true});
const moveZ = defineModel<number | string>("moveZ", {required: true});
const moveW = defineModel<number | string>("moveW", {required: true});
const rotateXW = defineModel<number | string>("rotateXW", {required: true});
const rotateYW = defineModel<number | string>("rotateYW", {required: true});
const rotateZW = defineModel<number | string>("rotateZW", {required: true});
const rotateXY = defineModel<number | string>("rotateXY", {required: true});
const rotateYZ = defineModel<number | string>("rotateYZ", {required: true});
const rotateXZ = defineModel<number | string>("rotateXZ", {required: true});
const sizeX = defineModel<number | string>("sizeX", {required: true});
const sizeY = defineModel<number | string>("sizeY", {required: true});
const sizeZ = defineModel<number | string>("sizeZ", {required: true});
const sizeW = defineModel<number | string>("sizeW", {required: true});
</script>

<template>
	<ModuleSlider text="x" max="300" min="-300" v-model="moveX" />
	<ModuleSlider text="y" max="300" min="-300" v-model="moveY" />
	<ModuleSlider text="z" max="300" min="-300" v-model="moveZ" />
	<ModuleSlider text="w" max="300" min="-300" v-model="moveW" />
	<ModuleSlider text="rotateXW" max="360" min="-360" v-model="rotateXW" :isRolling="true" />
	<ModuleSlider text="rotateYW" max="360" min="-360" v-model="rotateYW" :isRolling="true" />
	<ModuleSlider text="rotateZW" max="360" min="-360" v-model="rotateZW" :isRolling="true" />
	<ModuleSlider text="rotateXY" max="360" min="-360" v-model="rotateXY" :isRolling="true" />
	<ModuleSlider text="rotateYZ" max="360" min="-360" v-model="rotateYZ" :isRolling="true" />
	<ModuleSlider text="rotateXZ" max="360" min="-360" v-model="rotateXZ" :isRolling="true" />
	<ModuleSlider text="sizeX" max="2.0" min="0.1" step="0.1" v-model="sizeX" />
	<ModuleSlider text="sizeY" max="2.0" min="0.1" step="0.1" v-model="sizeY" />
	<ModuleSlider text="sizeZ" max="2.0" min="0.1" step="0.1" v-model="sizeZ" />
	<ModuleSlider text="sizeW" max="2.0" min="0.1" step="0.1" v-model="sizeW" />
</template>

<style scoped>
/* style here */
</style>