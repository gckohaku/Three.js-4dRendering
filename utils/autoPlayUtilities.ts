export function thereAndBackDeltaPosition(currentTime: number, init: number, min: number, max: number, delta: number): number {
	if (delta === 0) {
		return init;
	}

	const range = max - min;
	const aroundTime = (range * 2) / Math.abs(delta);
	const initPosition = (init - min) / range;
	const currentAroundValue = currentTime / aroundTime;
	const currentAroundTimeOffsetAngle = (currentTime % aroundTime) / aroundTime * Math.PI * 2;

	const initAngle = ((delta > 0 ? 1 : -1) * Math.PI * initPosition);

	const currentPosition = Math.acos(Math.cos(initAngle + currentAroundTimeOffsetAngle)) / Math.PI;

	return min + currentPosition * range;
}

export function thereAndBackTimePosition(currentTime: number, init: number, min: number, max: number, time: number, firstDirection: "+" | "-"): number {
	if (time === 0) {
		return init;
	}

	const range = max - min;
	const aroundTime = time;
	const initPosition = (init - min) / range;
	const currentAroundTimeOffsetAngle = (currentTime % aroundTime) / aroundTime * Math.PI * 2;

	const initAngle = ((firstDirection === "+" ? 1 : -1) * Math.PI * initPosition);
	
	const currentPosition = Math.acos(Math.cos(initAngle + currentAroundTimeOffsetAngle)) / Math.PI;

	return min + currentPosition * range;
}