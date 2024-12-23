<script setup lang="ts">
const moveX = defineModel<number | string>("moveX");
const moveY = defineModel<number | string>("moveY");
const moveZ = defineModel<number | string>("moveZ");
const moveW = defineModel<number | string>("moveW");
const rotateXW = defineModel<number | string>("rotateXW");
const rotateYW = defineModel<number | string>("rotateYW");
const rotateZW = defineModel<number | string>("rotateZW");
const rotateXY = defineModel<number | string>("rotateXY");
const rotateYZ = defineModel<number | string>("rotateYZ");
const rotateXZ = defineModel<number | string>("rotateXZ");
const sizeX = defineModel<number | string>("sizeX");
const sizeY = defineModel<number | string>("sizeY");
const sizeZ = defineModel<number | string>("sizeZ");
const sizeW = defineModel<number | string>("sizeW");
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