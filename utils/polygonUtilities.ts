import { index } from "mathjs";
import { AscendingTupleSet } from "./defines/AscendingTupleSet";
import type { PolygonIndexes, PolygonPart } from "./defines/polygonTypes";

export function toAllTrianglePolygons(polygonIndexes: number[][]): PolygonIndexes {
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

export function getCumulativeIndexCounts(indexes: PolygonIndexes): number[] {
	const cumulativeIndexCounts: number[] = [0];

	for (let i = 0; i < indexes.length; i++) {
		cumulativeIndexCounts.push(indexes[i].length + 2);
	}

	return cumulativeIndexCounts;
}

export function getMacroIndexesMap(indexes: PolygonIndexes): Map<number, number> {
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

export function toMacroIndexes(indexes: PolygonPart): number[] {
	const cloneIndexes = structuredClone(indexes);
	for (let i = 1; i < cloneIndexes.length; i += 2) {
		[cloneIndexes[i][1], cloneIndexes[i][2]] = [cloneIndexes[i][2], cloneIndexes[i][1]];
	}

	const retArray: number[] = [];

	for (let i = 0; i < cloneIndexes.length; i++) {
		if (i === cloneIndexes.length - 1) {
			retArray.push(...cloneIndexes[i]);
			continue;
		}
		retArray.push(cloneIndexes[i][0]);
	}

	const indexPairSet = new AscendingTupleSet();

	for (const triangle of cloneIndexes) {
		if (triangle.length !== 3) {
			throw new Error(`triangle index length is not 3\nlength: ${triangle.length}`);
		}

		indexPairSet.add([triangle[0], triangle[1]]).add([triangle[0], triangle[2]]).add([triangle[1], triangle[2]]);
	}

	for (const pair of indexPairSet) {
		const firstIndex = pair[0];
		const secondIndex = pair[1];

		const indexOfConnectingWithFirst = indexPairSet
			.values()
			.filter((pair) => pair.includes(firstIndex))
			.map((pair) => pair.filter((index) => index !== firstIndex))
			.toArray()
			.flat();
	}

	return retArray;
}
