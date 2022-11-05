<script>
	import {fade} from "svelte/transition";
	import {cubicInOut} from "svelte/easing";
	import BrokenImage from "../assets/svg/BrokenImage.svelte";
	import {readRecursively} from "../GlobalState.js";
	import MediaPlayer from "./MediaPlayer.svelte";
	import {ALLOWED_MIME_TYPES} from "../Constants.js";

	export let focused = false;

	let folderFileInput, fileFileInput;
	let loadRecursively = false;
	let showFilePosition = false;
	let showFilePositionTimeout = null;

	readRecursively.subscribe(val => {
		loadRecursively = val
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

	// TODO: Drag & Drop
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
			return recursiveCheck && file.type && ALLOWED_MIME_TYPES.some(allowedType => file.type.startsWith(allowedType));
		}).map(file => ({
			file,
			objectUrl: null,
			path: file.name
		}));
		switchFileIndex(0);
		console.log(loadedFiles);
	}

	function switchFileIndex(newIndex) {
		if (newIndex < 0) {
			newIndex = loadedFiles.length - 1;
		} else if (newIndex >= loadedFiles.length) {
			newIndex = 0;
		}

		const newFile = loadedFiles[newIndex];
		if (!newFile) {
			return;
		}

		if (!newFile.objectUrl) { // Setup my custom file object url
			newFile.objectUrl = URL.createObjectURL(newFile.file); // TODO: Research if MKV files work
		}

		currentFileIndex = newIndex;
		showFilePosition = true;

		if (showFilePositionTimeout !== null) {
			clearTimeout(showFilePositionTimeout);
		}
		showFilePositionTimeout = setTimeout(() => {
			showFilePosition = false;
			showFilePositionTimeout = null;
		}, 1500);
	}

	function cleanup() {
		for (const file of loadedFiles) {
			if (file.objectUrl) {
				URL.revokeObjectURL(file.objectUrl);
			}
		}
	}

	let mediaPlayerExposedFunctions;

	function onGlobalKeyDown(event) {
		if (!focused) {
			return;
		}

		let handledByPlayer = false;
		if (mediaPlayerExposedFunctions) {
			handledByPlayer = mediaPlayerExposedFunctions.handleKey(event.key);
		}

		switch (event.key) {
			case "ArrowLeft":
				if (!handledByPlayer) {
					switchFileIndex(currentFileIndex - 1);
				}
				break;
			case "ArrowRight":
				if (!handledByPlayer) {
					switchFileIndex(currentFileIndex + 1);
				}
				break;
			default:
				break;
		}
	}
</script>

<svelte:window on:keydown={onGlobalKeyDown}/>

<div class="view" class:focused={focused}>
	<input type="file" bind:this={folderFileInput} on:change={() => {onFilesInput(folderFileInput.files, true);}}
		   webkitdirectory
		   mozdirectory directory
		   style="display: none"/>
	<input type="file" bind:this={fileFileInput} on:change={() => {onFilesInput(fileFileInput.files, false);}} multiple
		   style="display: none"/>

	{#if loadedFiles.length === 0}
		<div class="emptyMedia">
			<BrokenImage/>

			<span>No media loaded.</span><br>
			<span>Drag & Drop a folder or media file in here.</span>
			<br><br>

			<span>Or alternatively:</span><br>
			<div>
				<button on:click={() => {folderFileInput.click();}}>Open folder</button>
				<button on:click={() => {fileFileInput.click();}}>Open file</button>
			</div>
		</div>

	{:else if (loadedFiles[currentFileIndex] && loadedFiles[currentFileIndex].objectUrl)}
		{#if showFilePosition}
			<span class="filePositionInfo" in:fade={{delay: 0, duration: 250, easing: cubicInOut}}
				  out:fade={{delay: 3250, duration: 250, easing: cubicInOut}}>
				{loadedFiles[currentFileIndex].path}

				<span class="filePositionInfoState">
					({currentFileIndex + 1}/{loadedFiles.length})
				</span>
			</span>
		{/if}

		<MediaPlayer mimeType={loadedFiles[currentFileIndex].file.type} url={loadedFiles[currentFileIndex].objectUrl}
					 displayFileName={loadedFiles[currentFileIndex].path}
					 bind:exposedFunctions={mediaPlayerExposedFunctions}/>
	{/if}
</div>

<style>
	.view {
		position: relative;
	}

	.emptyMedia {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.emptyMedia br {
		display: block;
		content: " ";
		margin-top: 5px;
	}

	.filePositionInfo {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		padding: 5px;

		background-color: rgba(0, 0, 0, 0.5);
	}

	.filePositionInfoState {
		color: #949494;
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
</style>
