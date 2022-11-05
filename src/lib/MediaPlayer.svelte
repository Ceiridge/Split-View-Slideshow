<script>
	import Plyr from "plyr";
	import {afterUpdate, beforeUpdate} from "svelte";

	export let mimeType;
	export let url;
	export let displayFileName;

	let renderType;
	$: {
		if (mimeType.startsWith("image/")) {
			renderType = "img";
		} else if (mimeType.startsWith("video/")) { // TODO
			renderType = "video";
		} else if (mimeType.startsWith("audio/")) {
			renderType = "audio";
		}
	}

	export const exposedFunctions = {
		handleKey: (key) => {
			return false; // true if handled
		}
	};

	let mediaPlayerElement;
	let videoPlayer;
	let videoPlayerPlyr; // TODO: Fix object-fit contain of this player and duplicates/missing video elements

	afterUpdate(() => {
		if (videoPlayerPlyr) {
			videoPlayerPlyr.destroy();

			for (const videoElement of mediaPlayerElement.getElementsByTagName("video")) {
				mediaPlayerElement.removeChild(videoElement);
			}
		}

		if (videoPlayer && videoPlayer.parentElement) {
			videoPlayerPlyr = new Plyr(videoPlayer, {
				clickToPlay: false,
				speed: {
					selected: 1,
					options: [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 3.5, 4]
				},
				seekTime: 5,
				invertTime: false
			});
		}
	});
</script>

<div class="mediaPlayer" bind:this={mediaPlayerElement}>
	{#if (renderType === "img")}
		<img class="mediaImage" src={url} alt={displayFileName}/>
	{:else if (renderType === "video")}
		<video playsinline controls bind:this={videoPlayer}>
			<source src={url} type={mimeType}/>
		</video>
	{:else if (renderType === "audio")}

	{/if}
</div>

<style>
	.mediaPlayer {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.mediaImage, :global(.plyr) {
		display: block;
		width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
</style>
