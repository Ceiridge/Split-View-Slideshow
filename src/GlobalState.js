import {writable} from "svelte/store";
import {LOCAL_STORAGE_SETTINGS_KEY} from "./Constants.js";

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
export const userSettings = writable(readUserSettings());

function readUserSettings() {
	try {
		const savedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
		if (savedSettings) {
			return JSON.parse(savedSettings);
		}
	} catch (e) {
		console.error("Could not read settings", e);
	}

	// Defaults:
	return {
		readRecursively: false,
		hideCursor: true,

		defaultVolume: 0.1,
		slideshowDelays: {
			imageWait: 5000,
			videoWait: 1500
		}
	};
}

let firstRun = true; // Ignore the first subscription call
userSettings.subscribe(newSettings => {
	if (firstRun) {
		firstRun = false;
		return;
	}

	localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(newSettings)); // Update settings
});
