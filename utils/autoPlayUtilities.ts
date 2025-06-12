export function thereAndBackDeltaPosition(currentTime: number, init: number, min: number, max: number, delta: number): number {
	if (delta === 0) {
		return init;
	}

	const logTimeManager = logTimeManagerStore();

	const range = max - min;
	const aroundTime = (range * 2) / Math.abs(delta);
	const initPosition = (init - min) / range;
	const currentAroundValue = currentTime / aroundTime;
	const currentAroundTimeOffsetAngle = (currentTime % aroundTime) * 2 * Math.PI / range;

	const initAngle = ((delta > 0 ? 1 : -1) * Math.PI * initPosition) / aroundTime;
	// const angleOffsetByDelta = delta > 0 ? 0 : Math.PI;

	const currentPosition = Math.acos(Math.cos(initAngle + currentAroundTimeOffsetAngle)) / Math.PI;

	if (logTimeManager.isPushLog()) {
		console.log(`currentTime: ${currentTime}, init: ${init}, min: ${min}, max: ${max}, delta: ${delta}`);
		console.log(
			`range: ${range}, aroundTime: ${aroundTime}, initPosition: ${initPosition}, currentAroundValue: ${currentAroundValue}, currentAroundTimeOffsetAngle: ${currentAroundTimeOffsetAngle}`,
		);
		console.log(`initAngle: ${initAngle}, currentPosition: ${currentPosition}`);
	}

	return min + currentPosition * range;
}
