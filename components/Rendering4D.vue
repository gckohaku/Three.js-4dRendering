<script setup lang="ts">
import { chain, concat, cot, Matrix, multiply, pi, unaryMinus, type MathType } from "mathjs";
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

const camera4dMoveX: Ref<string> = ref("0");
const camera4dMoveY: Ref<string> = ref("0");
const camera4dMoveZ: Ref<string> = ref("0");
const camera4dMoveW: Ref<string> = ref("500");
const camera4dRotateXW: Ref<string> = ref("0");
const camera4dRotateYW: Ref<string> = ref("0");
const camera4dRotateZW: Ref<string> = ref("0");
const camera4dRotateXY: Ref<string> = ref("0");
const camera4dRotateYZ: Ref<string> = ref("0");
const camera4dRotateXZ: Ref<string> = ref("0");
const camera4dSizeX: Ref<string> = ref("1.0");
const camera4dSizeY: Ref<string> = ref("1.0");
const camera4dSizeZ: Ref<string> = ref("1.0");
const camera4dSizeW: Ref<string> = ref("1.0");

const cameraMoveX: Ref<string> = ref("0");
const cameraMoveY: Ref<string> = ref("0");
const cameraMoveZ: Ref<string> = ref("500");
const cameraRotateX: Ref<string> = ref("0");
const cameraRotateY: Ref<string> = ref("0");
const cameraRotateZ: Ref<string> = ref("0");
const cameraSizeX: Ref<string> = ref("1.0");
const cameraSizeY: Ref<string> = ref("1.0");
const cameraSizeZ: Ref<string> = ref("1.0");

const isLogPush: Ref<boolean> = ref(false);

const parallelMatrix4D: ComputedRef<number[][]> = computed(() => {
	return [
		[1, 0, 0, 0, Number(moveX.value)],
		[0, 1, 0, 0, Number(moveY.value)],
		[0, 0, 1, 0, Number(moveZ.value)],
		[0, 0, 0, 1, Number(moveW.value)],
		[0, 0, 0, 0, 1],
	];
});

const rotateMatrix4D: ComputedRef<number[][]> = computed(() => {
	return makeRotate4DMatrix55(Number(rotateXW.value), Number(rotateYW.value), Number(rotateZW.value), Number(rotateXY.value), Number(rotateYZ.value), Number(rotateXZ.value));
});

const sizeMatrix4D: ComputedRef<number[][]> = computed(() => {
	return [
		[Number(sizeX.value), 0, 0, 0, 0],
		[0, Number(sizeY.value), 0, 0, 0],
		[0, 0, Number(sizeZ.value), 0, 0],
		[0, 0, 0, Number(sizeW.value), 0],
		[0, 0, 0, 0, 1],
	];
});

const transformMatrix4D: ComputedRef<number[][]> = computed(() => {
	return chain(parallelMatrix4D.value).multiply(rotateMatrix4D.value).multiply(sizeMatrix4D.value).done();
});

const focalLength = 300 * cot(23 * pi / 180);

const cameraRMatrix4D: ComputedRef<number[][]> = computed(() => {
	return makeRotate4DMatrix(-Number(camera4dRotateXW.value), -Number(camera4dRotateYW.value), -Number(camera4dRotateZW.value), -Number(camera4dRotateXY.value), -Number(camera4dRotateYZ.value), -Number(camera4dRotateXZ.value));
});

const cameraTMatrix4D: ComputedRef<number[][]> = computed(() => {
	return multiply<MathType>(unaryMinus(cameraRMatrix4D.value), [
		[Number(camera4dMoveX.value)],
		[Number(camera4dMoveY.value)],
		[Number(camera4dMoveZ.value)],
		[Number(camera4dMoveW.value)],
	]) as number[][];
});

const cameraRtMatrix4D: ComputedRef<number[][]> = computed(() => {
	return concat(cameraRMatrix4D.value, cameraTMatrix4D.value) as number[][];
});

