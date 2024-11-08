import type { ThreeMFLoader } from "three/examples/jsm/Addons.js";
import { PolygonStrip3D } from "./PolygonStrip3D";
import type { ArrayOfColorRGB } from "./TypeUtilities";
import type * as THREE from "three";

export class Model3D {
	vertexes: number[][] = [];
	parts: PolygonStrip3D[] = [];
	indexes: number[][] = [];

	constructor();
	constructor(m: Model3D);

	constructor(m?: Model3D) {
		if (m) {
			this.vertexes = [...m.vertexes];
			for (const p of m.parts) {
				this.parts.push(new PolygonStrip3D(p));
			}
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

	setParts(partsIndexes: number[][], colors?: ArrayOfColorRGB[]) {
		this.indexes = partsIndexes;
		for (let i = 0; i < partsIndexes.length; i++) {
			const indexes = partsIndexes[i];

			if (indexes.length < 3) {
				console.warn(
					`partsIndexes[${i}] length is too few (al least 3 length).`,
				);
			}
			const vs: number[][] = [];
			for (let j = 0; j < indexes.length; j++) {
				vs.push(this.vertexes[indexes[j]]);
			}
			this.parts.push(new PolygonStrip3D([...vs]));
			if (colors?.[i]) {
				const talePart = this.parts.at(-1);
				if (talePart) {
					talePart.setColor(...colors[i]);
				}
			}
		}
	}

	affine(m: number[][]) {
		for (const part of this.parts) {
			part.affine(m);
		}
	}

	toThreeVertexes(): Float32Array {
		return new Float32Array(this.vertexes.flat());
	}

	toTrianglesIndex(): Uint32Array {
		const trianglesVertexesArray: number[] = [];

		for (let i = 0; i < this.parts.length; i++) {
			trianglesVertexesArray.push(...this.onePolygonToTrianglesIndexes(i));
		}

		return new Uint32Array(trianglesVertexesArray);
	}

	setColorMesh() {
		for (let i = 0; i < this.parts.length; i++) {
			this.parts[i].setColorMesh();
		}
	}

	meshToScene(scene: THREE.Scene) {
		for (let i = 0; i < this.parts.length; i++) {
			const m = this.parts[i].mesh;
			if (m) {
				scene.add(m);
			}
		}
	}

	private onePolygonToTrianglesIndexes(index: number): number[] {
		const onePolygonIndexes: number[] = [...this.indexes[index]];
		const ret: number[] = [];

		for (let i = 0; i < onePolygonIndexes.length - 2; i++) {
			if (i % 2 === 0) {
				ret.push(
					onePolygonIndexes[i],
					onePolygonIndexes[i + 1],
					onePolygonIndexes[i + 2],
				);
			} else {
				ret.push(
					onePolygonIndexes[i],
					onePolygonIndexes[i + 2],
					onePolygonIndexes[i + 1],
				);
			}
		}

		return ret;
	}

	private getPolygons(): number[][][] {
		const polygons: number[][][] = [];

		for (let i = 0; i < this.parts.length; i++) {
			polygons.push(this.parts[i].getPolygons());
		}

		return polygons;
	}
}
