<script>
	export let key;
	export let description;
	export let special = false;
</script>

<div class="explainedKey">
	<div class="{'key' + (special ? ' special' : '')}">
		<span>{key}</span>
	</div>

	&ndash; {description}
</div>

<style>
	.explainedKey {
		display: flex;
		align-items: center;
	}

	div.key {
		width: 35px;
		height: 37px;
		padding: 1px;
		margin: 10px;
		background-color: #323232;
	}

	div.key > span {
		display: block;
		width: 35px;
		height: 35px;
		border: 1px solid #a9a9a9;
		border-radius: 2px 2px 2px 2px;
		-moz-border-radius: 2px 2px 2px 2px;
		-webkit-border-radius: 2px 2px 2px 2px;
		font-size: 12px;
		-moz-box-sizing: border-box !important;
		-webkit-box-sizing: border-box !important;
		box-sizing: border-box !important;
		text-align: center;
		padding-top: 10px;
		color: #dcdcdc;
		-webkit-box-shadow: 0px 3px 0px -2px rgba(255, 255, 255, 1), 0px 2px 0px 0px rgba(169, 169, 169, 1);
		-moz-box-shadow: 0px 3px 0px -2px rgba(255, 255, 255, 1), 0px 2px 0px 0px rgba(169, 169, 169, 1);
		box-shadow: 0px 3px 0px -2px rgba(255, 255, 255, 1), 0px 2px 0px 0px rgba(169, 169, 169, 1);
		cursor: pointer;
	}

	div.key > span:hover {
		border: 1px solid #5a88c5;
		color: #fff;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
		-webkit-box-shadow: 0px 3px 0px -2px rgba(117, 180, 251, 1), 0px 2px 0px 0px rgba(90, 136, 197, 1);
		-moz-box-shadow: 0px 3px 0px -2px rgba(117, 180, 251, 1), 0px 2px 0px 0px rgba(90, 136, 197, 1);
		box-shadow: 0px 3px 0px -2px rgba(117, 180, 251, 1), 0px 2px 0px 0px rgba(90, 136, 197, 1);
		cursor: pointer;
	}

	div.key > span:active {
		margin-top: 2px;
		box-shadow: none;
		-moz-box-shadow: none;
		-webkit-box-shadow: none;
	}

	div.key.special > span {
		padding-top: 15px;
		font-size: 11px;
	}
</style>
