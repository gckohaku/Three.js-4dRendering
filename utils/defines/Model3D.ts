import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import type { ArrayOfColorRGB, ArrayOfColorRGBA } from "../typeUtilities";
import { add, concat, cos, cross, divide, dotDivide, index, multiply, norm, pi, pow, sin, subtract, unaryMinus } from "mathjs";
import { makeRodriguesRotationMatrix } from "../matrixUtilities";

export class Model3D {
	vertexes: number[][] = [];
	indexes: number[][] = [];
	colors: ArrayOfColorRGB[] = [];
	materialColors: THREE.Material[] = [];
	alphas: number[] = [];
	geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
	lineGeometry: THREE.BufferGeometry = new THREE.BufferGeometry();

	constructor();
	constructor(m: Model3D);

	constructor(m?: Model3D) {
		if (m) {
			this.vertexes = [...m.vertexes];
			this.indexes = [...m.indexes];
			this.colors = [...m.colors];
			this.materialColors = [...m.materialColors];
			this.alphas = [...m.alphas];
			this.geometry = m.geometry.clone();
			this.setColorMesh();
		}
	}

	setVertexes(vs: number[][]) {
		this.vertexes = vs;

		this.geometry.deleteAttribute("position");
		this.geometry.setAttribute("position", new THREE.BufferAttribute(this.toThreeVertexes(), 3));
		this.geometry.computeVertexNormals();
	}

	addVertexes(vs: number[][]) {
		for (let i = 0; i < vs.length; i++) {
			this.vertexes.push(vs[i]);

			this.geometry.deleteAttribute("position");
			this.geometry.setAttribute("position", new THREE.BufferAttribute(this.toThreeVertexes(), 3));
			this.geometry.computeVertexNormals();
		}
	}

	setParts(partsIndexes: number[][], colors?: (ArrayOfColorRGB | ArrayOfColorRGBA)[]) {
		this.indexes = partsIndexes;

		if (colors) {
			this.colors = [];
			for (let i = 0; i < colors.length; i++) {
				// ArrayOfColorRGBA から Alpha を除くと ArrayOfColorRGB になる
				this.colors.push(colors[i].slice(0, 3) as ArrayOfColorRGB);

				const alpha = colors[i][3] ?? 1.0;
				this.alphas.push(alpha);
			}
		}

		this.geometry.setIndex(new THREE.BufferAttribute(this.toTrianglesIndex(), 1));

		this.setColorMesh();
	}

	affine(m: number[][]): Model3D {
		const logTimeManager = logTimeManagerStore();

		// m が四行四列である必要がある。四行四列でない場合はエラーが発生する
		const threeMatrix = new THREE.Matrix4().set(...(m.flat() as Parameters<InstanceType<typeof THREE.Matrix4>["set"]>));
		const returnedModel = new Model3D(this);

		const position = returnedModel.geometry.attributes.position;
		position.applyMatrix4(threeMatrix);

		for (let i = 0; i < returnedModel.vertexes.length; i++) {
			returnedModel.vertexes[i] = multiply(m, concat(this.vertexes[i], [1])) as number[];
		}

		return returnedModel;
	}

	toThreeVertexes(): Float32Array {
		return new Float32Array(this.vertexes.flat());
	}

	toTrianglesIndex(): Uint32Array {
		const trianglesVertexesArray: number[] = [];

		for (let i = 0; i < this.indexes.length; i++) {
			trianglesVertexesArray.push(...this.onePolygonToTrianglesIndexes(i));
		}

		return new Uint32Array(trianglesVertexesArray);
	}

	setColorMesh() {
		this.geometry.clearGroups();
		let colorToIndex = 0;

		for (let i = 0; i < this.indexes.length; i++) {
			this.materialColors.push(
				new THREE.MeshStandardMaterial({
					color: new THREE.Color().setRGB(...(this.colors[i].map((v) => v / 255) as ArrayOfColorRGB)),
					opacity: this.alphas[i],
					transparent: true,
					depthTest: true,
					depthWrite: false,
					side: THREE.DoubleSide,
					wireframe: false,
					flatShading: true,
				}),
			);

			for (let triangleIndex = 0; triangleIndex < this.indexes[i].length - 2; triangleIndex++) {
				this.geometry.addGroup(colorToIndex, 3, i);
				colorToIndex += 3;
			}
		}
	}

