export const rotationOrderStore = defineStore("rotationOrderStore", () => {
	const orderList = ref(["xy", "yz", "xz", "xw", "yw", "zw"]);
	const cameraOrderList = ref(["xy", "yz", "xz", "xw", "yw", "zw"]);

	return { orderList, cameraOrderList };
});
