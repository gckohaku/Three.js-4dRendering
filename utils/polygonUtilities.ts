export function toAllTrianglePolygons(polygonIndexes: number[][]): number[][][] {
	const trianglesIndexes: number[][][] = [];

	for (let i = 0; i < polygonIndexes.length; i++) {
		const unitIndexes: number[][] = [];

		trianglesIndexes.push(onePolygonIndexToTriangles(polygonIndexes[i]));
	}

	return trianglesIndexes;
}

function onePolygonIndexToTriangles(monoIndexes: number[]): number[][] {
	const ret: number[][] = [];

	for (let i = 0; i < monoIndexes.length - 2; i++) {
		if (i % 2 === 0) {
			ret.push([monoIndexes[i], monoIndexes[i + 1], monoIndexes[i + 2]]);
		} else {
			ret.push([monoIndexes[i], monoIndexes[i + 2], monoIndexes[i + 1]]);
		}
	}

	return ret;
}

export function getComulativeIndexCounts(indexes: number[][][]): number[] {
	const comulativeIndexCounts: number[] = [0];

	for (let i = 0; i < indexes.length; i++) {
		comulativeIndexCounts.push(indexes[i].length + 2);
	}

	return comulativeIndexCounts;
}

export function getMacroIndexesMap(indexes: number[][][]): Map<number, number> {
	// macroIndex -> truthIndex
	const returnedMap = new Map<number, number>();
	let macroIndexCount = 0;
	let truthIndexCount = 0;

	for (let i = 0; i < indexes.length; i++) {
		for (let j = 0; j < indexes[i].length; j++) {
			if (j === indexes[i].length - 1) {
				for (let times = 0; times < 3; times++) {
					returnedMap.set(macroIndexCount++, truthIndexCount++);
				}
				continue;
			}
			returnedMap.set(macroIndexCount++, truthIndexCount);
			truthIndexCount += 3;
		}
	}

	return returnedMap;
} 