<script>
	import Plyr from "plyr";
	import {afterUpdate, createEventDispatcher} from "svelte";
	import {userSettings} from "../GlobalState.js";

	export let mimeType;
	export let url;
	export let displayFileName;
	export let splitViewId;

	let renderType;
	$: {
		if (mimeType.startsWith("image/")) {
			renderType = "img";
		} else if (mimeType.startsWith("video/")) {
			renderType = "video";
		} else if (mimeType.startsWith("audio/")) {
			renderType = "audio";
		}
	}

	let mediaPlayerElement;
	let videoPlayer;
	let videoPlayerPlyr;
	let videoHasPlayed = false;

	let videoDefaultVolume;
	userSettings.subscribe(settings => {
		videoDefaultVolume = settings.defaultVolume;
	})

	afterUpdate(() => {
		if (videoPlayerPlyr) {
			videoPlayerPlyr.destroy();
			videoPlayerPlyr = null;

			// Clear up video elements appended again by Plyr
			for (const videoElement of mediaPlayerElement.querySelectorAll("video, audio")) {
				if (videoElement === videoPlayer) {
					continue;
				}

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
				keyboard: {focused: false, global: false}, // No default key bindings
				storage: {enabled: true, key: "plyr-" + splitViewId}, // Each view gets its own storage keys
				volume: videoDefaultVolume
			});

			videoPlayerPlyr.on("ended", () => {
				videoHasPlayed = true;
				videoPlayerPlyr.play();
			});
			videoHasPlayed = false;
		}
	});

	export const exposedFunctions = {
		handleKey: (key) => {
			if (videoPlayerPlyr) {
				switch (key) {
					case 'l':
						videoPlayerPlyr.forward(10);
						return true;
					case 'j':
						videoPlayerPlyr.rewind(10);
						return true;
					case 'ArrowRight':
						videoPlayerPlyr.forward();
						return true;
					case 'ArrowLeft':
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
						break;
				}
			}

			// For all media types
			switch (key) {
				case 'f':
					flipMedia(true);
					return true;
				case 'F':
					flipMedia(false);
					return true;

				default:
					break;
			}

			return false; // true if handled
		},
		hasPlayed: () => {
			if (!videoPlayerPlyr) {
				return "imageWait";
			}

			if (videoHasPlayed) {
				videoHasPlayed = false;
				return "videoWait";
			}
			return null;
		},
		reload: () => {
			const currentUrl = url;
			url = "";

			setTimeout(() => {
				url = currentUrl;
			}, 1);
		}
	};

	function flipMedia(horizontally) {
		const mediaElement = mediaPlayerElement.querySelector("img, video");
		const className = horizontally ? "flippedHorizontally" : "flippedVertically";

		// Apply the class manually to prevent issues with Plyr and to ensure that it is not copied over when switching media
		if (mediaElement.classList.contains(className)) {
			mediaElement.classList.remove(className);
		} else {
			mediaElement.classList.add(className);
		}
	}

	function translateMimeType(mime) {
		switch (mime) {
			case "video/x-matroska": // Force MKV files to play
				mime = "video/webm";
				break;
			case "audio/x-matroska":
				mime = "audio/webm";
				break;
			default:
				break;
		}

		return mime;
	}

	const dispatch = createEventDispatcher();

	function onMediaLoadError() {
		dispatch("errored"); // Send an errored event to listeners to encourage skipping this media
	}
</script>

<div class="mediaPlayer" bind:this={mediaPlayerElement}>
	{#key url}
		{#if (renderType === "img")}
			<img class="mediaImage" src={url} alt={displayFileName} on:error={onMediaLoadError}/>

		{:else if (renderType === "video")}
			<video playsinline controls autoplay bind:this={videoPlayer}>
				<source src={url} type={translateMimeType(mimeType)} on:error={onMediaLoadError}/>
			</video>

		{:else if (renderType === "audio")}
			<audio controls autoplay bind:this={videoPlayer}>
				<source src={url} type={translateMimeType(mimeType)} on:error={onMediaLoadError}/>
			</audio>

		{/if}
	{/key}
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

	:global(.plyr video) {
		height: 100vh !important; /* This might cause problems in the future if there are vertical split views */
	}

	:global(.flippedHorizontally) {
		transform: scaleX(-1);
	}

	:global(.flippedVertically) {
		transform: scaleY(-1);
	}

	:global(.flippedHorizontally.flippedVertically) {
		transform: scaleX(-1) scaleY(-1);
	}
</style>
