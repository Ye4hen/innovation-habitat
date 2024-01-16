export function getFiltersList(list, key) {
	return [...new Set(list && list.map((item) => item[key]))].sort();
}