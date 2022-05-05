import { getMapAsString, getNonWordBoundaries } from './utils';

type Trie = Map<string | '_kw_', Trie | string>;
type KwList = Map<string, string[]>;
type Opts = { tag: string };

export class Match {
	private readonly _kw: '_kw_';
	private nonWordBoundaries: Set<string>;
	private readonly trie: Trie;
	private readonly opts: Opts;

	constructor(insensitive: KwList | null, sensitive: KwList | null, opts: Opts) {
		this._kw = '_kw_';

		this.nonWordBoundaries = getNonWordBoundaries();

		this.trie = new Map();
		this.areKWListsValid(insensitive, sensitive);
		this.addKws(insensitive, false);
		this.addKws(sensitive, true);
		this.opts = opts;
	}

	getDetails() {
		return {
			trieAsString: getMapAsString(this.trie)
		};
	}

	/**
	 * @param id is the associated id
	 * @param keyword is the target text to match against
	 * @param caseSensitive is whether to ONLY map the chars with their given case
	 */
	addKw(id: string, keyword: string, caseSensitive: boolean) {
		let currentTrie = this.trie;

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
		const idsWithIndexes: Array<string | number>[] = [];
		const len = sentence.length;
		let currentTrie = this.trie;
		let matchStart: null | number = null;
		let matchEnd: null | number = null;
		let foundId: boolean | string = false;

		for (let i = 0; i < len; i++) {
			const char = sentence[i];
			const hasChar = currentTrie.has(char);
			if (hasChar && matchStart === null) matchStart = i;

			if (hasChar) currentTrie = currentTrie.get(char) as Trie;

			foundId = currentTrie.has(this._kw) && (currentTrie.get(this._kw) as string);

			if (!hasChar || i === len - 1) {
				if (foundId) {
					if (matchStart === null) throw new Error('!!!matchStart is null in getMatchIndexes!!!');
					matchEnd = hasChar ? i : i - 1;
					idsWithIndexes.push([foundId, matchStart, matchEnd]);
				}
				currentTrie = this.trie;
				foundId = false;
				matchStart = null;
				matchEnd = null;
			}
		}
		return idsWithIndexes;
	}

	extractMatchIds(sentence: string) {
		const keywordsExtracted: string[] = [];
		const sentenceLength = sentence.length;

		if (sentenceLength === 0) return keywordsExtracted;

		let currentTrie = this.trie;
		let sequenceEndPos = 0;
		let idx = 0;

		while (idx < sentenceLength) {
			let char = sentence[idx];

			let sequenceFound, longestSequenceFound, isLongerSequenceFound, idy;

			if (!this.nonWordBoundaries.has(char)) {
				if (currentTrie.has(this._kw) || currentTrie.has(char)) {
					sequenceFound = '';
					longestSequenceFound = '';
					isLongerSequenceFound = false;

					if (currentTrie.has(this._kw)) {
						sequenceFound = currentTrie.get(this._kw) as string; // trust that the value to the key this._kw is always a string
						longestSequenceFound = currentTrie.get(this._kw) as string; // trust that the value to the key this._kw is always a string
						sequenceEndPos = idx;
					}

					if (currentTrie.has(char)) {
						let currentDictContinued = currentTrie.get(char);
						idy = idx + 1;

						while (idy < sentenceLength) {
							const innerChar = sentence[idy];

							if (
								!this.nonWordBoundaries.has(innerChar) &&
								typeof currentDictContinued !== 'string' &&
								currentDictContinued?.has(this._kw)
							) {
								longestSequenceFound = currentDictContinued.get(this._kw) as string; // trust that the value to the key this._kw is always a string
								sequenceEndPos = idy;
								isLongerSequenceFound = true;
							}

							// see if there is a longer match by checking whether the next char in the sentence has an entry
							if (
								typeof currentDictContinued !== 'string' &&
								currentDictContinued?.has(innerChar)
							) {
								currentDictContinued = currentDictContinued.get(innerChar);
							} else {
								break;
							}
							++idy;
						}

						if (
							idy >= sentenceLength &&
							typeof currentDictContinued !== 'string' &&
							currentDictContinued?.has(this._kw)
						) {
							longestSequenceFound = currentDictContinued.get(this._kw) as string; // trust that the value to the key this._kw is always a string
							sequenceEndPos = idy;
							isLongerSequenceFound = true;
						}

						if (isLongerSequenceFound) {
							idx = sequenceEndPos;
						}
					}

					currentTrie = this.trie;
					if (longestSequenceFound) {
						keywordsExtracted.push(longestSequenceFound);
					}
				} else {
					currentTrie = this.trie;
				}
			} else if (currentTrie.has(char)) {
				currentTrie = currentTrie.get(char) as Trie; // trust that the value to the key char is always a Trie
			} else {
				currentTrie = this.trie;
				idy = idx + 1;

				while (idy < sentenceLength) {
					char = sentence[idy];
					if (!this.nonWordBoundaries.has(char)) break;
					++idy;
				}

				idx = idy;
			}

			if (idx + 1 >= sentenceLength) {
				if (currentTrie.has(this._kw)) {
					sequenceFound = currentTrie.get(this._kw) as string; // trust that the value to the key this._kw is always a string
					keywordsExtracted.push(sequenceFound);
				}
			}

			++idx;
		}
		return [...new Set(keywordsExtracted)]; // filter out duplicates
	}

