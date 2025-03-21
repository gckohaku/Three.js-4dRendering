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

	let logTextOfDeleteUnnecessity = `indexPairSet: ${JSON.stringify(indexPairSet.values().toArray())}\n\n`;
	const deleteSegments: [number, number][] = []

	for (const pair of indexPairSet) {
		const firstIndex = pair[0];
		const secondIndex = pair[1];

		logTextOfDeleteUnnecessity += `[${firstIndex}, ${secondIndex}]\n`;

		const indexOfConnectingWithFirst = indexPairSet
			.values()
			.flatMap((pair) => (pair.includes(firstIndex) ? pair.filter((index) => index !== firstIndex) : []))
			.toArray();

			

		const indexOfConnectingWithSecond = indexPairSet
			.values()
			.flatMap((pair) => (pair.includes(secondIndex) ? pair.filter((index) => index !== secondIndex) : []))
			.toArray();
			
			logTextOfDeleteUnnecessity += `\nget connecting:\n\tfirst: ${JSON.stringify(indexOfConnectingWithFirst)}\n\tsecond: ${JSON.stringify(indexOfConnectingWithSecond)}\n\n`

		let connectingCount = 0;
		for (const index of indexOfConnectingWithFirst) {
			if (indexOfConnectingWithSecond.includes(index)) {
				connectingCount++;
			}
		}

		if (connectingCount >= 2) {
			logTextOfDeleteUnnecessity += "delete\n";
			deleteSegments.push(pair);
		}
	}

	for (const segment of deleteSegments) {
		indexPairSet.delete(segment);
	}

	let logTextOfTraceAround = `parameter indexes: ${JSON.stringify(indexes)}\n\nbefore loop\n\n`;

	logTextOfTraceAround += `indexPairSet: ${JSON.stringify(indexPairSet.values().toArray())}\n`;

	const chainFirst = indexPairSet.values().next().value;
	if (!chainFirst) {
		throw new Error(`cannot get chain first\n\n${logTextOfTraceAround}`);
	}
	retArray.push(...chainFirst);
	indexPairSet.delete(chainFirst);

	if (indexPairSet.has(chainFirst)) {
		throw new Error(`chain first is not deleted\n\n${logTextOfTraceAround}`);
	}

	logTextOfTraceAround += `chainFirst: ${JSON.stringify(chainFirst)}\nretArray: ${JSON.stringify(retArray)}\nindexPairSet: ${JSON.stringify(indexPairSet.values().toArray())}\n`;

	logTextOfTraceAround += "\nloop start\n";
	while (true) {
		logTextOfTraceAround += "\n";

		if (indexPairSet.size === 1) {
			const pair = indexPairSet.values().next().value;
			if (pair && retArray.includes(pair[0]) && retArray.includes(pair[1])) {
				break;
			}
			throw new Error(`something went wrong\n\n${logTextOfTraceAround}`);
		}

		const taleIndex = retArray.at(-1);

		if (taleIndex) {
			if (taleIndex === retArray.at(0)) {
				break;
			}

			const chainPair = indexPairSet
				.values()
				.filter((pair) => pair.includes(taleIndex) && !(retArray.includes(pair[0]) && retArray.includes(pair[1])))
				.toArray();

			if (chainPair.length === 0) {
				throw new Error(`indexes is not chainable:\n\n${logTextOfTraceAround}`);
			}
			if (chainPair.length >= 2) {
				throw new Error(`chainPair length is too long: chainPair: ${JSON.stringify(chainPair)}\n\n${logTextOfTraceAround}`);
			}

			retArray.push(chainPair[0][0] === taleIndex ? chainPair[0][1] : chainPair[0][0]);
			indexPairSet.delete(chainPair[0]);
			if (indexPairSet.has(chainPair[0])) {
				throw new Error(`something went wrong\n\n${logTextOfTraceAround}`);
			}

			logTextOfTraceAround += `retArray: ${retArray}\nindexPairSet: ${JSON.stringify(indexPairSet.values().toArray())}\n`;
		}
	}

	logTextOfTraceAround += "\nloop end\n";

	// if (logTimeManager.isPushLog()) {
	// 	console.log(retArray);
	// }

	return retArray;
}
