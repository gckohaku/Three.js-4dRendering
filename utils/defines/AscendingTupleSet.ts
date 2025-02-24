export class AscendingTupleSet {
	data: [number, number][] = [];
	cursor = 0;

	[Symbol.iterator]() {
		
	}

	add(tuple: [number, number]) {
		if (this.data.some((v) => (v[0] === tuple[0] && v[1] === tuple[1]))) {
			
		}
	}
}
