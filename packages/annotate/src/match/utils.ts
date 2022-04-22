const getChars = (start: number, end: number, ascii: boolean): string[] => {
	const temp = [];
	for (let i = start; i <= end; i++) {
		temp.push(ascii ? String.fromCharCode(i) : i.toString());
	}
	return temp;
};

export const getNonWordBoundaries = (): Set<string> =>
	new Set([...getChars(0, 9, false), ...getChars(65, 90, true), ...getChars(97, 122, true), '_']);

export const replacer = (key: any, value: any): any => {
	if (value instanceof Map) {
		return Array.from(value.entries()); // or with spread: value: [...value]
	} else {
		return value;
	}
};

export const mapLogger = (label: string, mapToLog: Map<any, any>) =>
	console.log(`|> ${label} ===>`, getMapAsString(mapToLog));

export const getMapAsString = (map: Map<any, any>, pretty?: boolean) =>
	JSON.stringify(map, replacer, pretty ? 2 : 0);

export const getSizeInBytes = (obj: any): number => {
	let str = '';
	if (typeof obj === 'string') {
		str = obj;
	} else if (obj instanceof Map) {
		str = getMapAsString(obj);
	} else {
		str = JSON.stringify(obj);
	}
	return new TextEncoder().encode(str).length;
};
