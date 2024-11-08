<script setup lang="ts">
import { mode } from "mathjs";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Model3D } from "~/utils/defines/Model3D";
import type { ArrayOfColorRGB } from "~/utils/defines/TypeUtilities";

const threeCanvas: Ref<HTMLCanvasElement | null> = ref(null);

const myGeometry = new THREE.BufferGeometry();

const vertexes: number[][] = [
	[-50, 50, 50,], // 0
	[50, 50, 50,],
	[50, -50, 50,],
	[-50, -50, 50,],
	[-50, 50, -50,],
	[50, 50, -50,], // 5
	[50, -50, -50,],
	[-50, -50, -50,],
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
	[0, 255, 0],
	[0, 255, 0],
	[0, 255, 0],
	[0, 255, 0],
	[0, 255, 0],
	[0, 255, 0],
];

const nextVertexes: number[][] = [
	[-60, 0, 0,], // 0
	[0, 0, 0,],
	[0, 30, 0,],
	[60, -15, 40,],
	[60, -15, -40,], // 4
];

const nextParts: number[][] = [
	[0, 3, 2],
	[0, 2, 4],
	[4, 1, 0],
	[1, 3, 0],
	[2, 3, 1],
	[2, 1, 4]
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
model.setVertexes(nextVertexes);
model.setParts(nextParts, nextColors);

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
	const mesh = new THREE.Mesh(myGeometry, material);

	scene.add(light);
	// scene.add(mesh);
	model.setColorMesh();
	model.meshToScene(scene);

	if (!threeCanvas.value) {
		throw new Error("canvasElement is null");
	}

	const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas.value, antialias: true });

	const controls = new OrbitControls(camera, threeCanvas.value);

	renderer.setSize(600, 600);
	renderer.render(scene, camera);

	renderer.setAnimationLoop(() => {
		controls.update();
		renderer.render(scene, camera);
	});
}

onMounted(() => {
	initialize();
});
</script>

<template>
	<div class="page-container">
		<canvas id="canvas" ref="threeCanvas"></canvas>
		<ModuleSlider text="x" />
	</div>
</template>

<style scoped>
.page-container {
	display: flex;
	gap: 1rem;
	flex-wrap: nowrap;
}
</style>