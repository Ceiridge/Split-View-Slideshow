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

	let mediaPlayerElement;
	let videoPlayer;
	let videoPlayerPlyr; // TODO: Fix object-fit contain of this player and duplicates/missing video elements

	afterUpdate(() => {
		if (videoPlayerPlyr) {
			videoPlayerPlyr.destroy();
			videoPlayerPlyr = null;

			for (const videoElement of mediaPlayerElement.getElementsByTagName("video")) {
				mediaPlayerElement.removeChild(videoElement);
			}
		}

		if (videoPlayer && videoPlayer.parentElement) {
			videoPlayerPlyr = new Plyr(videoPlayer, {
				clickToPlay: true,
				speed: {
					selected: 1,
					options: [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 3.5, 4]
				},
				seekTime: 5,
				invertTime: false,
				autopause: false,
				disableContextMenu: false,
				controls: [
					"play", // Play/pause playback
					"progress", // The progress bar and scrubber for playback and buffering
					"current-time", // The current time of playback
					"duration", // The full duration of the media
					"mute", // Toggle mute
					"volume", // Volume control
					"settings" // Settings menu
				],
				keyboard: {focused: false, global: false} // No default key bindings
			});
		}
	});

	export const exposedFunctions = {
		handleKey: (key) => {
			if (videoPlayerPlyr) {
				switch (key) {
					case 'l':
						videoPlayerPlyr.forward();
						return true;
					case 'j':
						videoPlayerPlyr.rewind();
						return true;

					case 'k':
					case ' ':
						videoPlayerPlyr.togglePlay();
						return true;
					case 'm':
						videoPlayerPlyr.muted = !videoPlayerPlyr.muted;
						return true;

					case 'ArrowUp':
						videoPlayerPlyr.increaseVolume(0.1);
						return true;
					case 'ArrowDown':
						videoPlayerPlyr.decreaseVolume(0.1);
						return true;

					case '+':
						videoPlayerPlyr.speed += 0.25;
						return true;
					case '-':
						videoPlayerPlyr.speed -= 0.25;
						return true;
					case '0':
						videoPlayerPlyr.speed = 1;
						return true;
					default:
						return false;
				}
			}

			return false; // true if handled
		}
	};
</script>

<div class="mediaPlayer" bind:this={mediaPlayerElement}>
	{#if (renderType === "img")}
		<img class="mediaImage" src={url} alt={displayFileName}/>
	{:else if (renderType === "video")}
		<video playsinline controls autoplay loop bind:this={videoPlayer}>
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
