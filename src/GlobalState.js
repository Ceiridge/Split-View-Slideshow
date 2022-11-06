import {writable} from "svelte/store";

export const resetTrigger = writable(Math.random());

// TODO: Settings
export const readRecursively = writable(false);
export const defaultVolume = writable(0.1);
export const slideshowDelays = writable({
	imageWait: 5000,
	videoWait: 1500
});
