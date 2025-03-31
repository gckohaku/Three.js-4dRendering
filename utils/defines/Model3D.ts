import * as PolygonUtilities from "@/utils/polygonUtilities";
import { add, concat, cross, divide, multiply, norm, pi, subtract } from "mathjs";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { makeRodriguesRotationMatrix } from "../matrixUtilities";
import type { ArrayOfColorRGB, ArrayOfColorRGBA } from "../typeUtilities";
import type { PolygonIndexes, PolygonPart } from "./polygonTypes";
import * as TupleUtilities from "@/utils/tupleUtilities"

export class Model3D {
	vertexes: number[][] = [];
	indexes: PolygonIndexes = [];
	macroIndexes: number[][] = [];
	colors: ArrayOfColorRGB[] = [];
	colorIndexes: number[] = [];
	materialColors: THREE.Material[] = [];
	alphas: number[] = [];
	geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
	lineGeometry: THREE.BufferGeometry = new THREE.BufferGeometry();
	frameWidthMultiplies: number[] = []

	constructor();
	constructor(m: Model3D);

	constructor(m?: Model3D) {
		if (m) {
			this.vertexes = structuredClone(m.vertexes);
			this.indexes = structuredClone(m.indexes);
			this.macroIndexes = structuredClone(m.macroIndexes);
			this.colors = [...m.colors];
			this.colorIndexes = [...m.colorIndexes];
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
		this.indexes = PolygonUtilities.toAllTrianglePolygons(partsIndexes);
		this.macroIndexes = partsIndexes;

		if (colors) {
			this.colors = [];
			for (let i = 0; i < colors.length; i++) {
				// ArrayOfColorRGBA から Alpha を除くと ArrayOfColorRGB になる
				this.colors.push(colors[i].slice(0, 3) as ArrayOfColorRGB);

				const alpha = colors[i][3] ?? 1.0;
				this.alphas.push(alpha);
			}
		}

		this.geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(this.indexes.flat(2)), 1));

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

	// toTrianglesIndex(): Uint32Array {
	// 	const trianglesVertexesArray: number[] = [];

	// 	for (let i = 0; i < this.indexes.length; i++) {
	// 		trianglesVertexesArray.push(...this.onePolygonToTrianglesIndexes(i));
	// 	}

	// 	return new Uint32Array(trianglesVertexesArray);
	// }

	setColorMesh() {
		this.geometry.clearGroups();
		let colorToIndex = 0;

		for (let i = 0; i < this.colors.length; i++) {
			this.materialColors.push(
				new THREE.MeshStandardMaterial({
					color: new THREE.Color().setRGB(...(this.colors[i].map((v) => v / 255) as ArrayOfColorRGB)),
					opacity: this.alphas[i],
					transparent: true,
					depthTest: false,
					depthWrite: true,
					side: THREE.DoubleSide,
					wireframe: false,
					flatShading: true,
				}),
			);
		}

		for (let i = 0; i < this.colorIndexes.length; i++) {
			if (this.colorIndexes[i] === null) {
				throw new Error(`undefined: ${this.colorIndexes[i]}`);
			}

			this.geometry.addGroup(colorToIndex, 3, this.colorIndexes[i]);
			colorToIndex += 3;
		}
	}

	getMeshWithFrame(frameColor: number, radius = 6): THREE.Group {
		const frameGeometry = this.getFrameGeometry(radius);

		const faceMesh = new THREE.Mesh(this.geometry, this.materialColors);
		const frameMesh = new THREE.Mesh(frameGeometry, new THREE.MeshLambertMaterial({ color: frameColor }));

		const retGroup = new THREE.Group();
		retGroup.add(faceMesh);
		retGroup.add(frameMesh);

		return retGroup;
	}

	getFrameMesh(frameColor: number, radius = 6, isChangeableFrameWidth = false): THREE.Mesh {
		const frameGeometry = this.getFrameGeometry(radius, isChangeableFrameWidth);
		const mesh = new THREE.Mesh(frameGeometry, new THREE.MeshLambertMaterial({ color: frameColor, depthTest: true, depthWrite: true }));

		return mesh;
	}

