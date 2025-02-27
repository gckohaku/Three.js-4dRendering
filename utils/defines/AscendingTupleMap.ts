import * as TupleUtilities from "@/utils/tupleUtilities";
import { AscendingTupleSet } from "./AscendingTupleSet";
import type { UnitDefinition } from "mathjs";

export class AscendingTupleMap<KeyType = number, ValueType = number> {
	private keyList: AscendingTupleSet<KeyType> = new AscendingTupleSet();
	private valueList: ValueType[] = [];
	
	get size() {
		return this.keyList.size;
	}

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
		} else {
			this.keyList.add(key);
			this.valueList.push(value);
		}

		this.checkMatchKeyAndValueSize();
		return this;
	}

	has(key: [KeyType, KeyType]): boolean {
		return this.keyList.has(key);
	}

	get(key: [KeyType, KeyType]): ValueType | undefined {
		const index = this.keyList.indexOf(key);
		if (index === -1) {
			return undefined;
		}

		return this.valueList[index];
	}

	clear() {
		this.keyList.clear();
		this.valueList.splice(0);
		this.checkMatchKeyAndValueSize();
	}

	delete(key: [KeyType, KeyType]): boolean {
		const index = this.keyList.indexOf(key);
		if (index === -1) {
			return false;
		}

		this.keyList.delete(key);
		this.valueList.splice(index, 1);
		this.checkMatchKeyAndValueSize();
		return true;
	}

	private checkMatchKeyAndValueSize() {
		if (this.keyList.size !== this.valueList.length || this.valueList.length !== this.size) {
			throw new Error(
				`CONTAIN DATA SIZE ERROR: mismatch key size, value size and this size\nkey size: ${this.keyList.size}\nvalue size: ${this.valueList.length}\nthis size${this.size}`,
			);
		}
	}
}
