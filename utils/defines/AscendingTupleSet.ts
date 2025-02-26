import * as TupleUtilities from "@/utils/tupleUtilities";

export class AscendingTupleSet<T = number> {
	private data: [T, T][] = [];
	size = 0;

	*[Symbol.iterator]() {
		yield* this.data;
	}
	
	*values() {
		yield* this;
	}

	*keys() {
		yield* this;
	}

	add(tuple: [T, T]): this {
		if (this.has(tuple)) {
			return this;
		}
		const ascendingTuple = TupleUtilities.checkAscending(tuple);
		this.data.push(ascendingTuple);
		this.size++;
		return this;
	}

	has(tuple: [T, T]): boolean {
		const ascendingTuple = TupleUtilities.checkAscending(tuple);
		if (this.data.some((datum) => ascendingTuple[0] === datum[0] && ascendingTuple[1] === datum[1])) {
			return true;
		}
		return false;
	}

	indexOf(searchTuple: [T, T]): number {
		return this.data.findIndex((datum) => (searchTuple[0] === datum[0] && searchTuple[1] === datum[1]));
	}
}
