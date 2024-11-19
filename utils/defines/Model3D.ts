import * as THREE from "three";
import type { ArrayOfColorRGB, ArrayOfColorRGBA } from "./TypeUtilities";
import { NumberController } from "three/examples/jsm/libs/lil-gui.module.min.js";

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

	constructor(m?: Model3D, deepCopies: {vertexes: boolean, indexes: boolean, colors: boolean, materialColors: boolean, alphas: boolean, geometry: boolean} = {vertexes: true, indexes: true, colors: true, materialColors: true, alphas: true, geometry: true}) {
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

	affine(m: THREE.Matrix4): Model3D {
		const returnedModel = new Model3D(this);

		const position = returnedModel.geometry.attributes.position;
		position.applyMatrix4(m);

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
					color: new THREE.Color().setRGB(...this.colors[i].map(v => v / 255) as ArrayOfColorRGB),
					opacity: this.alphas[i],
					transparent: true,
					depthTest: false,
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

	getLineSegments(color: ArrayOfColorRGB, width: number)/*:  THREE.LineSegments */ {
		const lineGeometryIndexes: [number, number][] = [];

		for (const indexesUnit of this.indexes) {
			const currentIndexes = this.checkAscending([indexesUnit[0], indexesUnit[1]])
			if (!lineGeometryIndexes.find(e => e[0] === currentIndexes[0] && e[1] === currentIndexes[1])) {
				lineGeometryIndexes.push(currentIndexes);
			}
			
			
		}
	}

	private checkAscending(tuple: [number, number]): [number, number] {
		if (tuple[0] <= tuple[1]) {
			return tuple;
		}
		return [tuple[1], tuple[0]];
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
