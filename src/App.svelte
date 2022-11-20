<script>
	import {onDestroy, onMount} from "svelte";
	import KeyExplainer from "./lib/KeyExplainer.svelte";
	import SplitViewManager from "./lib/SplitViewManager.svelte";
	import {resetTrigger, userSettings} from "./GlobalState.js";

	let showExplainer = true;

	function onGlobalKeyDown(event) {
		switch (event.key) {
			case "h":
				showExplainer = !showExplainer;
				break;
			default:
				break;
		}
	}

	let resetTriggerKey;
	resetTrigger.subscribe(val => {
		resetTriggerKey = val
	});

	let shouldHideCursor = false;
	let lastMouseMove = Date.now();
	let cursorHideInterval;

	userSettings.subscribe(settings => {
		shouldHideCursor = settings.hideCursor;
	});

	function onMouseMove() {
		lastMouseMove = Date.now();
	}

	onMount(() => {
		// Clean up old plyr keys
		for (const storageKey in window.localStorage) {
			if (storageKey && storageKey.startsWith("plyr-")) {
				window.localStorage.removeItem(storageKey);
			}
		}

		cursorHideInterval = setInterval(() => {
			if (shouldHideCursor && Date.now() - lastMouseMove > 5000) { // 5s
				document.body.classList.add("hideCursor");
			} else {
				document.body.classList.remove("hideCursor");
			}
		}, 100);
	});

	onDestroy(() => {
		clearInterval(cursorHideInterval);
	});
</script>

<svelte:window on:keydown={onGlobalKeyDown} on:mousemove={onMouseMove}/>

<main>
	{#key resetTriggerKey}
		<SplitViewManager/>
	{/key}

	<div class="keyExplainer" style:display={showExplainer ? "inherit" : "none"}>
		<KeyExplainer/>
	</div>
</main>

<style>
	.keyExplainer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		min-height: 100%;
		z-index: 10;

		padding: 20px;
		box-sizing: border-box;

		background-color: rgba(0, 0, 0, 0.75);
	}

	:global(.hideCursor *) {
		cursor: none !important;
	}
</style>
