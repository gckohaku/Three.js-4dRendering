<script setup lang="ts">

const autoPlaySettings = autoPlaySettingsStore();

const toggleAutoPlay = () => {
	autoPlaySettings.isAutoPlay = !autoPlaySettings.isAutoPlay;
};

const togglePlaying = () => {
	autoPlaySettings.isPlaying = !autoPlaySettings.isPlaying;
};

</script>

<template>
	<div class="buttons-container">
		<button class="auto-play-button" :class="autoPlaySettings.isAutoPlay ? 'active' : ''" @click="toggleAutoPlay">auto<br>play<br>mode</button>
		<button class="start-button" :disabled="!autoPlaySettings.isAutoPlay">▶</button>
		<button class="pause-button" :disabled="!autoPlaySettings.isAutoPlay">⏸</button>
		<button class="stop-button" :disabled="!autoPlaySettings.isAutoPlay">⏹</button>
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

		&.auto-play-button {
			&.active {
				background-color: #ccc;
				border-style: inset;
			}
		}
	}
}
</style>