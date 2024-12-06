import { cos, sin, Unit } from "mathjs";

export const makeRotate4DMatrix = (rotateXW: number, rotateYW: number, rotateZW: number, rotateXY: number, rotateYZ: number, rotateXZ: number) => {
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
};
