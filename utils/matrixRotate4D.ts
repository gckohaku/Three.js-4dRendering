import { concat, cos, multiply, sin, Unit, type MathCollection, type MathType } from "mathjs";

export const makeRotate4DMatrix = (rotateXW: number, rotateYW: number, rotateZW: number, rotateXY: number, rotateYZ: number, rotateXZ: number): number[][] => {
	const rotationOrder = rotationOrderStore();
	const logTimeManager = logTimeManagerStore();

	const unitRXW = new Unit(rotateXW, "deg");
	const unitRYW = new Unit(rotateYW, "deg");
	const unitRZW = new Unit(rotateZW, "deg");
	const unitRXY = new Unit(rotateXY, "deg");
	const unitRYZ = new Unit(rotateYZ, "deg");
	const unitRXZ = new Unit(rotateXZ, "deg");

	const sinRXW = sin(unitRXW);
	const cosRXW = cos(unitRXW);
	const sinRYW = sin(unitRYW);
	const cosRYW = cos(unitRYW);
	const sinRZW = sin(unitRZW);
	const cosRZW = cos(unitRZW);
	const sinRXY = sin(unitRXY);
	const cosRXY = cos(unitRXY);
	const sinRYZ = sin(unitRYZ);
	const cosRYZ = cos(unitRYZ);
	const sinRXZ = sin(unitRXZ);
	const cosRXZ = cos(unitRXZ);

	const rotateMatrixXW = [
		[1, 0, 0, 0],
		[0, cosRXW, -sinRXW, 0],
		[0, sinRXW, cosRXW, 0],
		[0, 0, 0, 1],
	];
	const rotateMatrixYW = [
		[cosRYW, 0, sinRYW, 0],
		[0, 1, 0, 0],
		[-sinRYW, 0, cosRYW, 0],
		[0, 0, 0, 1],
	];
	const rotateMatrixZW = [
		[cosRZW, -sinRZW, 0, 0],
		[sinRZW, cosRZW, 0, 0],
		[0, 0, 1, 0],
		[0, 0, 0, 1],
	];
	const rotateMatrixXY = [
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, cosRXY, -sinRXY],
		[0, 0, sinRXY, cosRXY],
	];
	const rotateMatrixYZ = [
		[cosRYZ, 0, 0, sinRYZ],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[-sinRYZ, 0, 0, cosRYZ],
	];
	const rotateMatrixXZ = [
		[1, 0, 0, 0],
		[0, cosRXZ, 0, -sinRXZ],
		[0, 0, 1, 0],
		[0, sinRXZ, 0, cosRXZ],
	];

	const rotateMatrices: Map<string, number[][]> = new Map();
	rotateMatrices.set("xw", rotateMatrixXW);
	rotateMatrices.set("yw", rotateMatrixYW);
	rotateMatrices.set("zw", rotateMatrixZW);
	rotateMatrices.set("xy", rotateMatrixXY);
	rotateMatrices.set("yz", rotateMatrixYZ);
	rotateMatrices.set("xz", rotateMatrixXZ);

	const orderList = rotationOrder.orderList;

	const lastRotateKey = orderList.at(-1);

	if (!lastRotateKey) {
		throw new Error("rotate order list is undefined in matrixRotate4D.ts");
	}

	let retMatrix = rotateMatrices.get(lastRotateKey);

	for (let i = orderList.length - 2; i >= 0; i--) {
		const currentMatrix = rotateMatrices.get(orderList[i]);
		if (!retMatrix || !currentMatrix) {
			throw new Error("matrix is undefined in matrixRotate4D.ts");
		}

		retMatrix = multiply<MathCollection>(retMatrix, currentMatrix) as number[][];
	}

	if (!retMatrix) {
		throw new Error("matrix is undefined in matrixRotate4D.ts");
	}

	return retMatrix;
};

export const makeRotate4DMatrix55 = (rotateXW: number, rotateYW: number, rotateZW: number, rotateXY: number, rotateYZ: number, rotateXZ: number): number[][] => {
	const matrix44 = makeRotate4DMatrix(rotateXW, rotateYW, rotateZW, rotateXY, rotateYZ, rotateXZ);
	const matrix45 = concat(matrix44, [[0], [0], [0], [0]]);
	const matrix55 = concat(matrix45, [[0, 0, 0, 0, 1]], 0);
	return matrix55 as number[][];
}