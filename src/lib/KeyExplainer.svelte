<script>
	import ExplainedKey from "./ExplainedKey.svelte";

	const supportsWebApis = "webkitRelativePath" in File.prototype;
</script>

<a href="https://github.com/Ceiridge/Split-View-Slideshow" target="_blank" rel="noreferrer"><h1>Split View
	Slideshow</h1></a>

{#if !supportsWebApis}
	<p class="webApiError">Your browser does not support the <a
			href="https://caniuse.com/mdn-api_window_showdirectorypicker"
			target="_blank" rel="noreferrer nofollow">experimental
		web technology</a> used here. Expect errors. A Chromium-based browser is recommended.</p>
{/if}

<h2>Key bindings help:</h2>

<h3>Main Keys:</h3>
<div class="keyExplainer">
	<ExplainedKey key="n" description="Open a new split view media player"/>
	<ExplainedKey key="del" special={true} description="Close the focused split view"/>

	<ExplainedKey key="q" description="Switch active split view focus to the left"/>
	<ExplainedKey key="e" description="Switch active split view focus to the right"/>

	<ExplainedKey key="h" description="Show/Hide this help"/>
</div>

<h3>Standard Media Keys:</h3>
<div class="keyExplainer">
	<ExplainedKey key="left" special={true} description="Seek 5s forward or go to the next image"/>
	<ExplainedKey key="right" special={true} description="Seek 5s backward or go to the next image"/>

	<ExplainedKey key="j" description="Seek 10s forward"/>
	<ExplainedKey key="l" description="Seek 10s backward"/>
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
