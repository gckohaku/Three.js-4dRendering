import * as TupleUtilities from "@/utils/tupleUtilities";
import { AscendingTupleSet } from "./AscendingTupleSet";

export class AscendingTupleMap<KeyType = number, ValueType = number> {
	private keyList: AscendingTupleSet<KeyType> = new AscendingTupleSet();
	private valueList: ValueType[] = [];

	*keys() {
		yield* this.keyList;
	}

	*values() {
		yield* this.valueList;
	}
}