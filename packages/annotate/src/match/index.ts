import { getMapAsString, getNonWordBoundaries } from './utils';

type Trie = Map<string | '_kw_', Trie | string>;
type KwList = Map<string, string[]>;
type Opts = { tag: string };

export class Match {
	private readonly _kw: '_kw_';
	private nonWordBoundaries: Set<string>;
	private readonly trieCI: Trie;
	private readonly trieCS: Trie;
	private readonly opts: Opts;

	constructor(insensitive: KwList | null, sensitive: KwList | null, opts: Opts) {
		this._kw = '_kw_';

		this.nonWordBoundaries = getNonWordBoundaries();

		this.trieCI = new Map();
		this.trieCS = new Map();
		this.areKWListsValid(insensitive, sensitive);
		this.addKws(insensitive, false);
		this.addKws(sensitive, true);
		this.opts = opts;
	}

	getDetails() {
		return {
			trieAsString: `CI ===> ${getMapAsString(this.trieCI)} || CS ===> ${getMapAsString(
				this.trieCS
			)}`
		};
	}

	/**
	 * @param id is the associated id
	 * @param keyword is the target text to match against
	 * @param caseSensitive is whether to ONLY map the chars with their given case
	 */
	addKw(id: string, keyword: string, caseSensitive: boolean) {
		let currentTrie = caseSensitive ? this.trieCS : this.trieCI;

		keyword.split('').forEach((char) => {
			if (caseSensitive) {
				if (!currentTrie.get(char)) currentTrie.set(char, new Map());
				currentTrie = currentTrie.get(char) as Trie; // trust that the value to the key char is always a Trie
			} else {
				const lowercaseChar = char.toLowerCase();
				const uppercaseChar = char.toUpperCase();
				let lowercaseTrie = currentTrie.get(lowercaseChar);
				if (!lowercaseTrie) currentTrie.set(lowercaseChar, new Map());
				lowercaseTrie = currentTrie.get(lowercaseChar) as Trie; // trust that the value to the key char is always a Trie
				if (!currentTrie.get(uppercaseChar)) currentTrie.set(uppercaseChar, lowercaseTrie);
				currentTrie = lowercaseTrie;
			}
		});
		currentTrie.set(this._kw, id);
	}

	areKWListsValid(insensitive: KwList | null, sensitive: KwList | null): boolean {
		if (insensitive === null && sensitive === null)
			throw new Error('please provide a case-sensitive and/or case-insensitive kw map');

		const dedup = (list: string[]) => Array.from(new Set(list));

		const cs: string[] = [];
		if (sensitive !== null) sensitive.forEach((strList) => strList.forEach((s) => cs.push(s)));
		// check for duplicates in cs as there should be none
		// duplicates in lowerCaseCs CAN exist (checking for ['AbcD', 'abCD'] but not ['abcd'])
		if (dedup(cs).length !== cs.length) throw new Error('case-sensitive map contains duplicates');

		const lowercaseCi: string[] = [];
		if (insensitive !== null)
			insensitive.forEach((strList) => strList.forEach((s) => lowercaseCi.push(s.toLowerCase())));
		// check for duplicates in lowercaseCi as there should be none
		if (dedup(lowercaseCi).length !== lowercaseCi.length)
			throw new Error('lower-cased case-insensitive map contains duplicates');

		const lowercaseCs: string[] = cs.map((s) => s.toLowerCase());
		const mergedLists = [...dedup(lowercaseCs), ...lowercaseCi];
		// check for duplicates in merged lowercaseCi and dedupedLowercaseCs as there should be none
		if (dedup(mergedLists).length !== mergedLists.length)
			throw new Error(
				'merged lower-cased case-insensitive list and deduped lower-cased case-sensitive map contains duplicates'
			);

		return true;
	}

	addKws(kwList: KwList | null, caseSensitive: boolean) {
		if (kwList === null) return;
		kwList.forEach((kws, id) => {
			kws.forEach((kw) => this.addKw(id, kw, caseSensitive));
		});
	}

	getMatchIndexes(sentence: string) {
		const idsWithIndexes: Array<[string, number, number]> = [];
		const len = sentence.length;
		let currentTrie = null as unknown as Trie;
		let matchStart: null | number = null;
		let matchEnd: null | number = null;
		let foundId = '';
		let hasChar = false;

		const pass = (caseSensitive: boolean) => {
			currentTrie = caseSensitive ? this.trieCS : this.trieCI;
			matchStart = null;
			matchEnd = null;
			foundId = '';
			hasChar = false;

			for (let i = 0; i <= len; i++) {
				if (len === i && foundId) {
					// if you reach the end of the sentence, and you have a foundId then push it to the list and break.
					// this is to catch matches that terminate a sentence like where 'match' is found 'at the end of the phrase match'
					if (matchStart === null) throw new Error('!!!matchStart is null in getMatchIndexes!!!');
					matchEnd = i - 1;
					idsWithIndexes.push([foundId, matchStart, matchEnd]);
					break;
				}

				const previousCharIsNonWordBoundary =
					i === 0 ? true : !this.nonWordBoundaries.has(sentence[i - 1]);

				const char = sentence[i];

				const charIsNonWordBoundary = !this.nonWordBoundaries.has(char);

				hasChar = currentTrie.has(char);

				if (hasChar && matchStart === null && previousCharIsNonWordBoundary) {
					matchStart = i;
				}

				if (matchStart === null) continue;

				if (hasChar) currentTrie = currentTrie.get(char) as Trie;

				foundId = currentTrie.has(this._kw) ? (currentTrie.get(this._kw) as string) : '';

				// if the current char in the sentence does not have an entry in the currentTrie
				if (!hasChar) {
					if (foundId && charIsNonWordBoundary) {
						matchEnd = i - 1;
						idsWithIndexes.push([foundId, matchStart, matchEnd]);
					}
					currentTrie = caseSensitive ? this.trieCS : this.trieCI;
					foundId = '';
					matchStart = null;
					matchEnd = null;
				}
			}
		};

		if (this.trieCI !== null) pass(false);
		if (this.trieCS !== null) pass(true);

		return idsWithIndexes.sort((a, b) => a[1] - b[1]);
	}

	extractMatchIds(sentence: string) {
		const ids = this.getMatchIndexes(sentence).map((idWithIndexes) => idWithIndexes[0]);
		return Array.from(new Set(ids));
	}

	extractDirtyMatches(sentence: string) {
		const dirtyMatches: Array<[string, string]> = this.getMatchIndexes(sentence).map((match) => [
			match[0],
			sentence.slice(match[1], match[2] + 1)
		]);

		return new Map(dirtyMatches);
	}

	replaceKws(sentence: string) {
		let lastMatchEndIndex = 0;
		let newSentence = '';

		this.getMatchIndexes(sentence).forEach((match) => {
			newSentence = newSentence + sentence.slice(lastMatchEndIndex, match[1]) + match[0];
			lastMatchEndIndex = match[2] + 1;
		});
		return newSentence + sentence.slice(lastMatchEndIndex);
	}

	wrapKwsWithHtml(sentence: string) {
		const matches = this.getMatchIndexes(sentence);
		if (!matches.length) return sentence;

		let lastMatchEndIndex = 0;
		let newSentence = '';

		matches.forEach((match) => {
			newSentence = `${newSentence}${sentence.slice(lastMatchEndIndex, match[1])}<${
				this.opts.tag
			} data-match-id="${match[0]}">${sentence.slice(match[1], match[2] + 1)}</${this.opts.tag}>`;
			lastMatchEndIndex = match[2] + 1;
		});
		return newSentence + sentence.slice(lastMatchEndIndex);
	}
}
