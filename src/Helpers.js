import mime from "mime";
import {ALLOWED_MIME_TYPES} from "./Constants.js";

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

export function getRelativePath(file, removeFirstFolder) {
	let wkPath = file.webkitRelativePath;
	if (!wkPath) {
		return wkPath;
	}

	if (removeFirstFolder && wkPath.includes("/")) {
		wkPath = wkPath.substring(wkPath.indexOf("/") + 1);
	}

	return wkPath;
}

export function filterFilesInput(files, isFromFolder, loadRecursively) {
	return [...files].filter(file => {
		let recursiveCheck = true;

		if (!loadRecursively) {
			const relativePath = getRelativePath(file, isFromFolder);

			if (!relativePath) {
				recursiveCheck = true;
			} else {
				recursiveCheck = relativePath === file.name;
			}
		}

		// Only allowed mime types
		const mimeType = mime.getType(file.name);
		return recursiveCheck && mimeType && ALLOWED_MIME_TYPES.some(allowedType => mimeType.startsWith(allowedType));
	}).map(file => ({
		file,
		objectUrl: null,
		path: file.name,
		mime: mime.getType(file.name)
	}));
}
