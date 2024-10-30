<script setup lang="ts">
import * as THREE from "three";

onMounted(() => {
	// 参考リンク: https://b-risk.jp/blog/2021/12/webgl_threejs/
	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(45, 1);
	camera.position.set(0, 0, 1000);

	const canvasElement = document.querySelector("canvas");
	if (!canvasElement) {
		throw new Error("canvasElement is null");
	}
	const renderer = new THREE.WebGLRenderer({ canvas: canvasElement });
	renderer.setSize(600, 600);

	const light = new THREE.AmbientLight(0xffffff, 1.0);
	light.position.set(50, 50, 50);
	scene.add(light);

	const geometry = new THREE.SphereGeometry(200, 300, 300);
	const material = new THREE.MeshNormalMaterial();
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	renderer.render(scene, camera);
});
</script>

<template>
	<canvas id="canvas"></canvas>
</template>

<style scoped>
/* style here */
</style>