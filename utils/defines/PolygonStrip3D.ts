import { multiply } from "mathjs";
import type { ColorRGBArray } from "./TypeUtilities";

export class PolygonStrip3D {
	vertexes: number[][];
	color: ColorRGBArray = [0, 128, 0];

	constructor(polyStrip3d: PolygonStrip3D);
	constructor(vertexes: number[][]);

	constructor(arg: PolygonStrip3D | number[][]) {
		if (arg instanceof PolygonStrip3D) {
			this.vertexes = [...arg.vertexes];
			this.color = [...arg.color];
		}
		else {
			if (arg.length < 3) {
				throw new Error(`Polygon Strip 3d construction error:\nvertexes parameter length is too few.`);
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
			throw new Error(`Error in PolygonStrip3D.getPolygonsOfIndex(): polygon of specified index don't exists.`);
		}

		const v = this.vertexes;

		if (index % 2 === 0) {
			return [v[index], v[index + 1], v[index + 2]];
		}
		else {
			return [v[index], v[index + 2], v[index + 1]];
		}
	}

	affine(m: number[][]) {
		const vs = this.vertexes;
		for (let i = 0; i < vs.length; i++) {
			vs[i] = multiply(m, vs[i]) as number[];
		}
	}
}