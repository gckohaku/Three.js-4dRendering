import { add, chain, concat, cos, multiply, pow, sin, subtract, Unit } from "mathjs";

export const makeRotate3DMatrix = (rotateX: number, rotateY: number, rotateZ: number): number[][] => {
	const unitRX = new Unit(rotateX, "deg");
	const unitRY = new Unit(rotateY, "deg");
	const unitRZ = new Unit(rotateZ, "deg");

	const sinRX = sin(unitRX);
	const cosRX = cos(unitRX);
	const sinRY = sin(unitRY);
	const cosRY = cos(unitRY);
	const sinRZ = sin(unitRZ);
	const cosRZ = cos(unitRZ);

	const rotateMatrixX = [
		[1, 0, 0],
		[0, cosRX, -sinRX],
		[0, sinRX, cosRX],
	];
	const rotateMatrixY = [
		[cosRY, 0, sinRY],
		[0, 1, 0],
		[-sinRY, 0, cosRY],
	];
	const rotateMatrixZ = [
		[cosRZ, -sinRZ, 0],
		[sinRZ, cosRZ, 0],
		[0, 0, 1],
	];

	return chain(rotateMatrixZ).multiply(rotateMatrixY).multiply(rotateMatrixX).done() as number[][];
};

export const makeRotate3DMatrix44 = (rotateX: number, rotateY: number, rotateZ: number): number[][] => {
	const matrix33 = makeRotate3DMatrix(rotateX, rotateY, rotateZ);
	const matrix34 = concat(matrix33, [[0], [0], [0]]);
	const matrix44 = concat(matrix34, [[0, 0, 0, 1]], 0);
	return matrix44 as number[][];
};

export const getMatrixMulMonoCellResult = (m1: number[][], m2: number[][], index1: number, index2: number) => {
	const len = m1[index1].length;
	let res = 0;
	for (let i = 0; i < len; i++) {
		res += m1[index1][i] * m2[i][index2];
	}
	return res;
};

export const makeRodriguesRotationMatrix = (radian: number, normalizeVector: number[]): number[][] => {
	const sinRotate = sin(radian);
	const cosRotate = cos(radian);
	const versinRotate = 1 - cosRotate;
	const n1n2versin = multiply(normalizeVector[0], normalizeVector[1], versinRotate);
	const n2n3versin = multiply(normalizeVector[1], normalizeVector[2], versinRotate);
	const n1n3versin = multiply(normalizeVector[0], normalizeVector[2], versinRotate);

	const rotateMatrix = [
		[
			add(cosRotate, multiply(pow(normalizeVector[0], 2), versinRotate)),
			subtract(n1n2versin, multiply(normalizeVector[2], sinRotate)),
			add(n1n3versin, multiply(normalizeVector[1], sinRotate)),
		],
		[
			add(n1n2versin, multiply(normalizeVector[2], sinRotate)),
			add(cosRotate, multiply(pow(normalizeVector[1], 2), versinRotate)),
			subtract(n2n3versin, multiply(normalizeVector[0], sinRotate)),
		],
		[
			subtract(n1n3versin, multiply(normalizeVector[1], sinRotate)),
			add(n2n3versin, multiply(normalizeVector[0], sinRotate)),
			add(cosRotate, multiply(pow(normalizeVector[2], 2), versinRotate)),
		],
	] as number[][];

	return rotateMatrix;
};
