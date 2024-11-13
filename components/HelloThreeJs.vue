<script setup lang="ts">
import { chain, mode } from "mathjs";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { ThreeMFLoader } from "three/examples/jsm/Addons.js";
import { makeRotate3DMatrix44 } from "~/utils/defines/MatrixUtilities";
import { Model3D } from "~/utils/defines/Model3D";
import type { ArrayOfColorRGB } from "~/utils/defines/TypeUtilities";

const moveX: Ref<number> = ref(0);
const moveY: Ref<number> = ref(0);
const moveZ: Ref<number> = ref(0);
const rotateX: Ref<number> = ref(0);
const rotateY: Ref<number> = ref(0);
const rotateZ: Ref<number> = ref(0);
const sizeX: Ref<number> = ref(0);
const sizeY: Ref<number> = ref(0);
const sizeZ: Ref<number> = ref(0);

const parallelMatrix: ComputedRef<number[][]> = computed(() => {
	return [
		[1, 0, 0, moveX.value],
		[0, 1, 0, moveY.value],
		[0, 0, 1, moveZ.value],
		[0, 0, 0, 1],
	];
});

const rotateMatrix: ComputedRef<number[][]> = computed(() => {
	return makeRotate3DMatrix44(rotateX.value, rotateY.value, rotateZ.value);
});

const sizeMatrix: ComputedRef<number[][]> = computed(() => {
	return [
		[sizeX.value, 0, 0, 0],
		[0, sizeY.value, 0, 0],
		[0, 0, sizeZ.value, 0],
		[0, 0, 0, 1],
	];
});

const transformMatrix: ComputedRef<number[][]> = computed(() => {
	return chain(parallelMatrix.value).multiply(rotateMatrix.value).multiply(sizeMatrix.value).done();
});

const threeCanvas: Ref<HTMLCanvasElement | null> = ref(null);

const myGeometry = new THREE.BufferGeometry();

const vertexes: number[][] = [
	[-50, 50, 50], // 0
	[50, 50, 50],
	[50, -50, 50],
	[-50, -50, 50],
	[-50, 50, -50],
	[50, 50, -50], // 5
	[50, -50, -50],
	[-50, -50, -50],
];

const parts: number[][] = [
	[0, 3, 1, 2],
	[1, 2, 5, 6],
	[5, 6, 4, 7],
	[4, 7, 0, 3],
	[4, 0, 5, 1],
	[3, 7, 2, 6],
];

const colors: ArrayOfColorRGB[] = [
	[255, 0, 0],
	[0, 255, 0],
	[0, 0, 255],
	[128, 128, 128],
	[0, 255, 255],
	[255, 0, 255],
];

const nextVertexes: number[][] = [
	[-60, 0, 0], // 0
	[0, 0, 0],
	[0, 30, 0],
	[60, -15, 40],
	[60, -15, -40], // 4
];

const nextParts: number[][] = [
	[0, 3, 2],
	[0, 2, 4],
	[4, 1, 0],
	[1, 3, 0],
	[2, 3, 1],
	[2, 1, 4],
];

const nextColors: ArrayOfColorRGB[] = [
	[255, 0, 0],
	[0, 255, 0],
	[0, 0, 255],
	[255, 128, 0],
	[192, 0, 192],
	[0, 192, 192],
];

const model = new Model3D();
model.setVertexes(vertexes);
model.setParts(parts, colors);

myGeometry.setAttribute("position", new THREE.BufferAttribute(model.toThreeVertexes(), 3));
myGeometry.setIndex(new THREE.BufferAttribute(model.toTrianglesIndex(), 1));
myGeometry.computeVertexNormals();

const initialize = () => {
	// 参考リンク: https://b-risk.jp/blog/2021/12/webgl_threejs/
	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(45, 1);
	camera.position.set(0, 0, 1000);

	const light = new THREE.AmbientLight(0xffffff, 1.0);
	light.position.set(50, 50, 50);

	const geometry = new THREE.BoxGeometry(300, 300, 300);
	const material = new THREE.MeshNormalMaterial();

	scene.add(light);
	const mesh = new THREE.Mesh(model.geometry, model.materialColors);
	scene.add(mesh);

	if (!threeCanvas.value) {
		throw new Error("canvasElement is null");
	}

	const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas.value, antialias: true });

	renderer.setSize(600, 600);
	renderer.render(scene, camera);

	renderer.setAnimationLoop(() => {
		update(renderer, scene, camera, mesh);
	});
};

const update = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, mesh: THREE.Mesh) => {
	const transformedModel = model.affine((new THREE.Matrix4()).set(...transformMatrix.value.flat()));
	console.log(mesh.geometry);
	mesh.geometry = transformedModel.geometry;
	mesh.geometry.computeVertexNormals();
	renderer.render(scene, camera);
};

onMounted(() => {
	initialize();
});
</script>

<template>
	<div class="page-container">
		<canvas id="canvas" ref="threeCanvas"></canvas>
		<ModuleSlider text="x" v-model="moveX" />
	</div>
</template>

<style scoped>
.page-container {
	display: flex;
	gap: 1rem;
	flex-wrap: nowrap;
}
</style>