	getFrameGeometry(radius = 6, isChangeableFrameWidth = false): THREE.BufferGeometry {
		const logTimeManager = logTimeManagerStore();

		const framePositionIndexes: [number, number][] = [];
		const frameGeometries: THREE.BufferGeometry[] = [];


		for (const indexesUnit of this.indexes) {
			if (indexesUnit.length) {
				const macroIndexesUnit = PolygonUtilities.toMacroIndexes(indexesUnit);

				// if (indexesUnit.length >= 3) {
				// 	console.log(indexesUnit, macroIndexesUnit);
				// }

				this.frameIndexesPushProcess(macroIndexesUnit, 0, 1, framePositionIndexes, isChangeableFrameWidth);
				for (let i = 1; i < macroIndexesUnit.length - 2; i += 2) {
					this.frameIndexesPushProcess(macroIndexesUnit, i, i + 2, framePositionIndexes, isChangeableFrameWidth);
				}
				this.frameIndexesPushProcess(macroIndexesUnit, macroIndexesUnit.length - 1, macroIndexesUnit.length - 2, framePositionIndexes, isChangeableFrameWidth);
				for (let i = macroIndexesUnit.length - 1 - ((macroIndexesUnit.length + 1) % 2); i > 0; i -= 2) {
					this.frameIndexesPushProcess(macroIndexesUnit, i, i - 2, framePositionIndexes, isChangeableFrameWidth);
				}
			}
		}

		if (framePositionIndexes.length === 0) {
			return new THREE.BufferGeometry();
		}

		for (const indexPair of framePositionIndexes) {
			frameGeometries.push(this.generateLineTubeGeometry(indexPair, radius));
		}

		const mergedGeometry = BufferGeometryUtils.mergeGeometries(frameGeometries);
		mergedGeometry.computeVertexNormals();
		return mergedGeometry;
	}

	// private checkAscending(tuple: [number, number]): [number, number] {
	// 	if (tuple[0] <= tuple[1]) {
	// 		return tuple;
	// 	}
	// 	return [tuple[1], tuple[0]];
	// }

	private frameIndexesPushProcess(indexes: number[], fromOffset: number, toOffset: number, framePositionIndexes: [number, number][], isChangeableFrameWidth = false) {
		const logTimeManager = logTimeManagerStore();

		const currentIndexes = TupleUtilities.checkAscending([indexes[fromOffset], indexes[toOffset]]);

		if (currentIndexes[0] === currentIndexes[1]) {
			return;
		}
		if (
			!framePositionIndexes.find((e) => e[0] === currentIndexes[0] && e[1] === currentIndexes[1]) &&
			!this.vertexes[currentIndexes[0]].every((e, index) => e === this.vertexes[currentIndexes[1]][index])
		) {
			framePositionIndexes.push(currentIndexes);
		}
	}

	private generateLineTubeGeometry(indexPair: [number, number], radius: number, segment = 12, isChangeableFrameWidth = false): THREE.BufferGeometry {
		const logTimeManager = logTimeManagerStore();

		const positions = [this.vertexes[indexPair[0]].slice(0, 3), this.vertexes[indexPair[1]].slice(0, 3)];
		const frameWidthMultiplies = [this.frameWidthMultiplies[indexPair[0]], this.frameWidthMultiplies[indexPair[1]]];

		const lineVector = subtract(positions[1], positions[0]);
		const normalizeLineVector = divide(lineVector, norm(lineVector)) as number[];
		const originTubeRawVector = cross(lineVector, lineVector[1] === 0 && lineVector[2] === 0 ? [0, lineVector[0], 0] : [0, lineVector[2], -lineVector[1]]);
		const originTubeVector = divide(originTubeRawVector, divide(norm(originTubeRawVector), radius));

		const vertexes: number[][] = [];
		const indexes: number[] = [];

		const tubeVectors: number[][] = [];
		const tubePositions: number[][] = [];

		for (let i = 0; i < segment; i++) {
			const rotateMatrix = makeRodriguesRotationMatrix((2 * pi * i) / segment, normalizeLineVector);
			const tubeVector = multiply(rotateMatrix, originTubeVector) as number[];

			tubeVectors.push(tubeVector);
			vertexes.push(add(positions[0], multiply(frameWidthMultiplies[0] ?? 1, tubeVector) as number[]), add(positions[1], multiply(frameWidthMultiplies[1] ?? 1, tubeVector) as number[]));

			/*
				デバッグ用
				computed radius だかが NaN になって困ったら使う
			*/
			// if (add(positions[0], tubeVector).includes(Number.NaN) || add(positions[1], tubeVector).includes(Number.NaN)) {
			// 	throw new Error(`NaN!!!!!!!!!!!!!!!!!!!!!!!!!!!\nindexPair: ${indexPair}\ncounter: ${i}\npos0: ${positions[0]}\npos1: ${positions[1]}\ntube: ${tubeVector}\noriginTubeVectorRaw: ${originTubeRawVector}\nresults:\n| 0: ${add(positions[0], tubeVector)}\n| 1: ${add(positions[1], tubeVector)}`)
			// }
		}

		const fromStickOutPosition = subtract(positions[0], multiply(normalizeLineVector, multiply(frameWidthMultiplies[0] ?? 1, radius))) as number[];
		const toStickOutPosition = add(positions[1], multiply(normalizeLineVector, multiply(frameWidthMultiplies[1] ?? 1, radius))) as number[];

		vertexes.push(fromStickOutPosition, toStickOutPosition);

		for (let i = 0; i < segment * 2; i += 2) {
			indexes.push(i, (i + 2) % (2 * segment), i + 1, (i + 2) % (2 * segment), (i + 3) % (2 * segment), i + 1);
			indexes.push(i, segment * 2, i + 2, i + 1, i + 3, segment * 2 + 1);
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertexes.flat()), 3));
		geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indexes), 1));

		return geometry;
	}
}
