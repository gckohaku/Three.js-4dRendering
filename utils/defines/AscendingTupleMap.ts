import * as TupleUtilities from "@/utils/tupleUtilities";
import { AscendingTupleSet } from "./AscendingTupleSet";

export class AscendingTupleMap<KeyType = number, ValueType = number> {
	private keyList: AscendingTupleSet<KeyType> = new AscendingTupleSet();
	private valueList: ValueType[] = [];
	size = 0;

	*keys() {
		yield* this.keyList;
	}

	*values() {
		yield* this.valueList;
	}

	*entries() {
		let index = 0;
		for (const datum of this.keys()) {
			yield [datum, this.valueList[index]];
			index++;
		}
	}

	set(key: [KeyType, KeyType], value: ValueType): this {
		if (this.keyList.has(key)) {
			const index = this.keyList.indexOf(key);
			this.valueList[index] = value;
		}
		else {
			this.keyList.add(key);
			this.valueList.push(value);
		}

		this.size++;
		return this;
	}
}