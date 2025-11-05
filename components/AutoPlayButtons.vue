<script setup lang="ts">
import { START_LOCATION } from 'vue-router';

const autoPlaySettings = autoPlaySettingsStore();

const onStartAutoPlay = () => {
	if (autoPlaySettings.isPlaying) {
		autoPlaySettings.requestPlayingState = "resume";
		return;
	}

	autoPlaySettings.requestPlayingState = "start";
	requestAnimationFrame((timeStamp) => {
		autoPlaySettings.start(timeStamp);
		autoPlaySettings.requestPlayingState = "none"
	});
};

const onPauseAutoPlay = () => {
	autoPlaySettings.requestPlayingState = "pause";
};

const onStopAutoPlay = () => {
	autoPlaySettings.requestPlayingState = "stop";
};
</script>

<template>
	<div class="buttons-container">
		<button class="auto-play-button" :class="autoPlaySettings.isAutoPlayMode ? 'active-auto-play' : ''"
			@click="autoPlaySettings.toggleAutoPlayMode"
			:title="'自動再生機能の' + (autoPlaySettings.isAutoPlayMode ? '無効' : '有効') + '化'">auto<br>play<br>mode</button>
		<button v-if="!autoPlaySettings.isPlaying" class="start-button"
			:class="autoPlaySettings.isPlaying ? 'playing' : ''" :disabled="!autoPlaySettings.isAutoPlayMode"
			@click="onStartAutoPlay" title="再生"><span class="material-symbols-outlined fill">play_arrow</span></button>
		<button v-if="autoPlaySettings.isPausing" class="resume-button" @click="onStartAutoPlay" title="再開"><span
				class="material-symbols-outlined fill">resume</span></button>
		<button v-if="autoPlaySettings.isPlaying && !autoPlaySettings.isPausing" class="pause-button"
			:disabled="!autoPlaySettings.isPlaying" @click="onPauseAutoPlay" title="一時停止"><span
				class="material-symbols-outlined fill">pause</span></button>
		<button class="stop-button" :disabled="!autoPlaySettings.isPlaying" @click="onStopAutoPlay" title="停止"><span
				class="material-symbols-outlined fill">stop</span></button>
	</div>
</template>

<style scoped>
.buttons-container {
	grid-area: auto-play-button;
	display: flex;
	gap: .5rem;
	height: 100%;
	padding-inline: 1rem;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	button {
		width: 4rem;
		height: 4rem;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;

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

		span.material-symbols-outlined {
			font-size: 1.5rem;
		}
	}
}
</style>