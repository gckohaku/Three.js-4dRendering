export function toAllTrianglePolygons(polygonIndexes: number[][]): number[][][] {
	const trianglesIndexesArray: number[] = [];

	for (let i = 0; i < polygonIndexes.length; i++) {


		trianglesIndexesArray.push(...onePolygonIndexToTriangles(polygonIndexes[i]));
	}

	return trianglesIndexesArray.map((_value: number, index: number, arr: number[]) => (index % 3 ? [] : [arr.slice(index, index + 3)]));
}

function onePolygonIndexToTriangles(monoIndexes: number[]): number[] {
	const ret: number[] = [];

	for (let i = 0; i < monoIndexes.length - 2; i++) {
		if (i % 2 === 0) {
			ret.push(monoIndexes[i], monoIndexes[i + 1], monoIndexes[i + 2]);
		} else {
			ret.push(monoIndexes[i], monoIndexes[i + 2], monoIndexes[i + 1]);
		}
	}

	return ret;
}