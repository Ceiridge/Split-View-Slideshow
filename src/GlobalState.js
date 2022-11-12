import {writable} from "svelte/store";

export const objectUrlMemory = new Map(); // Counters that keep track of created object URLs
export function referenceObjectUrls(objectUrls, dereference) {
	for (const objectUrl of objectUrls) {
		if (objectUrl) {
			const refCount = (objectUrlMemory.has(objectUrl) ? objectUrlMemory.get(objectUrl) : 0) + (!dereference ? 1 : -1);
			objectUrlMemory.set(objectUrl, refCount);
			console.debug(`[${refCount}] ${objectUrl}`);

			if (refCount <= 0) {
				objectUrlMemory.delete(objectUrl);
				URL.revokeObjectURL(objectUrl);
			}
		}
	}
}

export const resetTrigger = writable(Math.random());

// TODO: Settings
export const readRecursively = writable(false);
export const defaultVolume = writable(0.1);
export const slideshowDelays = writable({
	imageWait: 5000,
	videoWait: 1500
});
