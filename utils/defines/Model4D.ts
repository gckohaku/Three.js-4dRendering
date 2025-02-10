import { chain, concat, divide, multiply, transpose } from "mathjs";
import * as THREE from "three";
import * as PolygonUtilities from "@/utils/polygonUtilities";
import type { ArrayOfColorRGB, ArrayOfColorRGBA } from "../typeUtilities";
import { Model3D } from "./Model3D";
import type { PolygonIndexes, PolygonPart, TrianglePolygon } from "./polygonTypes";
import { viewport } from "three/tsl";

export class Model4D {
	vertexes: number[][] = [];
	indexes: PolygonIndexes = [];
	macroIndexes: Map<number, number> = new Map<number, number>();
	colors: ArrayOfColorRGB[] = [];
	colorIndexes: number[] = [];
	materialColors: THREE.Material[] = [];
	alphas: number[] = [];
	geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
	lineGeometry: THREE.BufferGeometry = new THREE.BufferGeometry();

	constructor();
	constructor(m: Model4D);

	constructor(m?: Model4D) {
		if (m) {
			this.vertexes = [...m.vertexes];
			this.indexes = [...m.indexes];
			this.macroIndexes = new Map(m.macroIndexes);
			this.colors = [...m.colors];
			this.colorIndexes = [...m.colorIndexes]
			this.materialColors = [...m.materialColors];
			this.alphas = [...m.alphas];
			this.geometry = m.geometry.clone();
			this.setColorMesh();
		}
	}

	setVertexes(vs: number[][]) {
		this.vertexes = vs;
	}

	addVertexes(vs: number[][]) {
		for (let i = 0; i < vs.length; i++) {
			this.vertexes.push((vs[i]));
		}
	}

	setParts(partsIndexes: number[][], colors?: (ArrayOfColorRGB | ArrayOfColorRGBA)[]) {
		this.indexes = PolygonUtilities.toAllTrianglePolygons(partsIndexes);
		this.macroIndexes = PolygonUtilities.getMacroIndexesMap(this.indexes);

		for (let i = 0; i < partsIndexes.length; i++) {
			this.colorIndexes.push(i);
		}

		this.colors;
		if (colors) {
			for (let i = 0; i < colors.length; i++) {

				// ArrayOfColorRGBA から Alpha を除くと ArrayOfColorRGB になる
				this.colors.push((colors[i].slice(0, 3) as ArrayOfColorRGB) ?? [0, 255, 0]);

				const alpha = colors[i][3] ?? 0.5;
				this.alphas.push(alpha);
			}
		} else {
			for (let i = 0; i < this.indexes.length; i++) {
				this.colors.push([0, 255, 0]);
				this.alphas.push(1.0);
			}
		}

		this.geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(this.indexes.flat(2)), 1));
		this.setColorMesh();
	}

	affine(m: number[][]): Model4D {
		const logTimeManager = logTimeManagerStore();

		const returnedModel = new Model4D(this);

		for (let i = 0; i < returnedModel.vertexes.length; i++) {
			returnedModel.vertexes[i] = (multiply(m, concat(this.vertexes[i], [1])) as number[]).slice(0, 4);
		}

		return returnedModel;
	}

	toModel3D(
		cameraInternalMatrix: number[][] = [
			[706.7557097471259, 0, 0, 0],
			[0, 706.7557097471259, 0, 0],
			[0, 0, 706.7557097471259, 0],
			[0, 0, 0, 1],
		],
		cameraExternalMatrix: number[][] = [
			[1, 0, 0, 0, 0],
			[0, 1, 0, 0, 0],
			[0, 0, 1, 0, 0],
			[0, 0, 0, 1, -500],
		],
	): Model3D {
		const logTimeManager = logTimeManagerStore();

		const vertexesView: number[][] = [];
		const ignoreVertexIndexes: number[] = [];

		// if (logTimeManager.isPushLog()) {
		// 	console.log(this.colorIndexes);
		// }

		// カメラ座標への変換
		for (let i = 0; i < this.vertexes.length; i++) {
			const viewPosition = multiply(cameraExternalMatrix, concat(this.vertexes[i], [1])) as number[];

			if (this.vertexes[i].length > 4) {
				throw new Error(`array length is argument\nindex: ${i}\n${this.vertexes[i]}`);
			}

			vertexesView.push(viewPosition);

			if (viewPosition[3] > -0.1) {
				console.log("over: ", i);
				ignoreVertexIndexes.push(i);
			}
		}

		const indexesClone = structuredClone(this.indexes);

		// カメラの裏側に来ている頂点の処理
		for (let partsIndex = 0; partsIndex < indexesClone.length; partsIndex++) {
			const polygon = indexesClone[partsIndex];
			for (let triangleIndex = 0; triangleIndex < polygon.length; triangleIndex++) {
				const triangle = polygon[triangleIndex];

				const filteredIgnoreIndexes = ignoreVertexIndexes.filter((v) => triangle.includes(v));

				for (const ignore of filteredIgnoreIndexes) {
					if (triangle.includes(ignore)) {
						console.log(`delete [${partsIndex}][${triangleIndex}]: `);
						polygon.splice(triangleIndex, 1);
					}
				}


			}
		}

		const model3d = new Model3D();
		const vertexes3d: number[][] = [];

		// 三次元座標への変換
		for (let i = 0; i < vertexesView.length; i++) {
			vertexes3d.push(chain(cameraInternalMatrix).multiply(vertexesView[i]).divide(vertexesView[i][3]).done() as number[]);
		}

		model3d.setVertexes(vertexes3d);
		model3d.indexes = indexesClone;
		model3d.macroIndexesMap = new Map(this.macroIndexes);
		model3d.colors = [...this.colors];
		model3d.colorIndexes = [...this.colorIndexes];
		model3d.alphas = [...this.alphas];
		model3d.setColorMesh();

		/*
			デバッグ用
			computed radius だかが NaN になって困ったら使う
		*/
		// for (let i = 0; i < model3d.vertexes.length; i++) {
		// 	if (model3d.vertexes[i].includes(Number.NaN)) {
		// 		throw new Error(`created Model3D is NaN!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\nindex: ${i}\nvertexes: ${model3d.vertexes[i]}`);
		// 	}
		// }

		return model3d;
	}

	toModel3DParallel(): Model3D {
		const model3d = new Model3D();

		model3d.setVertexes(this.vertexes.map((v) => v.slice(0, 3)));
		model3d.indexes = this.indexes;
		model3d.colors = this.colors;
		model3d.colorIndexes = this.colorIndexes;
		model3d.alphas = [...this.alphas];
		model3d.setColorMesh();

		return model3d;
	}

	toThreeVertexes(): Float32Array {
		return new Float32Array(this.vertexes.flat());
	}

	setColorMesh() {
		this.geometry.clearGroups();
		let colorToIndex = 0;

		for (let i = 0; i < this.colors.length; i++) {
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
		}

		for (let i = 0; i < this.colorIndexes.length; i++) {
			if (this.colorIndexes[i] === null) {
				throw new Error(`undefined: ${this.colorIndexes[i]}`);
			}

			this.geometry.addGroup(colorToIndex, 3, this.colorIndexes[i]);
			colorToIndex += 3;
		}
	}
}
