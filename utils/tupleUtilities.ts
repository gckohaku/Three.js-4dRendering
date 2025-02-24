export const checkAscending = (tuple: [number, number]): [number, number] => {
	if (tuple[0] <= tuple[1]) {
		return tuple;
	}
	return [tuple[1], tuple[0]];
}