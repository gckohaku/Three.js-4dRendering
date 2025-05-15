<script setup lang="ts">

const autoPlaySettings = autoPlaySettingsStore();

// const emit = defineEmits<{
// 	startAutoPlay: [];
// }>();

</script>

<template>
	<div class="buttons-container">
		<button class="auto-play-button" :class="autoPlaySettings.isAutoPlayMode ? 'active-auto-play' : ''"
			@click="autoPlaySettings.toggleAutoPlayMode">auto<br>play<br>mode</button>
		<button class="start-button" :class="autoPlaySettings.isPlaying ? 'playing' : ''"
			:disabled="!autoPlaySettings.isAutoPlayMode" @click="autoPlaySettings.togglePlaying">▶</button>
		<button class="pause-button" :disabled="!autoPlaySettings.isPlaying">⏸</button>
		<button class="stop-button" :disabled="!autoPlaySettings.isPlaying">⏹</button>
	</div>
</template>

<style scoped>
.buttons-container {
	grid-area: auto-play-button;
	display: flex;
	gap: .5rem;
	height: 100%;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	button {
		width: 4rem;
		height: 4rem;
		box-sizing: border-box;

		&:not([disabled]):is(.active-auto-play, .playing) {
			background-color: #bdd;
			border-style: inset;
		}

		&:hover {
			background-color: #ccc;
		}

		&:active {
			background-color: #aaa;
		}
	}
}
</style>