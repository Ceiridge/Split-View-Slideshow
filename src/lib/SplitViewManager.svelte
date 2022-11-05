<script>
	import {onMount} from "svelte";
	import Split from "split.js";
	import SplitView from "./SplitView.svelte";

	let splitViews;

	onMount(() => {
		Split(splitViews.children);
	});
</script>

<div class="splitviews" bind:this={splitViews}>
	<SplitView/>
	<SplitView/>
	<SplitView/>
</div>

<style>
	.splitviews {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: row;
	}
</style>
