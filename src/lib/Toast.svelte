<script>
	import {fade} from "svelte/transition";
	import {cubicInOut} from "svelte/easing";

	let text;
	let extraText;

	let showNow = false;
	let showNowTimeout = null;

	export const exposedFunctions = {
		show: (_text, _extraText = "") => {
			showNow = true;
			text = _text;
			extraText = _extraText;

			if (showNowTimeout !== null) {
				clearTimeout(showNowTimeout);
			}
			showNowTimeout = setTimeout(() => {
				showNow = false;
				showNowTimeout = null;
			}, 1500);
		}
	};
</script>

{#if showNow}
	<span class="toast" in:fade={{delay: 0, duration: 250, easing: cubicInOut}}
		  out:fade={{delay: 3250, duration: 250, easing: cubicInOut}}>
		{text}

		<span class="toastExtra">
			{extraText}
		</span>
	</span>
{/if}

<style>
	.toast {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		padding: 5px;

		background-color: rgba(0, 0, 0, 0.5);
	}

	.toastExtra {
		color: #949494;
	}
</style>
