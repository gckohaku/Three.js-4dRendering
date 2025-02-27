export const checkAscending = <T = number>(tuple: [T, T]): [T, T] => {
	if (tuple[0] <= tuple[1]) {
		return tuple;
	}
	return [tuple[1], tuple[0]];
}