<script setup lang="ts">
const isOpenPanel: Ref<boolean[]> = ref([true, false, false]);

const onButtonClick = (index: number) => {
	isOpenPanel.value.fill(false);
	isOpenPanel.value[index] = true;
}
</script>

<template>
	<div class="controllers-wrapper">
		<div class="tabs-container">
			<div class="tab-list" aria-label="Selecting Controller Tabs">
				<button role="tab" :aria-selected="isOpenPanel[0]" aria-controls="object-controller" id="tab-object" tabindex="0" @click="onButtonClick(0)">Object</button>
				<button role="tab" :aria-selected="isOpenPanel[1]" aria-controls="camera-4d-controller" id="tab-4d-camera" tabindex="0" @click="onButtonClick(1)">Camera4D</button>
				<button role="tab" :aria-selected="isOpenPanel[2]" aria-controls="camera-3d-controller" id="tab-3d-camera" tabindex="0" @click="onButtonClick(2)">Camera3D</button>
			</div>
		</div>

		<div class="controller-container">
			<div id="object-controller" role="tabpanel" tabindex="0" aria-labelledby="tab-object" :hidden="!isOpenPanel[0]">
				<slot name="object"></slot>
			</div>
			<div id="camera-4d-controller" role="tabpanel" tabindex="0" aria-labelledby="tab-4d-camera" :hidden="!isOpenPanel[1]">
				<slot name="camera-4d"></slot>
			</div>
			<div id="camera-3d-controller" role="tabpanel" tabindex="0" aria-labelledby="tab-3d-camera" :hidden="!isOpenPanel[2]">
				<slot name="camera-3d"></slot>
			</div>
		</div>
	</div>
</template>

<style scoped>
.controllers-wrapper {
	.tabs-container {
		.tab-list {
			display: flex;

			button {
				border: 1px #1c1c1c solid;
				border-radius: .4rem .4rem 0 0;
				margin: 0;
				padding: .1rem .2rem;
				font-size: .9rem;
				background-color: #e8e8e8;

				&:hover {
					background-color: #c8c8c8;
				}

				&[aria-selected="true"] {
					background-color: #c8e0e0;
				}
			}
		}
	}

	.controller-container {
		border: #1c1c1c 2px solid;
		border-radius: 5px;
		padding: .25rem;
	}
}
</style>