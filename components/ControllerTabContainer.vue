<script setup lang="ts">
// script here
</script>

<template>
	<div class="controllers-wrapper">
		<div class="tabs-container">
			<div class="tab-list" aria-label="Selecting Controller Tabs">
				<button role="tab" aria-selected="true" aria-controls="object-controller" id="tab-object" tabindex="0">Object</button>
				<button role="tab" aria-selected="false" aria-controls="camera-controller" id="tab-camera" tabindex="0">Object</button>
			</div>
		</div>

		<div class="controller-container">
			<div id="object-controller" role="tabpanel" tabindex="0" aria-labelledby="tab-object">
				<slot name="object"></slot>
			</div>
			<div id="camera-controller" role="tabpanel" tabindex="0" aria-labelledby="tab-camera" hidden>
				<slot name="camera"></slot>
			</div>
		</div>
	</div>


</template>

<style scoped>
/* style here */
</style>