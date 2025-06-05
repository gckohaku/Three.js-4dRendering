<script setup lang="ts">
const iconRolling = `<span class="material-symbols-outlined">refresh</span>`;
const testSymbolString = `${iconRolling}${iconRolling}${iconRolling}<sub>${iconRolling}</sub>${iconRolling}`;
</script>

<template>
	<div class="test-wrapper">
		<div class="test-container">
			<div class="attach-style">
				<div class="char-container">
					<p><span>a</span><span>b</span><span>c</span><span>d</span><span>e</span><span>f</span><span>g</span><span>h</span></p>
					<p><span>a</span><span>b</span><span>c</span><span>d</span><span><sub>e</sub></span><span>f</span><span>g</span><span>h</span></p>
				</div>
				<div class="symbols-container">
					<p v-html="testSymbolString"></p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.attach-style {
	letter-spacing: -5px;
}
</style>