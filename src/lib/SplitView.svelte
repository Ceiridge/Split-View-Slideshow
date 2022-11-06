<script>
	import mime from "mime";
	import {readRecursively, slideshowDelays} from "../GlobalState.js";
	import MediaPlayer from "./MediaPlayer.svelte";
	import {ALLOWED_MIME_TYPES} from "../Constants.js";
	import {convertItemsIntoFiles, wrapIndex} from "../Helpers.js";
	import Toast from "./Toast.svelte";
	import EmptyMediaError from "./EmptyMediaError.svelte";

	export let focused = false;
	export let randomId;

	let toast, folderFileInput, fileFileInput;

	let loadRecursively = false;
	readRecursively.subscribe(val => {
		loadRecursively = val;
	});

	let slideshowTimes;
	slideshowDelays.subscribe(val => {
		slideshowTimes = val;
	});

	let loadedFiles = [];
	let currentFileIndex = 0;

	function getRelativePath(file, removeFirstFolder) {
		let wkPath = file.webkitRelativePath;
		if (!wkPath) {
			return wkPath;
		}

		if (removeFirstFolder && wkPath.includes("/")) {
			wkPath = wkPath.substring(wkPath.indexOf("/") + 1);
		}

		return wkPath;
	}

	function onFilesInput(files, isFromFolder) {
		if (!files || files.length === 0) {
			return;
		}

		cleanup();

		loadedFiles = [...files].filter(file => {
			let recursiveCheck = true;

			if (!loadRecursively) {
				const relativePath = getRelativePath(file, isFromFolder);

				if (!relativePath) {
					recursiveCheck = true;
				} else {
					recursiveCheck = relativePath === file.name;
				}
			}

			// Only allowed mime types
			const mimeType = mime.getType(file.name);
			return recursiveCheck && mimeType && ALLOWED_MIME_TYPES.some(allowedType => mimeType.startsWith(allowedType));
		}).map(file => ({
			file,
			objectUrl: null,
			path: file.name,
			mime: mime.getType(file.name)
		}));
		switchFileIndex(0);
		console.log(loadedFiles);
	}

	function switchFileIndex(newIndex) {
		newIndex = wrapIndex(loadedFiles, newIndex);
		const newFile = loadedFiles[newIndex];
		if (!newFile) {
			return;
		}

		if (!newFile.objectUrl) { // Setup my custom file object url
			newFile.objectUrl = URL.createObjectURL(newFile.file);
		}

		currentFileIndex = newIndex;
		toast.show(newFile.path, `(${currentFileIndex + 1}/${loadedFiles.length})`);
	}

	function cleanup() {
		for (const file of loadedFiles) {
			if (file.objectUrl) {
				URL.revokeObjectURL(file.objectUrl);
			}
		}
	}

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
		<MediaPlayer mimeType={loadedFiles[currentFileIndex].mime} url={loadedFiles[currentFileIndex].objectUrl}
					 displayFileName={loadedFiles[currentFileIndex].path} splitViewId={randomId}
					 bind:exposedFunctions={mediaPlayerExposedFunctions}/>
	{/if}
</div>

<style>
	.view {
		position: relative;
		background-color: var(--global-background-color);
	}

	.focused {
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

	.dragging {
		box-shadow: inset 0 0 30px 3px #198aed;
	}
</style>