const cameraAMatrix4D: ComputedRef<number[][]> = computed(() => {
	return [
		[focalLength, 0, 0, 0],
		[0, focalLength, 0, 0],
		[0, 0, focalLength, 0],
		[0, 0, 0, 1],
	];
});

const cameraMatrix4D: ComputedRef<number[][]> = computed(() => {
	return multiply<number[][]>(cameraAMatrix4D.value, cameraRtMatrix4D.value) as MathType as number[][];
});

const threeCanvas: Ref<HTMLCanvasElement | null> = ref(null);

const myGeometry = new THREE.BufferGeometry();

const fourDimensionVertexes: number[][] = [
	[50, 50, 50, 50], // 0
	[50, -50, 50, 50],
	[-50, 50, 50, 50],
	[-50, -50, 50, 50],
	[50, 50, -50, 50], // 4
	[50, -50, -50, 50],
	[-50, 50, -50, 50],
	[-50, -50, -50, 50],
	[50, 50, 50, -50], // 8
	[50, -50, 50, -50],
	[-50, 50, 50, -50],
	[-50, -50, 50, -50],
	[50, 50, -50, -50], // 12
	[50, -50, -50, -50],
	[-50, 50, -50, -50],
	[-50, -50, -50, -50],
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
];

const fourDimensionColors: ArrayOfColorRGBA[] = [
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
	[0, 255, 0, 0.0],
]

const model4D = new Model4D();
model4D.setVertexes(fourDimensionVertexes);
model4D.setParts(fourDimensionParts, fourDimensionColors);

const downDimensionModel4D = model4D.toModel3D();

myGeometry.setAttribute("position", new THREE.BufferAttribute(downDimensionModel4D.toThreeVertexes(), 3));
myGeometry.setIndex(new THREE.BufferAttribute(downDimensionModel4D.toTrianglesIndex(), 1));
myGeometry.computeVertexNormals();

const initialize = () => {
	// 参考リンク: https://b-risk.jp/blog/2021/12/webgl_threejs/
	const scene = new THREE.Scene();
	scene.background = new THREE.Color().setRGB(0, 0, 0);

	const camera = new THREE.PerspectiveCamera(45, 1);
	camera.position.set(Number(cameraMoveX.value), Number(cameraMoveY.value), Number(cameraMoveZ.value));
	camera.rotation.setFromRotationMatrix(new THREE.Matrix4(...makeRotate3DMatrix44(Number(cameraRotateX.value), Number(cameraRotateY.value), Number(cameraRotateZ.value)).flat() as ConstructorParameters<typeof THREE.Matrix4>));

	const light = new THREE.PointLight(0xffffff, pi * 300, 2000, 0.9);
	light.position.set(0, 0, 500);
	light.castShadow = true;

	const geometry = new THREE.BoxGeometry(300, 300, 300);
	const material = new THREE.MeshNormalMaterial();

	scene.add(light);
	const mesh = new THREE.Mesh(downDimensionModel4D.geometry, downDimensionModel4D.materialColors);
	// const lineSegments = model.getLineSegments(0x00ffff, 1);
	const face = new THREE.Mesh(downDimensionModel4D.geometry, downDimensionModel4D.materialColors);
	const frame = downDimensionModel4D.getFrameMesh(0x00ffff);
	const group = new THREE.Group();
	group.add(frame);
	// group.add(face);
	scene.add(group);

	if (!threeCanvas.value) {
		throw new Error("canvasElement is null");
	}

	const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas.value, antialias: false, alpha: true });

	renderer.setSize(600, 600);
	renderer.render(scene, camera);

	renderer.setAnimationLoop(() => {
		update(renderer, scene, camera, light, face, frame);
	});
};

