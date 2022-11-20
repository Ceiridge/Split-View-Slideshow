<script>
	import SettingsOption from "./SettingsOption.svelte";
</script>

<div class="settingsBox">
	<details>
		<summary>
			<span class="underlined">Settings</span> (saved in your browser)
		</summary>

		<div class="settings">
			<details open>
				<summary>General</summary>

				<div class="settingsFlex">
					<SettingsOption name="Load all media recursively from a folder" type="checkbox"
									path="readRecursively"/>
					<SettingsOption name="Hide cursor after inactivity" type="checkbox"
									path="hideCursor"/>
				</div>
			</details>

			<details open>
				<summary>Media</summary>

				<div class="settingsFlex">
					<SettingsOption name="Default video volume" type="number" args={{min: 0, max: 1, step: 0.05}}
									path="defaultVolume"/>
				</div>
			</details>

			<details open>
				<summary>Slideshow</summary>

				<div class="settingsFlex">
					<SettingsOption name="Skip erroneous media automatically" type="checkbox"
									path="slideshowSkipErrorMedia"/>

					<SettingsOption name="Slideshow image delay (ms)" type="number" args={{min: 0}}
									path="slideshowDelays.imageWait"/>
					<SettingsOption name="Slideshow video delay (ms)" type="number" args={{min: 0}}
									path="slideshowDelays.videoWait"/>
				</div>
			</details>
		</div>

	</details>
</div>

<style>
	.underlined {
		text-decoration: underline;
	}

	summary {
		cursor: pointer;
	}

	.settingsBox {
		padding: 15px;
		border: 2px white solid;
		border-radius: 5px;
	}

	.settings {
		margin-top: 14px;
		margin-bottom: 5px;

		padding: 5px;
		border-radius: 4px;
		background-color: var(--global-background-color-bright);
	}

	.settings details {
		margin-bottom: 10px;
	}

	.settingsFlex {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-column-gap: 0;

		padding-left: 15px;
		padding-right: 15px;
	}
</style>
