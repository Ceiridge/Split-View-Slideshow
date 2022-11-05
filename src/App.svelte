<script>
	import KeyExplainer from "./lib/KeyExplainer.svelte";
	import SplitViewManager from "./lib/SplitViewManager.svelte";

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
</script>

<svelte:window on:keydown={onGlobalKeyDown}/>

<main>
	<SplitViewManager/>

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
		height: 100%;
		z-index: 10;

		padding: 20px;
		box-sizing: border-box;

		background-color: rgba(0, 0, 0, 0.75);
	}
</style>