const update = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, light: THREE.Light, face: THREE.Mesh, frame: THREE.Mesh) => {
	release(face, frame);
	camera.position.set(Number(cameraMoveX.value), Number(cameraMoveY.value), Number(cameraMoveZ.value));
	camera.rotation.setFromRotationMatrix(new THREE.Matrix4(...makeRotate3DMatrix44(Number(cameraRotateX.value), Number(cameraRotateY.value), Number(cameraRotateZ.value)).flat() as ConstructorParameters<typeof THREE.Matrix4>));

	light.position.set(Number(cameraMoveX.value), Number(cameraMoveY.value), Number(cameraMoveZ.value));
	light.rotation.setFromRotationMatrix(new THREE.Matrix4(...makeRotate3DMatrix44(Number(cameraRotateX.value), Number(cameraRotateY.value), Number(cameraRotateZ.value)).flat() as ConstructorParameters<typeof THREE.Matrix4>));

	const transformedModel = model4D.affine(transformMatrix4D.value).toModel3D(cameraAMatrix4D.value, cameraRtMatrix4D.value);

	transformedModel.geometry.computeVertexNormals();
	frame.geometry = transformedModel.getFrameGeometry(4);
	face.geometry = transformedModel.geometry;

	scene.updateMatrix();
	renderer.clearDepth();
	renderer.render(scene, camera);

	if (isLogPush.value) {
		isLogPush.value = false;
	}

	if (logTimeManager.isPushLog()) {
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

			<Controller4dTabContainer>
				<template v-slot:object>
					<div class="tab-slot-container">
						<ControllerUi4D v-model:move-x="moveX" v-model:move-y="moveY" v-model:move-z="moveZ" v-model:move-w="moveW" v-model:rotate-x-w="rotateXW" v-model:rotate-y-w="rotateYW" v-model:rotate-z-w="rotateZW" v-model:rotate-x-y="rotateXY" v-model:rotate-y-z="rotateYZ" v-model:rotate-x-z="rotateXZ" v-model:size-x="sizeX" v-model:size-y="sizeY" v-model:size-z="sizeZ" v-model:size-w="sizeW" />
						<div class="rotation-order-container">
							<ChangeableOrderList v-model="rotationOrder.orderList" />
						</div>
					</div>

				</template>
				<template v-slot:camera-4d>
					<div class="tab-slot-container">
						<ControllerUi4D v-model:move-x="camera4dMoveX" v-model:move-y="camera4dMoveY" v-model:move-z="camera4dMoveZ" v-model:move-w="camera4dMoveW" v-model:rotate-x-w="camera4dRotateXW" v-model:rotate-y-w="camera4dRotateYW" v-model:rotate-z-w="camera4dRotateZW" v-model:rotate-x-y="camera4dRotateXY" v-model:rotate-y-z="camera4dRotateYZ" v-model:rotate-x-z="camera4dRotateXZ" v-model:size-x="camera4dSizeX" v-model:size-y="camera4dSizeY" v-model:size-z="camera4dSizeZ" v-model:size-w="camera4dSizeW" />
						<div class="rotation-order-container">
							<ChangeableOrderList v-model="rotationOrder.cameraOrderList" />
						</div>
					</div>
				</template>
				<template v-slot:camera-3d>
					<ControllerUi3D v-model:move-x="cameraMoveX" v-model:move-y="cameraMoveY" v-model:move-z="cameraMoveZ" v-model:rotate-x="cameraRotateX" v-model:rotate-y="cameraRotateY" v-model:rotate-z="cameraRotateZ" v-model:size-x="cameraSizeX" v-model:size-y="cameraSizeY" v-model:size-z="cameraSizeZ" />
				</template>
			</Controller4dTabContainer>
		</div>

	</div>
	<button id="push-log" @click="isLogPush = true">push log</button>
</template>

<style scoped>
.page-container {
	display: flex;
	gap: 1rem;
	flex-wrap: nowrap;

	.tab-slot-container {
		display: flex;
		flex-direction: row;
		gap: .5rem;
	}
}
</style>