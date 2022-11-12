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

	let nonReactive = {
		modifiedViews: true
	};
	beforeUpdate(() => {
		if (splitViews && nonReactive.modifiedViews) {
			// Clean up previous sliders
			for (const gutter of [...splitViews.getElementsByClassName("gutter")]) {
				splitViews.removeChild(gutter);
			}
		}
	});
	afterUpdate(() => {
		if (nonReactive.modifiedViews) {
			nonReactive.modifiedViews = false;

			Split(splitViews.getElementsByClassName("view"), {
				gutterSize: 5
			});
		}
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
			case "q":
				if (event.ctrlKey) {
					swapView(focusedViewIndex, true);
				}
				switchFocusTo(focusedViewIndex - 1);

				event.preventDefault();
				break;
			case "e":
				if (event.ctrlKey) {
					swapView(focusedViewIndex, false);
				}
				switchFocusTo(focusedViewIndex + 1);

				event.preventDefault();
				break;
			case "Q":
				duplicateView(true);
				event.preventDefault();
				break;
			case "E":
				duplicateView(false);
				event.preventDefault();
				break;
			default:
				break;
		}
	}

	function addView(left) {
		const newViewObject = {
			randomId: crypto.randomUUID(),
			exposedFunctions: null
		};

		if (views.length === 0) {
			views.push(newViewObject);
			return;
		}

		// Insert at focused index
		views.splice(focusedViewIndex + (left ? 0 : 1), 0, newViewObject);
		views = views;
		nonReactive.modifiedViews = true;
		switchFocusTo(focusedViewIndex + (left ? 0 : 1));
	}

	function popFocusedView() {
		if (views.length === 1) {
			resetTrigger.set(crypto.randomUUID()); // Trigger a reset
			return;
		}

		views = views.filter(view => view !== views[focusedViewIndex]);
		nonReactive.modifiedViews = true;
		switchFocusTo(focusedViewIndex - 1);
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
		nonReactive.modifiedViews = true;
	}

	function duplicateView(left) {
		const state = views[focusedViewIndex].exposedFunctions.getDuplicableState();
		addView(left);
		const newView = views[focusedViewIndex];

		const duplicateInterval = setInterval(() => {
			if (newView && newView.exposedFunctions) {
				newView.exposedFunctions.setDuplicableState(state);
				clearInterval(duplicateInterval);
			}
		}, 10);
	}
</script>

<svelte:window on:keydown={onGlobalKeyDown}/>

<div class="splitviews" bind:this={splitViews}>
	{#each views as view, i (view.randomId)}
		<SplitView focused={i === focusedViewIndex} randomId={view.randomId}
				   on:click={() => {switchFocusTo(i);}} bind:exposedFunctions={view.exposedFunctions}/>
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
