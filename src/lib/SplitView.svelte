<script>
	import {onDestroy} from "svelte";
	import {readRecursively, referenceObjectUrls, slideshowDelays} from "../GlobalState.js";
	import MediaPlayer from "./MediaPlayer.svelte";
	import {convertItemsIntoFiles, filterFilesInput, wrapIndex} from "../Helpers.js";
	import Toast from "./Toast.svelte";
	import EmptyMediaError from "./EmptyMediaError.svelte";

	export let focused = false;
	export let randomId;

	let loadedFiles = [];
	let currentFileIndex = 0;

	let toast, folderFileInput, fileFileInput;

	let loadRecursively = false;
	readRecursively.subscribe(val => {
		loadRecursively = val;
	});

	let slideshowTimes;
	slideshowDelays.subscribe(val => {
		slideshowTimes = val;
	});

	function onFilesInput(files, isFromFolder) {
		if (!files || files.length === 0) {
			return;
		}

		cleanup();
		loadedFiles = filterFilesInput(files, isFromFolder, loadRecursively);
		switchFileIndex(0);
	}

	function switchFileIndex(newIndex) {
		newIndex = wrapIndex(loadedFiles, newIndex);
		const newFile = loadedFiles[newIndex];
		if (!newFile) {
			return;
		}

		if (!newFile.objectUrl) { // Setup my custom file object url
			newFile.objectUrl = URL.createObjectURL(newFile.file);
			referenceObjectUrls([newFile.objectUrl], false);
		}

		currentFileIndex = newIndex;
		toast.show(newFile.path, `(${currentFileIndex + 1}/${loadedFiles.length})`);
	}

	function cleanup() {
		referenceObjectUrls(loadedFiles.map(file => file.objectUrl), true);
	}

	onDestroy(cleanup);

	export const exposedFunctions = {
		getDuplicableState: () => {
			return {
				loadedFiles,
				currentFileIndex
			};
		},
		setDuplicableState: (state) => {
			loadedFiles = state.loadedFiles;
			currentFileIndex = state.currentFileIndex;

			referenceObjectUrls(loadedFiles.map(file => file.objectUrl), false);
		}
	};

	let mediaPlayerExposedFunctions;
	let hasAnyMediaLoaded = false;
	$: hasAnyMediaLoaded = loadedFiles.length !== 0;

	function onGlobalKeyDown(event) {
		if (!focused) {
			return;
		}

		let handledByPlayer = false;
		if (mediaPlayerExposedFunctions) {
			handledByPlayer = mediaPlayerExposedFunctions.handleKey(event.key);
		}

		switch (event.key) {
			case "a":
				if (!handledByPlayer && hasAnyMediaLoaded) {
					switchLeft();
				}
				break;
			case "d":
				if (!handledByPlayer && hasAnyMediaLoaded) {
					switchRight();
				}
				break;
			case "s":
				if (hasAnyMediaLoaded) {
					toggleSlideshow();
				}
				break;
			default:
				break;
		}
	}

	function switchLeft() {
		interruptSlideshowNext();
		switchFileIndex(currentFileIndex - 1);
	}

	function switchRight() {
		interruptSlideshowNext();
		switchFileIndex(currentFileIndex + 1);
	}


	let slideshowInterval = null;
	let slideshowNextTimeout = null;

	function toggleSlideshow() {
		if (slideshowInterval !== null) {
			clearInterval(slideshowInterval);
			slideshowInterval = null;
			interruptSlideshowNext();

			toast.show("Slideshow stopped");
			return;
		}

		const imageDelay = slideshowTimes.imageWait;
		const videoDelay = slideshowTimes.videoWait;

		slideshowInterval = setInterval(() => {
			const mediaPlayerPlayed = mediaPlayerExposedFunctions.hasPlayed();

			if (mediaPlayerPlayed && slideshowNextTimeout === null) {
				slideshowNextTimeout = setTimeout(() => {
					slideshowNextTimeout = null;
					switchRight();
				}, mediaPlayerPlayed === "imageWait" ? imageDelay : videoDelay);
			}
		}, 100);
		toast.show("Slideshow started", `(${Math.floor(imageDelay / 1000)}s & ${Math.floor(videoDelay / 1000)}s)`);
	}

	function interruptSlideshowNext() {
		if (slideshowNextTimeout !== null) {
			clearTimeout(slideshowNextTimeout);
			slideshowNextTimeout = null;
		}
	}

	function isSlideshowActive() {
		return slideshowInterval !== null;
	}

	function onMediaError() {
		// TODO: Skip without slideshow setting
		if (isSlideshowActive() && hasAnyMediaLoaded && loadedFiles.length > 1) {
			console.log("Skipped erroneous media");
			switchRight();
		}
	}


	function onDragOver(event) {
		event.preventDefault();
	}

	let dragging = false;

	function onDragEnter(event) {
		event.preventDefault();
		dragging = true;
	}

	function onDragLeave() {
		dragging = false;
	}

	async function onDragDrop(event) {
		dragging = false;
		event.preventDefault();

		let itemEntries = [];
		for (const item of event.dataTransfer.items) {
			itemEntries.push(item.webkitGetAsEntry());
		}

		const files = await convertItemsIntoFiles(itemEntries, loadRecursively);
		onFilesInput(files, false);
	}
</script>

<svelte:window on:keydown={onGlobalKeyDown}/>

<div class="view" class:focused={focused} class:dragging={dragging} on:click on:dragover={onDragOver}
	 on:dragleave={onDragLeave} on:dragenter={onDragEnter} on:drop={onDragDrop}>
	<input type="file" bind:this={folderFileInput} on:change={() => {onFilesInput(folderFileInput.files, true);}}
		   webkitdirectory
		   mozdirectory directory
		   style="display: none"/>
	<input type="file" bind:this={fileFileInput} on:change={() => {onFilesInput(fileFileInput.files, false);}} multiple
		   style="display: none"/>

	<Toast bind:exposedFunctions={toast}/>

	{#if !hasAnyMediaLoaded}
		<EmptyMediaError folderFileInput={folderFileInput} fileFileInput={fileFileInput}/>

	{:else if (loadedFiles[currentFileIndex] && loadedFiles[currentFileIndex].objectUrl)}
		<MediaPlayer mimeType={loadedFiles[currentFileIndex].mime}
					 url={loadedFiles[currentFileIndex].objectUrl}
					 displayFileName={loadedFiles[currentFileIndex].path}
					 splitViewId={randomId}
					 bind:exposedFunctions={mediaPlayerExposedFunctions}
					 on:errored={onMediaError}
		/>
	{/if}
</div>

<style>
	.view {
		position: relative;
		background-color: var(--global-background-color);
	}

	.view:before {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.view.focused {
		background-color: var(--global-background-color-bright);
	}

	.view.focused:before {
		animation-name: focusedHide;
		animation-duration: 2s;
	}

	@keyframes focusedHide {
		from {
			box-shadow: inset 0 0 30px 3px #0f9946;
		}

		to {
			box-shadow: inset 0 0 2px 3px rgba(15, 153, 70, 0);
		}
	}

	.view.dragging:before {
		box-shadow: inset 0 0 30px 3px #198aed;
	}
</style>
