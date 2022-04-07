// function replacer(key: any, value: any): any {
//     if(value instanceof Map) {
//         return Array.from(value.entries()) // or with spread: value: [...value]
//     } else {
//         return value;
//     }
// }

/*
	A JavaScript implementation of https://github.com/vi3k6i5/flashtext adapted for elaborating the found text.
*/
type Trie = Map<string | '_kw_', Trie | string>;
type KwList = Map<string, string[]>;
type Opts = { tag: string };

export class Match {
	private readonly _keyword: '_kw_';
	private nonWordBoundaries: Set<string>;
	private readonly keywordTrieDict: Trie;
	private readonly opts: Opts;

	constructor(insensitive: KwList, sensitive: KwList, opts: Opts) {
		this._keyword = '_kw_';

		this.nonWordBoundaries = ((): Set<string> => {
			const getChars = (start: number, end: number, ascii: boolean): string[] => {
				const temp = [];
				for (let i = start; i <= end; i++) {
					temp.push(ascii ? String.fromCharCode(i) : i.toString());
				}
				return temp;
			};
			return new Set([
				...getChars(0, 9, false),
				...getChars(65, 90, true),
				...getChars(97, 122, true),
				'_'
			]);
		})();

		this.keywordTrieDict = new Map();
		this.addKws(insensitive, false);
		this.addKws(sensitive, true);
		this.opts = opts;
	}

	/**
	 * @param id is the associated id
	 * @param keyword is the target text to match against
	 * @param caseSensitive is whether to NOT map both uppercase and lowercase chars
	 */
	addKw(id: string, keyword: string, caseSensitive: boolean) {
		let currentDictRef = this.keywordTrieDict;

		keyword.split('').forEach((char) => {
			if (caseSensitive) {
				if (!currentDictRef.get(char)) currentDictRef.set(char, new Map());
				currentDictRef = currentDictRef.get(char) as Trie; // trust that the value to the key char is always a Trie
			} else {
				const lowercaseChar = char.toLowerCase();
				const uppercaseChar = char.toUpperCase();
				let lowercaseDictRef = currentDictRef.get(lowercaseChar);
				if (!lowercaseDictRef) currentDictRef.set(lowercaseChar, new Map());
				lowercaseDictRef = currentDictRef.get(lowercaseChar) as Trie; // trust that the value to the key char is always a Trie
				if (!currentDictRef.get(uppercaseChar)) currentDictRef.set(uppercaseChar, lowercaseDictRef);
				currentDictRef = lowercaseDictRef;
			}
		});
		currentDictRef.set(this._keyword, id);
	}

	addKws(kwList: KwList, caseSensitive: boolean) {
		kwList.forEach((kws, id) => {
			kws.forEach((kw) => this.addKw(id, kw, caseSensitive));
		});
		// console.log(JSON.stringify(kwList, replacer, 1))
	}

