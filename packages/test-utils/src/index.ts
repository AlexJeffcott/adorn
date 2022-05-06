export {
	ipsumCaseSensitive,
	ipsumCaseInsensitive,
	ipsumParagraphs,
	ipsumText,
	ipsumSensitiveWordPairs,
	ipsumSensitiveWords
} from './ins/ipsum';
export {
	extractedMatchIds,
	replacedKws,
	extractedDirtyMatches,
	wrappedKwsWithHtml
} from './outs/ipsum';

function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min)); //The maximum is exclusive and the minimum is inclusive
}

function getRndString(length: number): string {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters[Math.floor(Math.random() * charactersLength)];
	}
	return result;
}

export function createListOfNLengthForMap(length: number): Array<[string, string[]]> {
	const min = 4;
	const max = 15;
	return Array(length)
		.fill('')
		.map((v, i) => [i.toString(10), [getRndString(getRandomInt(min, max))]]);
}

// const ipsumCS = new Map(createListOfNLengthForMap(9999));
// const ipsumCI = new Map(createListOfNLengthForMap(1));
