export function wrapIndex(arr, index) {
	if (index < 0) {
		index = arr.length - 1;
	} else if (index >= arr.length) {
		index = 0;
	}

	return index;
}
