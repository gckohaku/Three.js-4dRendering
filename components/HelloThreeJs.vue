<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const threeCanvas: Ref<HTMLCanvasElement | null> = ref(null);

const myGeometry = new THREE.BufferGeometry();

const vertexes = new Float32Array([
	50, 50, 0,
	50, -50, 0,
	-50, -50, 0,
	-50, 50, 0,
])

const faces = new Uint32Array([
	0, 3, 1,
	1, 3 ,2,
]);

myGeometry.setAttribute("position", new THREE.BufferAttribute(vertexes, 3));
myGeometry.setIndex(new THREE.BufferAttribute(faces, 1));
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
	scene.add(mesh);

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
	<canvas id="canvas" ref="threeCanvas"></canvas>
</template>

<style scoped>
/* style here */
</style>