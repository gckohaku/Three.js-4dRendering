import { add, chain, concat, divide, multiply, subtract, transpose, type MathType } from "mathjs";
import * as THREE from "three";
import * as PolygonUtilities from "@/utils/polygonUtilities";
import type { ArrayOfColorRGB, ArrayOfColorRGBA } from "../typeUtilities";
import { Model3D } from "./Model3D";
import type { PolygonIndexes, PolygonPart, TrianglePolygon } from "./polygonTypes";
import { viewport } from "three/tsl";
import * as TupleUtilities from "@/utils/tupleUtilities";
import { AscendingTupleMap } from "./AscendingTupleMap";

export class Model4D {
	vertexes: number[][] = [];
	indexes: PolygonIndexes = [];
	macroIndexes: number[][] = [];
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
			this.vertexes = structuredClone(m.vertexes);
			this.indexes = structuredClone(m.indexes);
			this.macroIndexes = m.macroIndexes;
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
	}

	addVertexes(vs: number[][]) {
		for (let i = 0; i < vs.length; i++) {
			this.vertexes.push(vs[i]);
		}
	}

	setParts(partsIndexes: number[][], colors?: (ArrayOfColorRGB | ArrayOfColorRGBA)[]) {
		this.indexes = PolygonUtilities.toAllTrianglePolygons(partsIndexes);
		this.macroIndexes = partsIndexes;

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
		near = -400,
	): Model3D {
		const logTimeManager = logTimeManagerStore();

		const vertexesView: number[][] = [];
		const ignoreVertexIndexes: number[] = [];
		const cuttingPointMap = new AscendingTupleMap();

		// カメラ座標への変換
		for (let i = 0; i < this.vertexes.length; i++) {
			const viewPosition = multiply(cameraExternalMatrix, concat(this.vertexes[i], [1])) as number[];

			if (this.vertexes[i].length > 4) {
				throw new Error(`array length is argument\nindex: ${i}\n${this.vertexes[i]}`);
			}

			vertexesView.push(viewPosition);

			// ここの if はいらない可能性がある (ignoreVertexIndexes 自体がいらないかも)
			if (viewPosition[3] > near) {
				if (logTimeManager.isPushLog()) {
					// console.log("over: ", i);
				}

				ignoreVertexIndexes.push(i);
			}
		}

		const vertexesLengthBeforeProcess = this.vertexes.length;

		// カメラの裏側に来ている頂点の処理
		for (const ignoreIndex of ignoreVertexIndexes) {
			const relatedTriangles = this.indexes.flat().filter((triangle) => triangle.includes(ignoreIndex));
			for (const triangle of relatedTriangles) {
				const relatedVertexes = triangle.filter((index) => index !== ignoreIndex);

				for (const index of relatedVertexes) {
					if (!ignoreVertexIndexes.includes(index) && !cuttingPointMap.has([ignoreIndex, index])) {
						if (vertexesView[index][3] > near) {
							throw new Error("something went wrong");
						}
						const direction: number[] = subtract(vertexesView[triangle[2]], vertexesView[triangle[0]]);
						const newVertex = add<number[]>(
							vertexesView[triangle[0]],
							multiply(divide(-(near - 1) - vertexesView[triangle[0]][3], direction[3]) as number, direction) as number[],
						);

						const newIndex = vertexesView.push(newVertex) - 1;
						cuttingPointMap.set([index, ignoreIndex], newIndex);
					}
				}
			}
		}

		if (logTimeManager.isPushLog()) {
			console.log(vertexesView);
		}

		const indexesClone = structuredClone(this.indexes);

		for (let partsIndex = 0; partsIndex < indexesClone.length; partsIndex++) {
			const polygon = indexesClone[partsIndex];
			let beforeIndex = 0;

			for (let triangleIndex = 0; triangleIndex < polygon.length; triangleIndex++) {
				const isMatchBeforeIndexEven = beforeIndex % 2 === triangleIndex % 2;
				const triangle = polygon[triangleIndex];
				const ignoreIndexes = triangle.filter((index) => vertexesView[index][3] > near);

				// 三角形に 4D カメラの裏側に頂点がある場合、除外、ポリゴンの再形成を行う
				if (ignoreIndexes.length === 1) {
					const firstIndex = ignoreIndexes[0] === triangle[0] ? (cuttingPointMap.get([triangle[0], triangle[1]]) ?? -1) : triangle[0];
					const secondIndex = ignoreIndexes[0] === triangle[1] ? (cuttingPointMap.get([triangle[0], triangle[1]]) ?? -1) : triangle[1];
					const thirdIndex = ignoreIndexes[0] !== triangle[1] ? (cuttingPointMap.get([triangle[0], triangle[2]]) ?? -1) : triangle[2];
					const forthIndex = ignoreIndexes[0] !== triangle[0] ? (cuttingPointMap.get([triangle[1], triangle[2]]) ?? -1) : triangle[2];

					const newFirstTriangle = [firstIndex, secondIndex, thirdIndex];
					const newSecondTriangle = [secondIndex, forthIndex, thirdIndex];

					polygon.splice(triangleIndex++, 1, newFirstTriangle, newSecondTriangle);
				} else if (ignoreIndexes.length === 2) {
					// 値を const で保持したいので、即時関数 (=ラムダ式) を使用 (三項演算子だと三項演算子自体のネストが必要になり見づらい)
					// というかこれに関しては共通化できそう？
					const firstIndex = (() => {
						if (ignoreIndexes.includes(triangle[0])) {
							if (ignoreIndexes.includes(triangle[1])) {
								return cuttingPointMap.get([triangle[0], triangle[2]]) ?? -1;
							}
							return cuttingPointMap.get([triangle[0], triangle[1]]) ?? -1;
						}
						return triangle[0];
					})();
					const secondIndex = (() => {
						if (ignoreIndexes.includes(triangle[1])) {
							if (ignoreIndexes.includes(triangle[0])) {
								return cuttingPointMap.get([triangle[1], triangle[2]]) ?? -1;
							}
							return cuttingPointMap.get([triangle[0], triangle[1]]) ?? -1;
						}
						return triangle[1];
					})();
					const thirdIndex = (() => {
						if (ignoreIndexes.includes(triangle[2])) {
							if (ignoreIndexes.includes(triangle[0])) {
								return cuttingPointMap.get([triangle[1], triangle[2]]) ?? -1;
							}
							return cuttingPointMap.get([triangle[0], triangle[2]]) ?? -1;
						}
						return triangle[2];
					})();

					const newIndex = [firstIndex, secondIndex, thirdIndex];

					polygon.splice(triangleIndex, 1, newIndex);
				} else if (ignoreIndexes.length === 3) {
					polygon.splice(triangleIndex--, 1);
				}

				beforeIndex++;
			}

			// 有効なポリゴンの形式に変換
			const newIndexes: PolygonPart = PolygonUtilities.onePolygonIndexToTriangles(PolygonUtilities.toMacroIndexes(polygon));
			indexesClone[partsIndex] = newIndexes;
		}

		const model3d = new Model3D();
		const vertexes3d: number[][] = [];

		// 三次元座標への変換
		for (let i = 0; i < vertexesView.length; i++) {
			vertexes3d.push(chain(cameraInternalMatrix).multiply(vertexesView[i]).divide(vertexesView[i][3]).done() as number[]);
		}

		model3d.setVertexes(vertexes3d);
		model3d.indexes = structuredClone(indexesClone);
		model3d.macroIndexes = structuredClone(this.macroIndexes);
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
