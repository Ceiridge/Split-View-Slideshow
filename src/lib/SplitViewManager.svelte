<script>
	import {beforeUpdate, afterUpdate} from "svelte";
	import Split from "split.js";
	import SplitView from "./SplitView.svelte";

	let splitViews;
	let views = [];
	let focusedViewIndex = 0;

	addView();
	beforeUpdate(() => {
		if (splitViews) {
			// Clean up previous sliders
			for (const gutter of [...splitViews.getElementsByClassName("gutter")]) {
				splitViews.removeChild(gutter);
			}
		}
	});
	afterUpdate(() => {
		// TODO: Restore slider positions
		Split(splitViews.getElementsByClassName("view"));
	});

	function onGlobalKeyDown(event) {
		switch (event.key) {
			case "n":
				addView();
				break;
			case "Delete":
				if (views.length > 1) {
					popFocusedView();
				}
				break;
			case "a":
				switchFocus(true);
				break;
			case "d":
				switchFocus(false);
				break;
			default:
				break;
		}
	}

	function addView() {
		const newViewObject = {}; // TODO: Removing the wrong views

		if (views.length === 0) {
			views.push(newViewObject);
			return;
		}

		// Insert at focused index
		views.splice(focusedViewIndex + 1, 0, newViewObject);
		views = views;
		switchFocus(false);
	}

	function popFocusedView() {
		views = views.filter(view => view !== views[focusedViewIndex]);
		switchFocus(true);
	}

	function switchFocus(left) {
		let newIndex = focusedViewIndex;

		if (left) {
			newIndex--;
		} else {
			newIndex++;
		}

		if (newIndex < 0) {
			newIndex = views.length - 1;
		} else if (newIndex >= views.length) {
			newIndex = 0;
		}

		if (newIndex !== focusedViewIndex) {
			console.log("Switched to new index " + newIndex);
			focusedViewIndex = newIndex;
		}
	}
</script>

<svelte:window on:keydown={onGlobalKeyDown}/>

<div class="splitviews" bind:this={splitViews}>
	{#each views as view, i}
		<SplitView focused={i === focusedViewIndex} {...view}/>
	{/each}
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
