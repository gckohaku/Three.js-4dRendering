import { multiply } from "mathjs";
import type { ArrayOfColorRGB } from "./TypeUtilities";
import * as THREE from "three";

export class PolygonStrip3D {
	vertexes: number[][];
	color: ArrayOfColorRGB = [0, 128, 0];
	geometry?: THREE.BufferGeometry;
	material?: THREE.Material;
	mesh?: THREE.Mesh;

	constructor(polyStrip3d: PolygonStrip3D);
	constructor(vertexes: number[][]);

	constructor(arg: PolygonStrip3D | number[][]) {
		if (arg instanceof PolygonStrip3D) {
			this.vertexes = [...arg.vertexes];
			this.color = [...arg.color];
		} else {
			if (arg.length < 3) {
				throw new Error(
					"Polygon Strip 3d construction error:\nvertexes parameter length is too few.",
				);
			}
			this.vertexes = [...arg];
		}
	}

	setColor(r: number, g: number, b: number) {
		const c = this.color;
		c[0] = r;
		c[1] = g;
		c[2] = b;
	}

	getPolygons(): number[][] {
		const retArray: number[][] = structuredClone(this.vertexes);

		return retArray;
	}

	getPolygonOfIndex(index: number): [number[], number[], number[]] {
		if (index + 2 >= this.vertexes.length) {
			throw new Error(
				`Error in PolygonStrip3D.getPolygonsOfIndex(): polygon of specified index don't exists.`,
			);
		}

		const v = this.vertexes;

		if (index % 2 === 0) {
			return [v[index], v[index + 1], v[index + 2]];
		}

		return [v[index], v[index + 2], v[index + 1]];
	}

	affine(m: number[][]) {
		const vs = this.vertexes;
		for (let i = 0; i < vs.length; i++) {
			vs[i] = multiply(m, vs[i]) as number[];
		}
	}

	toTriangles(): number[] {
		const ret: number[] = [];

		for (let i = 0; i < this.vertexes.length - 2; i++) {
			ret.push(...this.getPolygonOfIndex(i).flat());
		}

		return ret;
	}

	toTrianglesIndexes(): number[] {
		const ret: number[] = [];

		for (let i = 0; i < this.vertexes.length - 2; i++) {
			if (i % 2 === 0) {
				ret.push(i, i + 1, i + 2);
			}
			else {
				ret.push(i, i + 2, i + 1);
			}
		}

		return ret;
	}

	setMesh(geometry: THREE.BufferGeometry, material: THREE.Material) {
		this.geometry = geometry;
		this.material = material;

		this.mesh = new THREE.Mesh(geometry, material);
	}

	setColorMesh() {
		this.geometry = new THREE.BufferGeometry()
		this.geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(this.vertexes.flat()), 3));
		this.geometry.setIndex(this.toTrianglesIndexes());

		this.material = new THREE.MeshBasicMaterial({color: new THREE.Color().setRGB(...this.color)});

		this.mesh = new THREE.Mesh(this.geometry, this.material);
	};
}
