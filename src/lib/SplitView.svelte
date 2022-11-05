<script>
	export let focused = false;
	export let debugId;
</script>

<div class="view" class:focused={focused}>
	Test {debugId}
</div>

<style>
	.focused {
		animation-name: focusedHide;
		animation-duration: 1.5s;
	}

	@keyframes focusedHide {
		from {
			box-shadow: inset 0 0 20px 3px #0f9946;
		}

		to {
			box-shadow: inset 0 0 2px 3px rgba(15, 153, 70, 0);
		}
	}
</style>
