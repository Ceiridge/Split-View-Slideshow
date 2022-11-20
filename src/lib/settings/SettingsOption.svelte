<script>
	import {userSettings} from "../../GlobalState.js";

	export let name, type, path;
	export let args = {};
	let fullSettings, val;

	function actInObject(obj, path, newValue = undefined) {
		const pathElements = path.split(".");
		let pathElementIndex = 0;

		let foundValue = obj;
		while (pathElementIndex < pathElements.length) {
			const pathElement = pathElements[pathElementIndex];
			if (newValue !== undefined && pathElementIndex === pathElements.length - 1) {
				foundValue[pathElement] = newValue;
			}

			foundValue = foundValue[pathElement];
			pathElementIndex++;
		}

		return foundValue;
	}

	userSettings.subscribe(settings => {
		fullSettings = settings;
		val = actInObject(settings, path);
	});

	function onChange(event) {
		let newValue;
		switch (type) {
			case "checkbox":
				newValue = event.target.checked;
				break;
			case "number":
				newValue = parseFloat(event.target.value);
				break;
			default:
				newValue = event.target.value;
				break;
		}

		val = newValue;
		actInObject(fullSettings, path, newValue);
		userSettings.set(fullSettings);
	}
</script>

<div class="setting">
	{#if type === "checkbox"}
		<input type="checkbox" checked={val} on:change={onChange}/>
	{:else if type === "number"}
		<input type="number" value={val} on:change={onChange} placeholder={name} {...args}/>
	{/if}

	<label>{name}</label>
</div>