	getLineSegments(color: ArrayOfColorRGB | number, width: number): THREE.LineSegments {
		const lineGeometryIndexes: [number, number][] = [];
		const lineGeometries: THREE.BufferGeometry[] = [];

		for (const indexesUnit of this.indexes) {
			const currentIndexes = this.checkAscending([indexesUnit[0], indexesUnit[1]]);
			if (!lineGeometryIndexes.find((e) => e[0] === currentIndexes[0] && e[1] === currentIndexes[1])) {
				lineGeometryIndexes.push(currentIndexes);
			}
		}

		for (const indexPair of lineGeometryIndexes) {
			lineGeometries.push(
				new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...this.vertexes[indexPair[0]]), new THREE.Vector3(...this.vertexes[indexPair[1]])]),
			);
		}

		const mergedGeometry = BufferGeometryUtils.mergeGeometries(lineGeometries);
		const material = new THREE.LineBasicMaterial({
			color: 0x00ffff,
		});

		return new THREE.LineSegments(mergedGeometry, material);
	}

	getMeshWithFrame(frameColor: number): THREE.Group {
		const frameGeometry = this.getFrameGeometry();

		const faceMesh = new THREE.Mesh(this.geometry, this.materialColors);
		const frameMesh = new THREE.Mesh(frameGeometry, new THREE.MeshLambertMaterial({ color: frameColor }));

		const retGroup = new THREE.Group();
		retGroup.add(faceMesh);
		retGroup.add(frameMesh);

		return retGroup;
	}

	getFrameMesh(frameColor: number): THREE.Mesh {
		const frameGeometry = this.getFrameGeometry();
		const mesh = new THREE.Mesh(frameGeometry, new THREE.MeshLambertMaterial({ color: frameColor, depthTest: true, depthWrite: true }));

		return mesh;
	}

	getFrameGeometry(): THREE.BufferGeometry {
		const logTimeManager = logTimeManagerStore();

		const framePositionIndexes: [number, number][] = [];
		const frameGeometries: THREE.BufferGeometry[] = [];

		for (const indexesUnit of this.indexes) {
			this.frameIndexesPushProcess(indexesUnit, 0, 1, framePositionIndexes);
			for (let i = 1; i < indexesUnit.length - 2; i += 2) {
				this.frameIndexesPushProcess(indexesUnit, i, i + 2, framePositionIndexes);
			}
			this.frameIndexesPushProcess(indexesUnit, indexesUnit.length - 1, indexesUnit.length - 2, framePositionIndexes);
			for (let i = indexesUnit.length - 1 - (indexesUnit.length + 1) % 2; i > 0; i -= 2) {
				this.frameIndexesPushProcess(indexesUnit, i, i - 2, framePositionIndexes);
			}
			
		}

		if (logTimeManager.isPushLog()) {
			console.log(framePositionIndexes);
		}

		for (const indexPair of framePositionIndexes) {
			frameGeometries.push(this.generateLineTubeGeometry(indexPair, 6));
		}

		const mergedGeometry = BufferGeometryUtils.mergeGeometries(frameGeometries);
		mergedGeometry.computeVertexNormals();
		return mergedGeometry;
	}

	private checkAscending(tuple: [number, number]): [number, number] {
		if (tuple[0] <= tuple[1]) {
			return tuple;
		}
		return [tuple[1], tuple[0]];
	}

	private frameIndexesPushProcess(indexes: number[], fromOffset: number, toOffset: number, framePositionIndexes: [number, number][]) {
		const currentIndexes = this.checkAscending([indexes[fromOffset], indexes[toOffset]]);
		if (currentIndexes[0] === currentIndexes[1]) {
			return;
		}
		if (!framePositionIndexes.find((e) => e[0] === currentIndexes[0] && e[1] === currentIndexes[1])) {
			framePositionIndexes.push(currentIndexes);
		}
	}

	private onePolygonToTrianglesIndexes(index: number): number[] {
		const onePolygonIndexes: number[] = [...this.indexes[index]];
		const ret: number[] = [];

		for (let i = 0; i < onePolygonIndexes.length - 2; i++) {
			if (i % 2 === 0) {
				ret.push(onePolygonIndexes[i], onePolygonIndexes[i + 1], onePolygonIndexes[i + 2]);
			} else {
				ret.push(onePolygonIndexes[i], onePolygonIndexes[i + 2], onePolygonIndexes[i + 1]);
			}
		}

		return ret;
	}

	private generateLineTubeGeometry(indexPair: [number, number], radius: number, segment = 12): THREE.BufferGeometry {
		const logTimeManager = logTimeManagerStore();

		const positions = [this.vertexes[indexPair[0]].slice(0, 3), this.vertexes[indexPair[1]].slice(0, 3)];

		const lineVector = subtract(positions[1], positions[0]);
		const normalizeLineVector = divide(lineVector, norm(lineVector)) as number[];
		const originTubeRawVector = cross(lineVector, positions[0]);
		const originTubeVector = divide(originTubeRawVector, divide(norm(originTubeRawVector), radius));

		const vertexes: number[][] = [];
		const indexes: number[] = [];

		const tubeVectors: number[][] = [];
		const tubePositions: number[][] = [];

		for (let i = 0; i < segment; i++) {
			const rotateMatrix = makeRodriguesRotationMatrix((2 * pi * i) / segment, normalizeLineVector);
			const tubeVector = multiply(rotateMatrix, originTubeVector) as number[];

			tubeVectors.push(tubeVector);
			vertexes.push(add(positions[0], tubeVector), add(positions[1], tubeVector));
		}

		const fromStickOutPosition = subtract(positions[0], multiply(normalizeLineVector, radius)) as number[];
		const toStickOutPosition = add(positions[1], multiply(normalizeLineVector, radius)) as number[];

		vertexes.push(fromStickOutPosition, toStickOutPosition);

		for (let i = 0; i < segment * 2; i += 2) {
			indexes.push(i, (i + 2) % (2 * segment), i + 1, (i + 2) % (2 * segment), (i + 3) % (2 * segment), i + 1);
			indexes.push(i, segment * 2, i + 2, i + 1, i + 3, segment * 2 + 1);
		}



		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertexes.flat()), 3));
		geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indexes), 1));

		if (logTimeManager.isPushLog()) {
		}

		return geometry;
	}
}
