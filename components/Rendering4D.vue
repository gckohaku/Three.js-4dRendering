<script setup lang="ts">
import { chain, pi } from "mathjs";
import * as THREE from "three";
import { makeRotate3DMatrix44 } from "~/utils/matrixUtilities";
import { Model3D } from "~/utils/defines/Model3D";
import type { ArrayOfColorRGB, ArrayOfColorRGBA } from "~/utils/typeUtilities";
import { Model4D } from "~/utils/defines/Model4D";

const logTimeManager = logTimeManagerStore();
const rotationOrder = rotationOrderStore();

const moveX: Ref<string> = ref("0");
const moveY: Ref<string> = ref("0");
const moveZ: Ref<string> = ref("0");
const moveW: Ref<string> = ref("0");
const rotateXW: Ref<string> = ref("0");
const rotateYW: Ref<string> = ref("0");
const rotateZW: Ref<string> = ref("0");
const rotateXY: Ref<string> = ref("0");
const rotateYZ: Ref<string> = ref("0");
const rotateXZ: Ref<string> = ref("0");
const sizeX: Ref<string> = ref("1.0");
const sizeY: Ref<string> = ref("1.0");
const sizeZ: Ref<string> = ref("1.0");
const sizeW: Ref<string> = ref("1.0");

const isLogPush: Ref<boolean> = ref(false);

const parallelMatrix: ComputedRef<number[][]> = computed(() => {
	return [
		[1, 0, 0, Number(moveX.value)],
		[0, 1, 0, Number(moveY.value)],
		[0, 0, 1, Number(moveZ.value)],
		[0, 0, 0, 1],
	];
});

const parallelMatrix4D: ComputedRef<number[][]> = computed(() => {
	return [
		[1, 0, 0, 0, Number(moveX.value)],
		[0, 1, 0, 0, Number(moveY.value)],
		[0, 0, 1, 0, Number(moveZ.value)],
		[0, 0, 0, 1, Number(moveW.value)],
		[0, 0, 0, 0, 1],
	];
});

const rotateMatrix: ComputedRef<number[][]> = computed(() => {
	return makeRotate3DMatrix44(Number(rotateXW.value), Number(rotateYW.value), Number(rotateZW.value));
});

const rotateMatrix4D: ComputedRef<number[][]> = computed(() => {
	return makeRotate4DMatrix55(Number(rotateXW.value), Number(rotateYW.value), Number(rotateZW.value), Number(rotateXY.value), Number(rotateYZ.value), Number(rotateXZ.value));
});

const sizeMatrix: ComputedRef<number[][]> = computed(() => {
	return [
		[Number(sizeX.value), 0, 0, 0],
		[0, Number(sizeY.value), 0, 0],
		[0, 0, Number(sizeZ.value), 0],
		[0, 0, 0, 1],
	];
});

const sizeMatrix4D: ComputedRef<number[][]> = computed(() => {
	return [
		[Number(sizeX.value), 0, 0, 0, 0],
		[0, Number(sizeY.value), 0, 0, 0],
		[0, 0, Number(sizeZ.value), 0, 0],
		[0, 0, 0, Number(sizeW.value), 0],
		[0, 0, 0, 1],
	];
});

const transformMatrix: ComputedRef<number[][]> = computed(() => {
	return chain(parallelMatrix.value).multiply(rotateMatrix.value).multiply(sizeMatrix.value).done();
});

