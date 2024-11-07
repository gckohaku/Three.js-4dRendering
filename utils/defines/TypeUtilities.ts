export type Shift<T extends readonly unknown[]> = T extends [infer F, ...infer U] ? U : T;

export type FixedArray<T, Value> = [...T[]] & { length: Value };

/**
 * [red, green, blue]
 */
export type ArrayOfColorRGB = [number, number, number];

/**
 * [red, green, blue, alpha]
 */
export type ArrayOfColorRGBA = [number, number, number, number];