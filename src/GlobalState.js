import {writable} from "svelte/store";

export const readRecursively = writable(false);
export const resetTrigger = writable(Math.random());
