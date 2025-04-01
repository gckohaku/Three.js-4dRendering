export const optionsStore = defineStore("optionsStore", () => {
	// 4D カメラ設定
	const camera4dNear = ref(-1);

	// フレームの太さ関連
	const frameThresholdWMin = ref(-500);
	const frameThresholdWMax = ref(-250);
	const frameRadiusMin = ref(0.1);
	const frameRadiusMax = ref(2);

	return { camera4dNear, frameThresholdWMin, frameThresholdWMax, frameRadiusMin, frameRadiusMax };
});
