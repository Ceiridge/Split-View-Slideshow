<script>
	import {beforeUpdate, afterUpdate} from "svelte";
	import Split from "split.js";
	import SplitView from "./SplitView.svelte";
	import {resetTrigger} from "../GlobalState.js";
	import {wrapIndex} from "../Helpers.js";

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
				event.preventDefault();
				break;
			case "Delete":
				popFocusedView();
				event.preventDefault();
				break;
			case "a":
				if (event.ctrlKey) {
					swapView(focusedViewIndex, true);
				}
				switchFocusTo(focusedViewIndex - 1);

				event.preventDefault();
				break;
			case "d":
				if (event.ctrlKey) {
					swapView(focusedViewIndex, false);
				}
				switchFocusTo(focusedViewIndex + 1);

				event.preventDefault();
				break;
			default:
				break;
		}
	}

	function addView() {
		const newViewObject = {
			randomId: crypto.randomUUID()
		};

		if (views.length === 0) {
			views.push(newViewObject);
			return;
		}

		// Insert at focused index
		views.splice(focusedViewIndex + 1, 0, newViewObject);
		views = views;
		switchFocusTo(focusedViewIndex - 1);
	}

	function popFocusedView() {
		if (views.length === 1) {
			resetTrigger.set(crypto.randomUUID()); // Trigger a reset
			return;
		}

		views = views.filter(view => view !== views[focusedViewIndex]);
		switchFocusTo(focusedViewIndex + 1);
	}

	function switchFocusTo(newIndex) {
		newIndex = wrapIndex(views, newIndex);

		if (newIndex !== focusedViewIndex) {
			console.log("Switched to new index " + newIndex);
			focusedViewIndex = newIndex;
		}
	}

	function swapView(index, left) {
		index = wrapIndex(views, index);
		let targetIndex = index;

		if (left) {
			targetIndex--;
		} else {
			targetIndex++;
		}
		targetIndex = wrapIndex(views, targetIndex);

		[views[index], views[targetIndex]] = [views[targetIndex], views[index]];
		views = views;
	}
</script>

<svelte:window on:keydown={onGlobalKeyDown}/>

<div class="splitviews" bind:this={splitViews}>
	{#each views as view, i (view.randomId)}
		<SplitView focused={i === focusedViewIndex} randomId={view.randomId} on:click={() => {switchFocusTo(i);}}/>
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
