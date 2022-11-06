<script>
	import BrokenImage from "../assets/svg/BrokenImage.svelte";

	export let folderFileInput, fileFileInput;
</script>

<div class="emptyMedia">
	<BrokenImage/>

	<span>No media loaded.</span><br>
	<span>Drag & Drop a folder or media file(s) in here.</span>
	<br><br>

	<span>Or alternatively:</span><br>
	<div>
		<button on:click={() => {folderFileInput.click();}}>Open folder</button>
		<button on:click={() => {fileFileInput.click();}}>Open file(s)</button>
	</div>
</div>

<style>
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
</style>
