import { getMapAsString, dedupList, diffLists, getSkipChars, getWordChars } from './utils';

type Trie = Map<string | '_kw_', Trie | string>;
type KwListMap = Map<string, string[]>;
type Opts = {
	tag: string;
	element?: CustomElementConstructor;
	elementMethods?: Array<[string, (args: any) => void]>;
	getAttrs?: (id: string) => Array<[string, string]>;
	shouldSkipChars?: boolean;
};

export class Match {
	private readonly _kw: '_kw_';
	private wordChars: Set<string>;
	private skipChars: Set<string>;
	private readonly trieCI: Trie;
	private readonly trieCS: Trie;
	readonly opts: Opts;

	constructor(insensitive: KwListMap | null, sensitive: KwListMap | null, opts: Opts) {
		this._kw = '_kw_';
		this.wordChars = getWordChars();
		this.skipChars = getSkipChars();
		this.trieCI = new Map();
		this.trieCS = new Map();
		this.areKwListMapsValid(insensitive, sensitive);
		this.addKws(insensitive, false);
		this.addKws(sensitive, true);
		this.opts = {
			// @ts-ignore
			tag: 'span',
			// @ts-ignore
			getAttrs: (id) => [['data-match-id', id]],
			shouldSkipChars: true,
			...opts
		};

		if (
			typeof window !== 'undefined' &&
			window.customElements &&
			opts.element !== undefined &&
			!window.customElements.get(opts.tag)
		) {
			if (Array.isArray(opts.elementMethods) && opts.elementMethods.length) {
				const { element } = opts;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
				opts.elementMethods.forEach(([methodName, fn]) => (element.prototype[methodName] = fn));
			}
			window.customElements.define(opts.tag, opts.element);
		}
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

	areKwListMapsValid = (insensitive: KwListMap | null, sensitive: KwListMap | null) => {
		if (insensitive === null && sensitive === null)
			throw new Error('please provide a case-sensitive and/or case-insensitive kw map');

		const cs: string[] = [];
		if (sensitive !== null) sensitive.forEach((strList) => strList.forEach((s) => cs.push(s)));
		// check for duplicates in cs as there should be none
		// duplicates in lowerCaseCs CAN exist (checking for ['AbcD', 'abCD'] but not ['abcd'])
		const dedupedCS = dedupList(cs);
		if (dedupedCS.length !== cs.length) {
			throw new Error(
				`case-sensitive map contains duplicates => ${JSON.stringify(diffLists(dedupedCS, cs))}`
			);
		}

		const lowercaseCi: string[] = [];
		if (insensitive !== null)
			insensitive.forEach((strList) => strList.forEach((s) => lowercaseCi.push(s.toLowerCase())));
		// check for duplicates in lowercaseCi as there should be none
		const dedupedLowercaseCi = dedupList(lowercaseCi);
		if (dedupedLowercaseCi.length !== lowercaseCi.length) {
			throw new Error(
				`lower-cased case-insensitive map contains duplicates => ${JSON.stringify(
					diffLists(dedupedLowercaseCi, lowercaseCi)
				)}`
			);
		}

		const lowercaseCs = cs.map((s) => s.toLowerCase());
		const mergedLists = [...dedupList(lowercaseCs), ...lowercaseCi];
		// check for duplicates in merged lowercaseCi and dedupedLowercaseCs as there should be none
		const dedupedMergedLists = dedupList(mergedLists);
		if (dedupedMergedLists.length !== mergedLists.length) {
			throw new Error(
				`merged lower-cased case-insensitive list and deduped lower-cased case-sensitive map contains duplicates => ${JSON.stringify(
					diffLists(dedupedMergedLists, mergedLists)
				)}`
			);
		}
		return true;
	};

	addKws(KwListMap: KwListMap | null, caseSensitive: boolean) {
		if (KwListMap === null) return;
		KwListMap.forEach((kws, id) => {
			kws.forEach((kw) => this.addKw(id, kw, caseSensitive));
		});
	}

	getMatchIndexes(sentence: string) {
		const idsWithIndexes: Array<[string, number, number]> = [];
		const len = sentence.length;

		const parse = (caseSensitive: boolean) => {
			let currentTrie = caseSensitive ? this.trieCS : this.trieCI;
			let found: [string, number, number] = ['', -1, -1];
			let hasChar = false;

			for (let i = 0; i <= len; i++) {
				const char = sentence[i];
				const prevChar = sentence[i - 1];
				const nextChar = sentence[i + 1];
				const charIsNotAWordChar = !this.wordChars.has(char);
				const prevCharIsNotAWordChar = !this.wordChars.has(prevChar);
				const nextCharIsNotAWordChar = !this.wordChars.has(nextChar);

				hasChar = currentTrie.has(char);

				if (this.opts.shouldSkipChars && this.skipChars.has(char)) continue;

				if (!hasChar) {
					// if the current char in the sentence does not have an entry in the currentTrie
					if (found[0] && found[1] >= 0 && found[2] >= 0 && charIsNotAWordChar) {
						idsWithIndexes.push(found);
					}

					currentTrie = caseSensitive ? this.trieCS : this.trieCI;
					found = ['', -1, -1];
					if (currentTrie.has(char)) i = i - 1;
					continue;
				}

				if (found[1] < 0 && prevCharIsNotAWordChar) found[1] = i;

				currentTrie = currentTrie.get(char) as Trie;
				if (currentTrie.has(this._kw) && nextCharIsNotAWordChar) {
					found = [currentTrie.get(this._kw) as string, found[1], i];
				}
			}
		};

		if (this.trieCI !== null) parse(false);
		if (this.trieCS !== null) parse(true);

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
			const attrStr: string =
				this.opts
					.getAttrs?.(match[0])
					.reduce((acc, cur, i) => `${acc}${i > 0 ? ' ' : ''}${cur[0]}="${cur[1]}"`, '') || '';

			newSentence = `${newSentence}${sentence.slice(lastMatchEndIndex, match[1])}<${
				this.opts.tag
			} ${attrStr}>${sentence.slice(match[1], match[2] + 1)}</${this.opts.tag}>`;
			lastMatchEndIndex = match[2] + 1;
		});
		return newSentence + sentence.slice(lastMatchEndIndex);
	}
}
