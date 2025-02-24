<script setup lang="ts">
import { AscendingTupleSet } from '~/utils/defines/AscendingTupleSet';

const tupleSet = new AscendingTupleSet();

tupleSet.add([1, 2]);
tupleSet.add([3, 4]);
tupleSet.add([5, 6]);

for (const tuple of tupleSet) {
	console.log(tuple);
}
</script>

<template>
	<div>
		<h2>ascending-tuple-set-test</h2>
		<p v-for="tuple of tupleSet">{{ tuple }}</p>
	</div>
</template>

<style scoped>
/* style here */

</style>