import { retarget } from "three/examples/jsm/utils/SkeletonUtils.js";
import { AscendingTupleSet } from "./defines/AscendingTupleSet";
import type { PolygonIndexes, PolygonPart } from "./defines/polygonTypes";
import { pushScopeId } from "vue";

export function toAllTrianglePolygons(polygonIndexes: number[][]): PolygonIndexes {
	const trianglesIndexes: number[][][] = [];

	for (let i = 0; i < polygonIndexes.length; i++) {
		const unitIndexes: number[][] = [];

		trianglesIndexes.push(onePolygonIndexToTriangles(polygonIndexes[i]));
	}

	return trianglesIndexes;
}

export function onePolygonIndexToTriangles(monoIndexes: number[]): number[][] {
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
	if (indexes.length === 0) {
		return [];
	}

	const logTimeManager = logTimeManagerStore();

	const cloneIndexes = structuredClone(indexes);

	const retArray: number[] = [];

	const indexPairSet = new AscendingTupleSet();

	for (const triangle of cloneIndexes) {
		if (triangle.length !== 3) {
			throw new Error(`triangle index length is not 3\nlength: ${triangle.length}`);
		}

		indexPairSet.add([triangle[0], triangle[1]]).add([triangle[0], triangle[2]]).add([triangle[1], triangle[2]]);
	}

	// console.log(indexPairSet);

	for (const pair of indexPairSet) {
		const firstIndex = pair[0];
		const secondIndex = pair[1];

		const indexOfConnectingWithFirst = indexPairSet
			.values()
			.flatMap((pair) => (pair.includes(firstIndex) ? pair.filter((index) => index !== firstIndex) : []))
			.toArray();

		const indexOfConnectingWithSecond = indexPairSet
			.values()
			.flatMap((pair) => (pair.includes(secondIndex) ? pair.filter((index) => index !== secondIndex) : []))
			.toArray();

		let connectingCount = 0;
		for (const index of indexOfConnectingWithFirst) {
			if (indexOfConnectingWithSecond.includes(index)) {
				connectingCount++;
			}
		}

		if (connectingCount >= 2) {
			indexPairSet.delete(pair);
		}
	}

	// const indexPairArray = indexPairSet.values().toArray();

	const chainFirst = indexPairSet.values().next().value;
	if (!chainFirst) {
		throw new Error("cannot get chain first");
	}
	retArray.push(...chainFirst);
	indexPairSet.delete(chainFirst);

	while (true) {
		if (indexPairSet.size === 1) {
			const pair = indexPairSet.values().next().value;
			if (pair && retArray.includes(pair[0]) && retArray.includes(pair[1])) {
				break;
			}
			throw new Error("something went wrong");
		}

		const taleIndex = retArray.at(-1);

		if (taleIndex) {
			if (taleIndex === retArray.at(0)) {
				if (logTimeManager.isPushLog()) {
					console.log(retArray, taleIndex);
				} 
				break;
			}

			const chainPair = indexPairSet.values().filter((pair) => pair.includes(taleIndex) && !(retArray.includes(pair[0]) && retArray.includes(pair[1]))).toArray();

			if (chainPair.length === 0) {
				throw new Error(`indexes is not chainable:\nindexes: ${JSON.stringify(indexes)}\nindexPairArray: ${JSON.stringify(indexPairSet.values().toArray())}\nretArray: ${retArray}`);
			}
			if (chainPair.length >= 2) {
				throw new Error(`chainPair length is too long: chainPair: ${JSON.stringify(chainPair)}`);
			}

			retArray.push(chainPair[0][0] === taleIndex ? chainPair[0][1] : chainPair[0][0]);
			indexPairSet.delete(chainPair[0]);
		}
	}

	if (logTimeManager.isPushLog()) {
		console.log(retArray);
	} 

	return retArray;
}
