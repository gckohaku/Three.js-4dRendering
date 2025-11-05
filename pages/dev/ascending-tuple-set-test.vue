<script setup lang="ts">
import { AscendingTupleMap } from '~/utils/defines/AscendingTupleMap';
import { AscendingTupleSet } from '~/utils/defines/AscendingTupleSet';

const tupleSet = new AscendingTupleSet();

tupleSet.add([1, 2]);
tupleSet.add([3, 4]);
tupleSet.add([5, 6]);
tupleSet.add([2, 1]);
tupleSet.add([1, 3]);
tupleSet.add([8, 6]);

tupleSet.add([20, 30]).add([90, 70]);

tupleSet.delete([2, 1]);

const tupleMap = new AscendingTupleMap();

tupleMap.set([1, 2], 3);
tupleMap.set([4, 5], 6);
tupleMap.set([7, 8], 9);

tupleMap.delete([5, 4]);
</script>

<template>
	<div>
		<h2>AscendingTupleSet test</h2>
		<p v-for="tuple of tupleSet.keys()">{{ tuple }}</p>
		<br>
		<p>has [1, 2]?: {{ tupleSet.has([1, 2]) }}</p>
		<p>has [7, 9]?: {{ tupleSet.has([7, 9]) }}</p>
		<p>has [6, 5]?: {{ tupleSet.has([6, 5]) }}</p>
		<p>has [70, 90]?: {{ tupleSet.has([70, 90]) }}</p>
		<p>has [30, 20]?: {{ tupleSet.has([30, 20]) }}</p>
		<br>
		<p v-for="entry of tupleSet.entries()">{{ entry }}</p>

		<hr>
		<h2>AscendingTupleMap test</h2>
		<p v-for="tuple of tupleMap.entries()">{{ tuple }}</p>
		<br>
		<p>has [1, 2]?: {{ tupleMap.has([1, 2]) }}</p>
		<p>has [3, 4]?: {{ tupleMap.has([3, 4]) }}</p>
		<p>has [8, 7]?: {{ tupleMap.has([8, 7]) }}</p>
		<p>has [4, 5]?: {{ tupleMap.has([4, 5]) }}</p>
		<br>
		<p>get [1, 2]: {{ tupleMap.get([1, 2]) }}</p>
		<p>get [8, 7]: {{ tupleMap.get([8, 7]) }}</p>
		<p>get [10, 20]: {{ tupleMap.get([10, 20]) }}</p>
	</div>
</template>

<style scoped>
h2:not(:first) {
	margin-block-start: 1rem;
}

h3 {
	margin-block-start: 1rem;
}

hr {
	margin-block: 1rem;
}
</style>