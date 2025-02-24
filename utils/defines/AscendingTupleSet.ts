class AscendingTupleSetIterator {
	first: number;
	second: number;
	nextIterator: AscendingTupleSetIterator | null = null;

	constructor(a: number, b: number) {
		if (a <= b) {
			this.first = a;
			this.second = b;
		} else {
			this.first = b;
			this.second = a;
		}
	}

	next() {
		if (!this.nextIterator) {
			return {done: true}
		}

		return { value: this.nextIterator, done: false };
	}

	setNextIterator(iterator: AscendingTupleSetIterator) {
		this.nextIterator = iterator
	}
}

export class AscendingTupleSet {
	data?: AscendingTupleSetIterator;
	cursor = 0;

	[Symbol.iterator]() {
		
	}

	add(tuple: [number, number]) {
		this.data = new AscendingTupleSetIterator(tuple[0], tuple[1]);
	}
}
