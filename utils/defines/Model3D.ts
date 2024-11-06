import { PolygonStrip3D } from "./PolygonStrip3D";
import type { ColorRGBArray } from "./TypeUtilities";

export class Model3D {
	vertexes: number[][] = [];
	parts: PolygonStrip3D[] = [];

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

	setParts(partsIndexes: number[][], colors?: ColorRGBArray[]) {
		for (let i = 0; i < partsIndexes.length; i++) {
			const indexes = partsIndexes[i];
			if (indexes.length < 3) {
				console.warn(`partsIndexes[${i}] length is too few (al least 3 length).`);
			}
			const vs: number[][] = [];
			for (let j = 0; j < indexes.length; j++) {
				vs.push(this.vertexes[indexes[j]]);
			}
			this.parts.push(new PolygonStrip3D([...vs]));
			if (colors?.[i]) {
				this.parts.at(-1)!.setColor(...colors[i]);
			}
		}
	}

	affine(m: number[][]) {
		for (const part of this.parts) {
			part.affine(m);
		}
	}

	private getPolygons(): number[][][] {
		const polygons: number[][][] = [];

		for (let i = 0; i < this.parts.length; i++) {
			polygons.push(this.parts[i].getPolygons());
		}

		return polygons;
	}
}