	extractDirtyMatches(sentence: string) {
		const sentenceLength = sentence.length;
		const orgSentence = sentence;
		const dirtyMap = new Map();
		let currentWord = '';
		let currentTrie = this.trie;
		let sequenceEndPos = 0;
		let idx = 0;

		while (idx < sentenceLength) {
			let char = sentence[idx];
			currentWord += orgSentence[idx];

			let sequenceFound, longestSequenceFound, isLongerSequenceFound, idy;

			if (this.nonWordBoundaries.has(char) && idx + 1 === sentenceLength && currentTrie.has(char)) {
				const currentDictContinued = currentTrie.get(char);
				const currentWordContinued = currentWord;
				idy = idx + 1;

				if (typeof currentDictContinued !== 'string' && currentDictContinued?.has(this._kw)) {
					longestSequenceFound = currentDictContinued?.get(this._kw) as string; // trust that the value to the key this._kw is always a string
					sequenceEndPos = idy;
					isLongerSequenceFound = true;
				}

				if (isLongerSequenceFound) {
					idx = sequenceEndPos;
					currentWord = currentWordContinued;
				}
			}

			if (!this.nonWordBoundaries.has(char)) {
				if (currentTrie.has(this._kw) || currentTrie.has(char)) {
					sequenceFound = '';
					longestSequenceFound = '';
					isLongerSequenceFound = false;

					if (currentTrie.has(this._kw)) {
						sequenceFound = currentTrie.get(this._kw);
						longestSequenceFound = currentTrie.get(this._kw);
						sequenceEndPos = idx;
					}

					if (currentTrie.has(char)) {
						let currentDictContinued = currentTrie.get(char);
						let currentWordContinued = currentWord;
						idy = idx + 1;

						while (idy < sentenceLength) {
							const innerChar = sentence[idy];
							currentWordContinued += orgSentence[idy];

							if (
								!this.nonWordBoundaries.has(innerChar) &&
								typeof currentDictContinued !== 'string' &&
								currentDictContinued?.has(this._kw)
							) {
								longestSequenceFound = currentDictContinued.get(this._kw) as string; // trust that the value to the key this._kw is always a string
								sequenceEndPos = idy;
								isLongerSequenceFound = true;
							}

							if (
								typeof currentDictContinued !== 'string' &&
								currentDictContinued?.has(innerChar)
							) {
								currentDictContinued = currentDictContinued.get(innerChar) as Trie; // trust that the value to the key char is always a Trie
							} else {
								break;
							}

							++idy;
						}

						if (
							idy >= sentenceLength &&
							typeof currentDictContinued !== 'string' &&
							currentDictContinued?.has(this._kw)
						) {
							longestSequenceFound = currentDictContinued?.get(this._kw) as string; // trust that the value to the key this._kw is always a string
							sequenceEndPos = idy;
							isLongerSequenceFound = true;
						}

						if (isLongerSequenceFound) {
							idx = sequenceEndPos;
							currentWord = currentWordContinued;
						}
					}
					currentTrie = this.trie;

					if (longestSequenceFound) {
						dirtyMap.set(sequenceFound, currentWord.slice(0, -1));
						currentWord = '';
					} else {
						currentWord = '';
					}
				} else {
					currentTrie = this.trie;
					currentWord = '';
				}
			} else if (currentTrie.has(char)) {
				currentTrie = currentTrie.get(char) as Trie; // trust that the value to the key char is always a Trie;
			} else {
				currentTrie = this.trie;
				idy = idx + 1;

				while (idy < sentenceLength) {
					char = sentence[idy];
					currentWord += orgSentence[idy];

					if (!this.nonWordBoundaries.has(char)) break;

					++idy;
				}
				idx = idy;
				currentWord = '';
			}

			if (idx + 1 >= sentenceLength) {
				if (currentTrie.has(this._kw)) {
					sequenceFound = currentTrie.get(this._kw);
					if (idx === sentenceLength) {
						dirtyMap.set(sequenceFound, currentWord);
					} else {
						dirtyMap.set(sequenceFound, currentWord.slice(0, -1));
					}
				}
			}

			++idx;
		}
		return dirtyMap;
	}

