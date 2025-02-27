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

	*entries() {
		for (const key of this.keys()) {
			yield [key, key];
		}
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

	clear() {
		this.data.splice(0);
		this.size = 0;
	}

	delete(tuple: [T, T]): boolean {
		const index = this.indexOf(tuple);
		if (index === -1) {
			return false;
		}

		this.data.splice(index, 1);

		this.size--;
		return true;
	}

	has(tuple: [T, T]): boolean {
		return this.indexOf(tuple) !== -1;
	}

	indexOf(searchTuple: [T, T]): number {
		const ascendingTuple = TupleUtilities.checkAscending(searchTuple);
		return this.data.findIndex((datum) => (ascendingTuple[0] === datum[0] && ascendingTuple[1] === datum[1]));
	}
}
