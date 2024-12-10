export const rotationOrderStore = defineStore("rotationOrderStore", () => {
	const orderList = ref(["xw", "yw", "zw", "xy", "yz", "xz"]);

	return { orderList };
});