	replaceKws(sentence: string) {
		const sentenceLength = sentence.length;
		const orgSentence = sentence;
		let newSentence = '';
		let currentWord = '';
		let currentTrie = this.trie;
		let currentWhiteSpace = '';
		let sequenceEndPos = 0;
		let idx = 0;

		while (idx < sentenceLength) {
			let char = sentence[idx];
			currentWord += orgSentence[idx];

			let sequenceFound, longestSequenceFound, isLongerSequenceFound, idy;

			if (!this.nonWordBoundaries.has(char)) {
				currentWhiteSpace = char;

				if (currentTrie.has(this._kw) || currentTrie.has(char)) {
					sequenceFound = '';
					longestSequenceFound = '';
					isLongerSequenceFound = false;

					if (currentTrie.has(this._kw)) {
						sequenceFound = currentTrie.get(this._kw);
						longestSequenceFound = currentTrie.get(this._kw);
						sequenceEndPos = idx;
					}

					if (currentTrie.has(char)) {
						let currentDictContinued = currentTrie.get(char);
						let currentWordContinued = currentWord;
						idy = idx + 1;

						while (idy < sentenceLength) {
							const innerChar = sentence[idy];
							currentWordContinued += orgSentence[idy];

							if (
								!this.nonWordBoundaries.has(innerChar) &&
								typeof currentDictContinued !== 'string' &&
								currentDictContinued?.has(this._kw)
							) {
								currentWhiteSpace = innerChar;
								longestSequenceFound = currentDictContinued.get(this._kw) as string; // trust that the value to the key this._kw is always a string
								sequenceEndPos = idy;
								isLongerSequenceFound = true;
							}

							if (
								typeof currentDictContinued !== 'string' &&
								currentDictContinued?.has(innerChar)
							) {
								currentDictContinued = currentDictContinued.get(innerChar) as Trie; // trust that the value to the key char is always a Trie
							} else {
								break;
							}

							++idy;
						}

						if (
							idy >= sentenceLength &&
							typeof currentDictContinued !== 'string' &&
							currentDictContinued?.has(this._kw)
						) {
							currentWhiteSpace = '';
							longestSequenceFound = currentDictContinued?.get(this._kw) as string; // trust that the value to the key this._kw is always a string
							sequenceEndPos = idy;
							isLongerSequenceFound = true;
						}

						if (isLongerSequenceFound) {
							idx = sequenceEndPos;
							currentWord = currentWordContinued;
						}
					}
					currentTrie = this.trie;

					if (longestSequenceFound) {
						newSentence += `${
							longestSequenceFound as string /* trust that the value to the key longestSequenceFound is always a string */
						}${currentWhiteSpace}`;
						currentWord = '';
						currentWhiteSpace = '';
					} else {
						newSentence += currentWord;
						currentWord = '';
						currentWhiteSpace = '';
					}
				} else {
					currentTrie = this.trie;
					newSentence += currentWord;
					currentWord = '';
					currentWhiteSpace = '';
				}
			} else if (currentTrie.has(char)) {
				currentTrie = currentTrie.get(char) as Trie; // trust that the value to the key char is always a Trie;
			} else {
				currentTrie = this.trie;
				idy = idx + 1;

				while (idy < sentenceLength) {
					char = sentence[idy];
					currentWord += orgSentence[idy];

					if (!this.nonWordBoundaries.has(char)) break;

					++idy;
				}
				idx = idy;
				newSentence += currentWord;
				currentWord = '';
				currentWhiteSpace = '';
			}

			if (idx + 1 >= sentenceLength) {
				if (currentTrie.has(this._kw)) {
					sequenceFound = currentTrie.get(this._kw);
					newSentence += sequenceFound;
				} else {
					newSentence += currentWord;
				}
			}

			++idx;
		}

		return newSentence;
	}

