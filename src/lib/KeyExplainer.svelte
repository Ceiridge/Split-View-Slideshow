<script>
	import Plyr from "plyr";
	import ExplainedKey from "./ExplainedKey.svelte";

	const supportsWebApis = "webkitRelativePath" in File.prototype && Plyr.supported('video', 'html5', true);
	// TODO: Move split views with CTRL
</script>

<a href="https://github.com/Ceiridge/Split-View-Slideshow" target="_blank" rel="noreferrer"><h1>Split View
	Slideshow</h1></a>

{#if !supportsWebApis}
	<p class="webApiError">Your browser does not support the <a
			href="https://caniuse.com/mdn-api_window_showdirectorypicker"
			target="_blank" rel="noreferrer nofollow">experimental
		web technology</a> used here. Expect errors. A Chromium-based browser is recommended.</p>
{/if}

<p>All your files and folders stay local.</p>

<h2>Key bindings help:</h2>

<h3>Main Keys:</h3>
<div class="keyExplainer">
	<ExplainedKey key="n" description="Open a new split view media player"/>
	<ExplainedKey key="del" special={true} description="Close the focused split view"/>

	<ExplainedKey key="a" description="Switch active split view focus to the left"/>
	<ExplainedKey key="d" description="Switch active split view focus to the right"/>

	<ExplainedKey key="left" special={true} description="Go to the next image"/>
	<ExplainedKey key="right" special={true} description="Go to the next image"/>

	<ExplainedKey key="h" description="Show/Hide this help"/>
</div>

<h3>Standard Media Keys:</h3>
<div class="keyExplainer">
	<ExplainedKey key="j" description="Seek 5s forward"/>
	<ExplainedKey key="l" description="Seek 5s backward"/>

	<ExplainedKey key="up" special={true} description="Increase video volume"/>
	<ExplainedKey key="down" special={true} description="Decrease video volume"/>

	<ExplainedKey key="k" description="Play/Pause video"/>
	<ExplainedKey key="m" description="Mute/Unmute video"/>

	<ExplainedKey key="+" special={true} description="Increase video speed"/>
	<ExplainedKey key="-" special={true} description="Decrease video speed"/>
	<ExplainedKey key="0" description="Default video speed"/>

</div>

<style>
	.keyExplainer {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-column-gap: 0;
	}

	.webApiError {
		color: red;
		font-weight: bold;
		background-color: white;
		padding: 5px;
	}
</style>
