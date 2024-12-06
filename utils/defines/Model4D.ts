import { concat, multiply } from "mathjs";
import * as THREE from "three";
import type { ArrayOfColorRGB, ArrayOfColorRGBA } from "../typeUtilities";

export class Model4D {
	vertexes: number[][] = [];
	indexes: number[][] = [];
	colors: ArrayOfColorRGB[] = [];
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

	affine(m: number[][]): Model4D {
		const logTimeManager = logTimeManagerStore();

		// m が五行五列である必要がある。五行五列でない場合はエラーが発生する
		const threeMatrix = new THREE.Matrix4().set(...(m.flat() as Parameters<InstanceType<typeof THREE.Matrix4>["set"]>));
		const returnedModel = new Model4D(this);

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