	wrapKwsWithHtml(sentence: string) {
		const sentenceLength = sentence.length;
		const orgSentence = sentence;
		let newSentence = '';
		let currentWord = '';
		let currentTrie = this.trie;
		let currentWhiteSpace = '';
		let sequenceEndPos = 0;
		let idx = 0;

		while (idx < sentenceLength) {
			let char = sentence[idx];
			currentWord += orgSentence[idx];

			let sequenceFound, longestSequenceFound, isLongerSequenceFound, idy;

			if (this.nonWordBoundaries.has(char) && idx + 1 === sentenceLength && currentTrie.has(char)) {
				const currentDictContinued = currentTrie.get(char);
				const currentWordContinued = currentWord;
				idy = idx + 1;

				if (typeof currentDictContinued !== 'string' && currentDictContinued?.has(this._kw)) {
					currentWhiteSpace = '';
					longestSequenceFound = currentDictContinued?.get(this._kw) as string; // trust that the value to the key this._kw is always a string
					sequenceEndPos = idy;
					isLongerSequenceFound = true;
				}

				if (isLongerSequenceFound) {
					idx = sequenceEndPos;
					currentWord = currentWordContinued;
				}
			}

			if (!this.nonWordBoundaries.has(char)) {
				currentWhiteSpace = char;

				if (currentTrie.has(this._kw) || currentTrie.has(char)) {
					sequenceFound = '';
					longestSequenceFound = '';
					isLongerSequenceFound = false;

					if (currentTrie.has(this._kw)) {
						sequenceFound = currentTrie.get(this._kw);
						longestSequenceFound = currentTrie.get(this._kw);
						sequenceEndPos = idx;
					}

					if (currentTrie.has(char)) {
						let currentDictContinued = currentTrie.get(char);
						let currentWordContinued = currentWord;
						idy = idx + 1;

						while (idy < sentenceLength) {
							const innerChar = sentence[idy];
							currentWordContinued += orgSentence[idy];

							if (
								!this.nonWordBoundaries.has(innerChar) &&
								typeof currentDictContinued !== 'string' &&
								currentDictContinued?.has(this._kw)
							) {
								currentWhiteSpace = innerChar;
								longestSequenceFound = currentDictContinued.get(this._kw) as string; // trust that the value to the key this._kw is always a string
								sequenceEndPos = idy;
								isLongerSequenceFound = true;
							}

							if (
								typeof currentDictContinued !== 'string' &&
								currentDictContinued?.has(innerChar)
							) {
								currentDictContinued = currentDictContinued.get(innerChar) as Trie; // trust that the value to the key char is always a Trie
							} else {
								break;
							}

							++idy;
						}

						if (
							idy >= sentenceLength &&
							typeof currentDictContinued !== 'string' &&
							currentDictContinued?.has(this._kw)
						) {
							currentWhiteSpace = '';
							longestSequenceFound = currentDictContinued?.get(this._kw) as string; // trust that the value to the key this._kw is always a string
							sequenceEndPos = idy;
							isLongerSequenceFound = true;
						}

						if (isLongerSequenceFound) {
							idx = sequenceEndPos;
							currentWord = currentWordContinued;
						}
					}

					currentTrie = this.trie;

					if (longestSequenceFound) {
						newSentence += `<${this.opts.tag} id="${
							longestSequenceFound as string /* trust that the value to the key longestSequenceFound is always a string */
						}">${currentWord.slice(0, -1)}</${this.opts.tag}>${currentWhiteSpace}`;
						currentWord = '';
						currentWhiteSpace = '';
					} else {
						newSentence += currentWord;
						currentWord = '';
						currentWhiteSpace = '';
					}
				} else {
					currentTrie = this.trie;
					newSentence += currentWord;
					currentWord = '';
					currentWhiteSpace = '';
				}
			} else if (currentTrie.has(char)) {
				currentTrie = currentTrie.get(char) as Trie; // trust that the value to the key char is always a Trie;
			} else {
				currentTrie = this.trie;
				idy = idx + 1;

				while (idy < sentenceLength) {
					char = sentence[idy];
					currentWord += orgSentence[idy];

					if (!this.nonWordBoundaries.has(char)) break;

					++idy;
				}
				idx = idy;
				newSentence += currentWord;
				currentWord = '';
				currentWhiteSpace = '';
			}

			if (idx + 1 >= sentenceLength) {
				if (currentTrie.has(this._kw)) {
					sequenceFound = currentTrie.get(this._kw);
					if (idx === sentenceLength) {
						newSentence += `<${this.opts.tag} id="${
							sequenceFound as string /* trust that the value to the key longestSequenceFound is always a string */
						}">${currentWord}</${this.opts.tag}>${currentWhiteSpace}`;
					} else {
						newSentence += `<${this.opts.tag} id="${
							sequenceFound as string /* trust that the value to the key longestSequenceFound is always a string */
						}">${currentWord.slice(0, -1)}</${this.opts.tag}>${currentWhiteSpace}`;
					}
				} else {
					newSentence += currentWord;
				}
			}

			++idx;
		}

		return newSentence;
	}
}
