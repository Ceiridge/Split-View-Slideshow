export function wrapIndex(arr, index) {
	if (index < 0) {
		index = arr.length - 1;
	} else if (index >= arr.length) {
		index = 0;
	}

	return index;
}

export async function convertItemsIntoFiles(itemEntries, withRecursion) {
	let files = [];

	function itemToFile(item) {
		return new Promise((resolve, reject) => {
			item.file(resolve, reject);
		});
	}

	async function recurse(items, recurseAnywayOnce) {
		for (const item of items) {
			if (item.isFile) {
				files.push(await itemToFile(item));
			} else if (item.isDirectory && (withRecursion || recurseAnywayOnce)) {
				const itemsInDir = await new Promise((resolve, reject) => {
					const dirReader = item.createReader();
					dirReader.readEntries(resolve, reject);
				});

				await recurse(itemsInDir, false);
			}
		}
	}

	await recurse(itemEntries, !itemEntries.some(itemEntry => itemEntry.isFile)); // If all directories, do first recursions
	return files;
}