	extractMatchIds(sentence: string) {
		const keywordsExtracted: string[] = [];
		const sentenceLength = sentence.length;

		if (sentenceLength === 0) return keywordsExtracted;

		let currentDictRef = this.keywordTrieDict;
		let sequenceEndPos = 0;
		let idx = 0;

		while (idx < sentenceLength) {
			let char = sentence[idx];

			let sequenceFound, longestSequenceFound, isLongerSequenceFound, idy;

			if (!this.nonWordBoundaries.has(char)) {
				if (currentDictRef.has(this._keyword) || currentDictRef.has(char)) {
					sequenceFound = '';
					longestSequenceFound = '';
					isLongerSequenceFound = false;

					if (currentDictRef.has(this._keyword)) {
						sequenceFound = currentDictRef.get(this._keyword) as string; // trust that the value to the key this._keyword is always a string
						longestSequenceFound = currentDictRef.get(this._keyword) as string; // trust that the value to the key this._keyword is always a string
						sequenceEndPos = idx;
					}

					if (currentDictRef.has(char)) {
						let currentDictContinued = currentDictRef.get(char);
						idy = idx + 1;

						while (idy < sentenceLength) {
							const innerChar = sentence[idy];

							if (
								!this.nonWordBoundaries.has(innerChar) &&
								typeof currentDictContinued !== 'string' &&
								currentDictContinued?.has(this._keyword)
							) {
								longestSequenceFound = currentDictContinued.get(this._keyword) as string; // trust that the value to the key this._keyword is always a string
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
							currentDictContinued?.has(this._keyword)
						) {
							longestSequenceFound = currentDictContinued.get(this._keyword) as string; // trust that the value to the key this._keyword is always a string
							sequenceEndPos = idy;
							isLongerSequenceFound = true;
						}

						if (isLongerSequenceFound) {
							idx = sequenceEndPos;
						}
					}

					currentDictRef = this.keywordTrieDict;
					if (longestSequenceFound) {
						keywordsExtracted.push(longestSequenceFound);
					}
				} else {
					currentDictRef = this.keywordTrieDict;
				}
			} else if (currentDictRef.has(char)) {
				currentDictRef = currentDictRef.get(char) as Trie; // trust that the value to the key char is always a Trie
			} else {
				currentDictRef = this.keywordTrieDict;
				idy = idx + 1;

				while (idy < sentenceLength) {
					char = sentence[idy];
					if (!this.nonWordBoundaries.has(char)) break;
					++idy;
				}

				idx = idy;
			}

			if (idx + 1 >= sentenceLength) {
				if (currentDictRef.has(this._keyword)) {
					sequenceFound = currentDictRef.get(this._keyword) as string; // trust that the value to the key this._keyword is always a string
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
		let currentDictRef = this.keywordTrieDict;
		let sequenceEndPos = 0;
		let idx = 0;

		while (idx < sentenceLength) {
			let char = sentence[idx];
			currentWord += orgSentence[idx];

			let sequenceFound, longestSequenceFound, isLongerSequenceFound, idy;

			if (
				this.nonWordBoundaries.has(char) &&
				idx + 1 === sentenceLength &&
				currentDictRef.has(char)
			) {
				const currentDictContinued = currentDictRef.get(char);
				const currentWordContinued = currentWord;
				idy = idx + 1;

				if (typeof currentDictContinued !== 'string' && currentDictContinued?.has(this._keyword)) {
					longestSequenceFound = currentDictContinued?.get(this._keyword) as string; // trust that the value to the key this._keyword is always a string
					sequenceEndPos = idy;
					isLongerSequenceFound = true;
				}

				if (isLongerSequenceFound) {
					idx = sequenceEndPos;
					currentWord = currentWordContinued;
				}
			}

			if (!this.nonWordBoundaries.has(char)) {
				if (currentDictRef.has(this._keyword) || currentDictRef.has(char)) {
					sequenceFound = '';
					longestSequenceFound = '';
					isLongerSequenceFound = false;

					if (currentDictRef.has(this._keyword)) {
						sequenceFound = currentDictRef.get(this._keyword);
						longestSequenceFound = currentDictRef.get(this._keyword);
						sequenceEndPos = idx;
					}

					if (currentDictRef.has(char)) {
						let currentDictContinued = currentDictRef.get(char);
						let currentWordContinued = currentWord;
						idy = idx + 1;

						while (idy < sentenceLength) {
							const innerChar = sentence[idy];
							currentWordContinued += orgSentence[idy];

							if (
								!this.nonWordBoundaries.has(innerChar) &&
								typeof currentDictContinued !== 'string' &&
								currentDictContinued?.has(this._keyword)
							) {
								longestSequenceFound = currentDictContinued.get(this._keyword) as string; // trust that the value to the key this._keyword is always a string
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
							currentDictContinued?.has(this._keyword)
						) {
							longestSequenceFound = currentDictContinued?.get(this._keyword) as string; // trust that the value to the key this._keyword is always a string
							sequenceEndPos = idy;
							isLongerSequenceFound = true;
						}

						if (isLongerSequenceFound) {
							idx = sequenceEndPos;
							currentWord = currentWordContinued;
						}
					}
					currentDictRef = this.keywordTrieDict;

					if (longestSequenceFound) {
						dirtyMap.set(sequenceFound, currentWord.slice(0, -1));
						currentWord = '';
					} else {
						currentWord = '';
					}
				} else {
					currentDictRef = this.keywordTrieDict;
					currentWord = '';
				}
			} else if (currentDictRef.has(char)) {
				currentDictRef = currentDictRef.get(char) as Trie; // trust that the value to the key char is always a Trie;
			} else {
				currentDictRef = this.keywordTrieDict;
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
				if (currentDictRef.has(this._keyword)) {
					sequenceFound = currentDictRef.get(this._keyword);
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
		let currentDictRef = this.keywordTrieDict;
		let currentWhiteSpace = '';
		let sequenceEndPos = 0;
		let idx = 0;

		while (idx < sentenceLength) {
			let char = sentence[idx];
			currentWord += orgSentence[idx];

			let sequenceFound, longestSequenceFound, isLongerSequenceFound, idy;

			if (!this.nonWordBoundaries.has(char)) {
				currentWhiteSpace = char;

				if (currentDictRef.has(this._keyword) || currentDictRef.has(char)) {
					sequenceFound = '';
					longestSequenceFound = '';
					isLongerSequenceFound = false;

					if (currentDictRef.has(this._keyword)) {
						sequenceFound = currentDictRef.get(this._keyword);
						longestSequenceFound = currentDictRef.get(this._keyword);
						sequenceEndPos = idx;
					}

					if (currentDictRef.has(char)) {
						let currentDictContinued = currentDictRef.get(char);
						let currentWordContinued = currentWord;
						idy = idx + 1;

						while (idy < sentenceLength) {
							const innerChar = sentence[idy];
							currentWordContinued += orgSentence[idy];

							if (
								!this.nonWordBoundaries.has(innerChar) &&
								typeof currentDictContinued !== 'string' &&
								currentDictContinued?.has(this._keyword)
							) {
								currentWhiteSpace = innerChar;
								longestSequenceFound = currentDictContinued.get(this._keyword) as string; // trust that the value to the key this._keyword is always a string
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
							currentDictContinued?.has(this._keyword)
						) {
							currentWhiteSpace = '';
							longestSequenceFound = currentDictContinued?.get(this._keyword) as string; // trust that the value to the key this._keyword is always a string
							sequenceEndPos = idy;
							isLongerSequenceFound = true;
						}

						if (isLongerSequenceFound) {
							idx = sequenceEndPos;
							currentWord = currentWordContinued;
						}
					}
					currentDictRef = this.keywordTrieDict;

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
					currentDictRef = this.keywordTrieDict;
					newSentence += currentWord;
					currentWord = '';
					currentWhiteSpace = '';
				}
			} else if (currentDictRef.has(char)) {
				currentDictRef = currentDictRef.get(char) as Trie; // trust that the value to the key char is always a Trie;
			} else {
				currentDictRef = this.keywordTrieDict;
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
				if (currentDictRef.has(this._keyword)) {
					sequenceFound = currentDictRef.get(this._keyword);
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
		let currentDictRef = this.keywordTrieDict;
		let currentWhiteSpace = '';
		let sequenceEndPos = 0;
		let idx = 0;

		while (idx < sentenceLength) {
			let char = sentence[idx];
			currentWord += orgSentence[idx];

			let sequenceFound, longestSequenceFound, isLongerSequenceFound, idy;

			if (
				this.nonWordBoundaries.has(char) &&
				idx + 1 === sentenceLength &&
				currentDictRef.has(char)
			) {
				const currentDictContinued = currentDictRef.get(char);
				const currentWordContinued = currentWord;
				idy = idx + 1;

				if (typeof currentDictContinued !== 'string' && currentDictContinued?.has(this._keyword)) {
					currentWhiteSpace = '';
					longestSequenceFound = currentDictContinued?.get(this._keyword) as string; // trust that the value to the key this._keyword is always a string
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

				if (currentDictRef.has(this._keyword) || currentDictRef.has(char)) {
					sequenceFound = '';
					longestSequenceFound = '';
					isLongerSequenceFound = false;

					if (currentDictRef.has(this._keyword)) {
						sequenceFound = currentDictRef.get(this._keyword);
						longestSequenceFound = currentDictRef.get(this._keyword);
						sequenceEndPos = idx;
					}

					if (currentDictRef.has(char)) {
						let currentDictContinued = currentDictRef.get(char);
						let currentWordContinued = currentWord;
						idy = idx + 1;

						while (idy < sentenceLength) {
							const innerChar = sentence[idy];
							currentWordContinued += orgSentence[idy];

							if (
								!this.nonWordBoundaries.has(innerChar) &&
								typeof currentDictContinued !== 'string' &&
								currentDictContinued?.has(this._keyword)
							) {
								currentWhiteSpace = innerChar;
								longestSequenceFound = currentDictContinued.get(this._keyword) as string; // trust that the value to the key this._keyword is always a string
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
							currentDictContinued?.has(this._keyword)
						) {
							currentWhiteSpace = '';
							longestSequenceFound = currentDictContinued?.get(this._keyword) as string; // trust that the value to the key this._keyword is always a string
							sequenceEndPos = idy;
							isLongerSequenceFound = true;
						}

						if (isLongerSequenceFound) {
							idx = sequenceEndPos;
							currentWord = currentWordContinued;
						}
					}

					currentDictRef = this.keywordTrieDict;

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
					currentDictRef = this.keywordTrieDict;
					newSentence += currentWord;
					currentWord = '';
					currentWhiteSpace = '';
				}
			} else if (currentDictRef.has(char)) {
				currentDictRef = currentDictRef.get(char) as Trie; // trust that the value to the key char is always a Trie;
			} else {
				currentDictRef = this.keywordTrieDict;
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
				if (currentDictRef.has(this._keyword)) {
					sequenceFound = currentDictRef.get(this._keyword);
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
