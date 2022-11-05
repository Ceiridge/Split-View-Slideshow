<script>
	import ExplainedKey from "./ExplainedKey.svelte";
</script>

<a href="https://github.com/Ceiridge/Split-View-Slideshow" target="_blank" rel="noreferrer"><h1>Split View Slideshow</h1></a>
<h2>Key bindings help:</h2>

<h3>Special Keys:</h3>
<div class="keyExplainer">
	<ExplainedKey key="h" description="Show/Hide this help"/>
	<ExplainedKey key="n" description="Open a new split view media player"/>

	<ExplainedKey key="q" description="Switch active split view focus to the left"/>
	<ExplainedKey key="e" description="Switch active split view focus to the right"/>

</div>

<h3>Standard Media Keys:</h3>
<div class="keyExplainer">
	<ExplainedKey key="left" special="true" description="Seek 5s forward or go to the next image"/>
	<ExplainedKey key="right" special="true" description="Seek 5s backward or go to the next image"/>
</div>

<style>
	.keyExplainer {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-column-gap: 0;
	}
</style>
