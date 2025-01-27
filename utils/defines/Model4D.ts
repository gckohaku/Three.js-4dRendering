import { concat, divide, dotDivide, multiply } from "mathjs";
import * as THREE from "three";
import * as PolygonUtilities from "@/utils/polygonUtilities";
import type { ArrayOfColorRGB, ArrayOfColorRGBA } from "../typeUtilities";
import { Model3D } from "./Model3D";

export class Model4D {
	vertexes: number[][] = [];
	indexes: number[][][] = [];
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

		for (let i = 0; i < partsIndexes.length; i++) {
			let count = partsIndexes[i].length - 2;
			while (count > 0) {
				this.colorIndexes.push(i);

				count--;
			}
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

		this.geometry.setIndex(new THREE.BufferAttribute(this.toTrianglesIndex(), 1));
		this.setColorMesh();
		console.log(this.vertexes);
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
		perspective4dMatrix: number[][] = multiply(
			[
				[706.7557097471259, 0, 0, 0],
				[0, 706.7557097471259, 0, 0],
				[0, 0, 706.7557097471259, 0],
				[0, 0, 0, 1],
			],
			[
				[1, 0, 0, 0, 0],
				[0, 1, 0, 0, 0],
				[0, 0, 1, 0, 0],
				[0, 0, 0, 1, -500],
			],
		) as number[][],
	): Model3D {
		const model3d = new Model3D();
		const vertexes3d: number[][] = [];

		for (let i = 0; i < this.vertexes.length; i++) {
			const perspectivePos = multiply(perspective4dMatrix, concat(this.vertexes[i], [1])) as number[];
			if (this.vertexes[i].length > 4 || this.indexes[i].length > 4) {
				throw new Error(`array length is argument\nindex: ${i}\n${this.vertexes[i]}`);
			}
			const pos3d = perspectivePos.slice(0, 3);
			vertexes3d.push(divide(pos3d, perspectivePos[3]) as number[]);
		}

		model3d.setVertexes(vertexes3d);
		model3d.indexes = this.indexes;
		model3d.colors = this.colors;
		model3d.colorIndexes = this.colorIndexes;
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
		model3d.setParts(this.indexes, this.colors);
		model3d.alphas = [...this.alphas];
		model3d.setColorMesh();

		return model3d;
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

			// for (let triangleIndex = 0; triangleIndex < this.indexes[i].length - 2; triangleIndex++) {
			// 	this.geometry.addGroup(colorToIndex, 3, i);
			// 	colorToIndex += 3;
			// }
		}

		for (let i = 0; i < this.colorIndexes.length; i++) {
			if (this.colorIndexes[i] === null) {
				throw new Error(`undefined: ${this.colorIndexes[i]}`);
			}

			this.geometry.addGroup(colorToIndex, 3, this.colorIndexes[i]);
			colorToIndex += 3;
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
}
