<script>
	export let mimeType;
	export let url;
	export let displayFileName;

	let renderType;
	if (mimeType.startsWith("image/")) {
		renderType = "img";
	} else if (mimeType.startsWith("video/")) { // TODO
		renderType = "video";
	} else if (mimeType.startsWith("audio/")) {
		renderType = "audio";
	}
</script>

<div class="mediaPlayer">
	{#if (renderType === "img")}
		<img class="mediaImage" src={url} alt={displayFileName}/>
	{/if}
</div>

<style>
	.mediaPlayer {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.mediaImage {
		display: block;
		max-width: 100%;
		max-height: 100%;
	}
</style>
