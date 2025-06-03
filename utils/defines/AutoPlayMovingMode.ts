export const autoPlayMovingMode = ["rolling", "thereAndBackDelta", "thereAndBackTime"] as const;

export type AutoPlayMovingMode = (typeof autoPlayMovingMode)[number];

export const isAutoPlayMovingMode = (value: string): value is AutoPlayMovingMode => {
	return autoPlayMovingMode.includes(value);
}