const transformMatrix4D: ComputedRef<number[][]> = computed(() => {
	return chain(parallelMatrix4D.value).multiply(rotateMatrix4D.value).multiply(sizeMatrix4D.value).done();
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

const colors: (ArrayOfColorRGB | ArrayOfColorRGBA)[] = [
	[0, 255, 0, 0.5],
	[0, 255, 0, 0.5],
	[0, 255, 0, 0.5],
	[0, 255, 0, 0.5],
	[0, 255, 0, 0.5],
	[0, 255, 0, 0.5],
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

const fourDimensionVertexes: number[][] = [
	[100, 100, 100, 100], // 0
	[100, -100, 100, 100],
	[-100, 100, 100, 100],
	[-100, -100, 100, 100],
	[100, 100, -100, 100], // 4
	[100, -100, -100, 100],
	[-100, 100, -100, 100],
	[-100, -100, -100, 100],
	[100, 100, 100, -100], // 8
	[100, -100, 100, -100],
	[-100, 100, 100, -100],
	[-100, -100, 100, -100],
	[100, 100, -100, -100], // 12
	[100, -100, -100, -100],
	[-100, 100, -100, -100],
	[-100, -100, -100, -100],
]

const fourDimensionParts: number[][] = [
	// big	
	[0, 1, 2, 3], // front
	[4, 5, 6, 7], // back
	[0, 2, 4, 6], // top
	[1, 3, 5, 7], // bottom
	[0, 1, 4, 5], // right
	[2, 3, 6, 7], // left
	// small (+8)
	[8, 9, 10, 11],
	[12, 13, 14, 15],
	[8, 10, 12, 14],
	[9, 11, 13, 15],
	[8, 9, 12, 13],
	[10, 11, 14, 15],
	// x rotate direction
	[0, 2, 8, 10],
	[1, 3, 9, 11],
	[4, 6, 12, 14],
	[5, 7, 13, 15],
	// y rotate direction
	[0, 1, 8, 9],
	[2, 3, 10, 11],
	[4, 5, 12, 13],
	[6, 7, 14, 15],
	// z rotate direction
	[0, 4, 8, 12],
	[1, 5, 9, 13],
	[2, 6, 10, 14],
	[3, 7, 11, 15],
]

const model = new Model3D();
model.setVertexes(vertexes);
model.setParts(parts, colors);

const model4D = new Model4D();
model4D.setVertexes(fourDimensionVertexes);
model4D.setParts(fourDimensionParts);

myGeometry.setAttribute("position", new THREE.BufferAttribute(model.toThreeVertexes(), 3));
myGeometry.setIndex(new THREE.BufferAttribute(model.toTrianglesIndex(), 1));
myGeometry.computeVertexNormals();

const initialize = () => {
	// 参考リンク: https://b-risk.jp/blog/2021/12/webgl_threejs/
	const scene = new THREE.Scene();
	scene.background = new THREE.Color().setRGB(0, 0, 0);

	const camera = new THREE.PerspectiveCamera(45, 1);
	camera.position.set(0, 0, 1000);

	const light = new THREE.PointLight(0xffffff, pi * 300, 2000, 0.9);
	light.position.set(0, 0, 1000);
	light.castShadow = true;

	const geometry = new THREE.BoxGeometry(300, 300, 300);
	const material = new THREE.MeshNormalMaterial();

	scene.add(light);
	const mesh = new THREE.Mesh(model.geometry, model.materialColors);
	// const lineSegments = model.getLineSegments(0x00ffff, 1);
	const face = new THREE.Mesh(model.geometry, model.materialColors);
	const frame = model.getFrameMesh(0x00ffff);
	const group = new THREE.Group();
	group.add(frame);
	group.add(face);
	scene.add(group);
	console.log(frame.geometry);


	if (!threeCanvas.value) {
		throw new Error("canvasElement is null");
	}

	const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas.value, antialias: false, alpha: true });

	renderer.setSize(600, 600);
	renderer.render(scene, camera);

	renderer.setAnimationLoop(() => {
		update(renderer, scene, camera, face, frame);
	});
};

const update = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, face: THREE.Mesh, frame: THREE.Mesh) => {
	release(face, frame);

	const flatTransformMatrix = transformMatrix.value.flat();
	const transformedModel = model.affine(transformMatrix.value);
	transformedModel.geometry.computeVertexNormals();
	frame.geometry = transformedModel.getFrameGeometry();
	face.geometry = transformedModel.geometry;

	scene.updateMatrix();
	renderer.render(scene, camera);

	if (isLogPush.value) {
		console.log(frame.geometry);
		isLogPush.value = false;
	}

	if (logTimeManager.isPushLog()) {
		console.log(makeRotate4DMatrix(30, 0, 0, 0, 0, 0));

		logTimeManager.updateLogDate();
	}

	logTimeManager.updateCurrentDate();
};

const release = (face: THREE.Mesh, frame: THREE.Mesh) => {
	face.geometry.dispose();
	frame.geometry.dispose();
}

onMounted(() => {
	if (process.env.NODE_ENV === "development") {
		console.log("develop");

		const initializeState = localStorage.getItem("initializeState");

		if (initializeState === "initialized") {
			console.log("a");
			localStorage.setItem("initializeState", "reload");
			console.log("page reloading");
			location.reload();
			return;
		}
	}

	initialize();

	if (process.env.NODE_ENV === "development") {
		localStorage.setItem("initializeState", "initialized");
	}
});
</script>

<template>
	<div class="page-container">
		<canvas id="canvas" ref="threeCanvas"></canvas>
		<div class="control-container">
			<ModuleSlider text="x" max="300" min="-300" v-model="moveX" />
			<ModuleSlider text="y" max="300" min="-300" v-model="moveY" />
			<ModuleSlider text="z" max="300" min="-300" v-model="moveZ" />
			<ModuleSlider text="w" max="300" min="-300" v-model="moveW" />
			<ModuleSlider text="rotateXW" max="360" min="-360" v-model="rotateXW" />
			<ModuleSlider text="rotateYW" max="360" min="-360" v-model="rotateYW" />
			<ModuleSlider text="rotateZW" max="360" min="-360" v-model="rotateZW" />
			<ModuleSlider text="rotateXY" max="360" min="-360" v-model="rotateXY" />
			<ModuleSlider text="rotateYZ" max="360" min="-360" v-model="rotateYZ" />
			<ModuleSlider text="rotateXZ" max="360" min="-360" v-model="rotateXZ" />
			<ModuleSlider text="sizeX" max="2.0" min="0.1" step="0.1" v-model="sizeX" />
			<ModuleSlider text="sizeY" max="2.0" min="0.1" step="0.1" v-model="sizeY" />
			<ModuleSlider text="sizeZ" max="2.0" min="0.1" step="0.1" v-model="sizeZ" />
			<ModuleSlider text="sizeW" max="2.0" min="0.1" step="0.1" v-model="sizeW" />
		</div>
		<div class="rotation-order-container">
			<ChangeableOrderList v-model="rotationOrder.orderList" />
		</div>
	</div>
	<button id="push-log" @click="isLogPush = true">push log</button>
</template>

<style scoped>
.page-container {
	display: flex;
	gap: 1rem;
	flex-wrap: nowrap;

	.control-container {
		display: grid;
		grid-template-columns: auto;
		height: min-content;
	}
}
</style>