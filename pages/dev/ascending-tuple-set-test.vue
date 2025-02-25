<script setup lang="ts">
import { AscendingTupleSet } from '~/utils/defines/AscendingTupleSet';

const tupleSet = new AscendingTupleSet();

tupleSet.add([1, 2]);
tupleSet.add([3, 4]);
tupleSet.add([5, 6]);
tupleSet.add([2, 1]);
tupleSet.add([1, 3]);
tupleSet.add([8, 6]);

tupleSet.add([20, 30]).add([90, 70]);

const anotherSet = new Set<[number, number]>();
</script>

<template>
	<div>
		<h2>AscendingTupleSet test</h2>
		<p v-for="tuple of tupleSet.keys()">{{ tuple }}</p>
		<p>has [1, 2]?: {{ tupleSet.has([1, 2]) }}</p>
		<p>has [7, 9]?: {{ tupleSet.has([7, 9]) }}</p>
		<p>has [6, 5]?: {{ tupleSet.has([6, 5]) }}</p>
		<p>has [70, 90]?: {{ tupleSet.has([70, 90]) }}</p>
		<p>has [30, 20]?: {{ tupleSet.has([30, 20]) }}</p>
		<hr>
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