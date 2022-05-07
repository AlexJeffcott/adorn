import { expect } from 'chai';
import inspector from 'inspector';
import fs from 'fs';
import { Match } from '../../';
import { getMapAsString } from '../../match/utils';

describe('match should', () => {
	describe('create trie', () => {
		it.skip('with nice heap', () => {
			const session = new inspector.Session();
			const fd = fs.openSync('profile.heapsnapshot', 'w');

			session.connect();

			session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
				fs.writeSync(fd, m.params.chunk);
			});

			session.post('HeapProfiler.takeHeapSnapshot', undefined, (err) => {
				session.disconnect();
				fs.closeSync(fd);
			});
		});

		it('with correct stringified repressentation', () => {
			const ipsumCaseInsensitive = new Map([['ci', ['abc', 'def', 'ghi jkl', 'mnop-qr2']]]);
			const ipsumCaseSensitive = new Map([['cs', ['ZXY', 'VUT']]]);
			const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, {
				tag: 'x-a',
				getAttrs: (id: string) => `data-match-id="${id}"`
			});
			const { trieAsString } = match.getDetails();
			expect(trieAsString).to.equal(
				'CI ===> [["a",[["b",[["c",[["_kw_","ci"]]],["C",[["_kw_","ci"]]]]],["B",[["c",[["_kw_","ci"]]],["C",[["_kw_","ci"]]]]]]],["A",[["b",[["c",[["_kw_","ci"]]],["C",[["_kw_","ci"]]]]],["B",[["c",[["_kw_","ci"]]],["C",[["_kw_","ci"]]]]]]],["d",[["e",[["f",[["_kw_","ci"]]],["F",[["_kw_","ci"]]]]],["E",[["f",[["_kw_","ci"]]],["F",[["_kw_","ci"]]]]]]],["D",[["e",[["f",[["_kw_","ci"]]],["F",[["_kw_","ci"]]]]],["E",[["f",[["_kw_","ci"]]],["F",[["_kw_","ci"]]]]]]],["g",[["h",[["i",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]],["I",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]]]],["H",[["i",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]],["I",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]]]]]],["G",[["h",[["i",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]],["I",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]]]],["H",[["i",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]],["I",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]]]]]],["m",[["n",[["o",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]],["O",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]]]],["N",[["o",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]],["O",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]]]]]],["M",[["n",[["o",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]],["O",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]]]],["N",[["o",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]],["O",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]]]]]]] || CS ===> [["Z",[["X",[["Y",[["_kw_","cs"]]]]]]],["V",[["U",[["T",[["_kw_","cs"]]]]]]]]'
			);
		});

		it('with error when has duplicate CI kws', () => {
			const ipsumCaseInsensitive = new Map([['ci', ['abc', 'abc']]]);
			const iThrowError = () =>
				new Match(ipsumCaseInsensitive, null, {
					tag: 'x-a',
					getAttrs: (id: string) => `data-match-id="${id}"`
				});
			expect(iThrowError).to.throw(Error, 'lower-cased case-insensitive map contains duplicates');
		});

		it('with error when has duplicate CS kws', () => {
			const ipsumCaseSensitive = new Map([['cs', ['abc', 'abc']]]);
			const iThrowError = () =>
				new Match(null, ipsumCaseSensitive, {
					tag: 'x-a',
					getAttrs: (id: string) => `data-match-id="${id}"`
				});
			expect(iThrowError).to.throw(Error, 'case-sensitive map contains duplicates');
		});

		it('without error when has duplicate lowercase CS kws', () => {
			const ipsumCaseSensitive = new Map([['cs', ['abc', 'aBc']]]);
			const iThrowError = () =>
				new Match(null, ipsumCaseSensitive, {
					tag: 'x-a',
					getAttrs: (id: string) => `data-match-id="${id}"`
				});
			expect(iThrowError).not.to.throw(Error);
		});

		it('with error when has clash between CI and CS kws', () => {
			const ipsumCaseInsensitive = new Map([['ci', ['ABC']]]);
			const ipsumCaseSensitive = new Map([['cs', ['abc', 'aBc']]]);
			const iThrowError = () =>
				new Match(ipsumCaseInsensitive, ipsumCaseSensitive, {
					tag: 'x-a',
					getAttrs: (id: string) => `data-match-id="${id}"`
				});
			expect(iThrowError).to.throw(
				Error,
				'merged lower-cased case-insensitive list and deduped lower-cased case-sensitive map contains duplicates'
			);
		});
	});

	describe('getMatchIndexes correctly', () => {
		it('when string terminates on match', () => {
			const text =
				'abc Here is a text for testing abc purposes ABC with some matches def here and DEF there VUT.mnop-qr2';
			const ipsumCaseInsensitive = new Map([['ci', ['abc', 'def', 'ghi jkl', 'mnop-qr2']]]);
			const ipsumCaseSensitive = new Map([['cs', ['ZXY', 'VUT']]]);
			const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, {
				tag: 'x-a',
				getAttrs: (id: string) => `data-match-id="${id}"`
			});

			const res = match.getMatchIndexes(text);
			expect(JSON.stringify(res)).to.equal(
				JSON.stringify([
					['ci', 0, 2],
					['ci', 31, 33],
					['ci', 44, 46],
					['ci', 66, 68],
					['ci', 79, 81],
					['cs', 89, 91],
					['ci', 93, 100]
				])
			);
		});
		it('when string does not terminates on match', () => {
			const text =
				'abc Here is a text for testing abc purposes ABC with some matches def here and DEF there VUT.mnop-qr2 ';
			const ipsumCaseInsensitive = new Map([['ci', ['abc', 'def', 'ghi jkl', 'mnop-qr2']]]);
			const ipsumCaseSensitive = new Map([['cs', ['ZXY', 'VUT']]]);
			const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, {
				tag: 'x-a',
				getAttrs: (id: string) => `data-match-id="${id}"`
			});

			const res = match.getMatchIndexes(text);
			expect(JSON.stringify(res)).to.equal(
				JSON.stringify([
					['ci', 0, 2],
					['ci', 31, 33],
					['ci', 44, 46],
					['ci', 66, 68],
					['ci', 79, 81],
					['cs', 89, 91],
					['ci', 93, 100]
				])
			);
		});
		it('when string does not terminates on semi match', () => {
			const text =
				'abc Here is a text for testing abc purposes ABC with some matches def here and DEF there VUT. qabc';
			const ipsumCaseInsensitive = new Map([['ci', ['abc']]]);
			const ipsumCaseSensitive = null;
			const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, {
				tag: 'x-a',
				getAttrs: (id: string) => `data-match-id="${id}"`
			});

			const res = match.getMatchIndexes(text);
			expect(JSON.stringify(res)).to.equal(
				JSON.stringify([
					['ci', 0, 2],
					['ci', 31, 33],
					['ci', 44, 46]
				])
			);
		});
		it('with confounders', () => {
			const text = 'abcd abc abcd';
			const ipsumCaseInsensitive = new Map([
				['short', ['abc']],
				['long', ['abcd']]
			]);
			const match = new Match(ipsumCaseInsensitive, null, {
				tag: 'x-a',
				getAttrs: (id: string) => `data-match-id="${id}"`
			});

			const res = match.getMatchIndexes(text);
			expect(JSON.stringify(res)).to.equal(
				JSON.stringify([
					['long', 0, 3],
					['short', 5, 7],
					['long', 9, 12]
				])
			);
		});
	});

	describe('wrapKwsWithHtml', () => {
		it('wrapKwsWithHtml correctly', () => {
			const cs: Array<[string, string[]]> = [
				['cs-0', ['Auyo']],
				['cs-1', ['xMwad']]
			];
			const ci: Array<[string, string[]]> = [
				['ci-0', ['VakgUb ']],
				['ci-1', ['0tsNyfd2']]
			];
			const match = new Match(new Map(ci), new Map(cs), {
				tag: 'x-a',
				getAttrs: (id: string) => `data-match-id="${id}"`
			});
			const strOfRnd =
				'QPT13rJz Auyo RIoVPLq9eSVO xMwad 3-qoli YJrJVuyDR 0tsNyfd2 xmwad JsFcwSeS8DZ pklv PckJ vakgub  qAuyo';
			const replacedHtml =
				'QPT13rJz <x-a data-match-id="cs-0">Auyo</x-a> RIoVPLq9eSVO <x-a data-match-id="cs-1">xMwad</x-a> 3-qoli YJrJVuyDR <x-a data-match-id="ci-1">0tsNyfd2</x-a> xmwad JsFcwSeS8DZ pklv PckJ <x-a data-match-id="ci-0">vakgub </x-a> qAuyo';

			const res = match.wrapKwsWithHtml(strOfRnd);
			expect(res).to.equal(replacedHtml);
		});

		it('wrapKwsWithHtml correctly again', () => {
			const cs: Array<[string, string[]]> = [['cs-0', ['Auyo']]];
			const ci = null;
			const match = new Match(new Map(ci), new Map(cs), {
				tag: 'x-a',
				getAttrs: (id: string) => `data-match-id="${id}"`
			});
			const strOfRnd =
				'QPT13rJz Auyo RIoVPLq9eSVO xMwad 3-qoli YJrJVuyDR 0tsNyfd2 xmwad JsFcwSeS8DZ pklv PckJ vakgub Auyoq';
			const replacedHtml =
				'QPT13rJz <x-a data-match-id="cs-0">Auyo</x-a> RIoVPLq9eSVO xMwad 3-qoli YJrJVuyDR 0tsNyfd2 xmwad JsFcwSeS8DZ pklv PckJ vakgub Auyoq';

			const res = match.wrapKwsWithHtml(strOfRnd);
			expect(res).to.equal(replacedHtml);
		});
	});

	describe('with randomised content', () => {
		const cs: Array<[string, string[]]> = [
			['cs-0', ['Auyo']],
			['cs-1', ['xMwad']],
			['cs-2', ['1OcS CX']],
			['cs-3', ['UMteA']],
			['cs-4', ['SbcO1OWSb']],
			['cs-5', ['zCCqT']],
			['cs-6', ['1 4FPz']],
			['cs-7', ['pja3T']],
			['cs-8', ['kbaW']],
			['cs-9', ['9kA79X']]
		];
		const ci: Array<[string, string[]]> = [
			['ci-0', ['VakgUb ']],
			['ci-1', ['0tsNyfd2']],
			['ci-2', ['mnrs']],
			['ci-3', ['uTC1FVt']],
			['ci-4', ['POmQa6JxTO3Lc2']],
			['ci-5', ['K gX-X']],
			['ci-6', ['OVxZC']],
			['ci-7', ['krmbCRZML']],
			['ci-8', ['QhoD3lvS']],
			['ci-9', ['S7zCaau-ud ueT']]
		];
		const match = new Match(new Map(ci), new Map(cs), {
			tag: 'x-a',
			getAttrs: (id: string) => `data-match-id="${id}"`
		});
		const matches = [
			['ci-0', 67, 73],
			['ci-8', 92, 99],
			['ci-5', 208, 213],
			['ci-3', 215, 221],
			['cs-9', 312, 317],
			['ci-4', 359, 372],
			['cs-3', 491, 495],
			['ci-2', 497, 500],
			['ci-7', 531, 539],
			['ci-1', 541, 548],
			['ci-1', 563, 570],
			['ci-6', 628, 632],
			['cs-0', 663, 666],
			['ci-9', 695, 708],
			['cs-8', 739, 742],
			['cs-1', 760, 764],
			['cs-5', 805, 809],
			['ci-8', 907, 914],
			['ci-6', 979, 983],
			['cs-2', 1060, 1066],
			['ci-0', 1068, 1074],
			['cs-7', 1145, 1149],
			['ci-4', 1166, 1179],
			['ci-3', 1181, 1187],
			['ci-2', 1189, 1192],
			['ci-5', 1247, 1252],
			['cs-4', 1262, 1270],
			['ci-9', 1286, 1299],
			['cs-6', 1314, 1319],
			['ci-7', 1358, 1366]
		];
		const ids = [
			'ci-0',
			'ci-8',
			'ci-5',
			'ci-3',
			'cs-9',
			'ci-4',
			'cs-3',
			'ci-2',
			'ci-7',
			'ci-1',
			'ci-6',
			'cs-0',
			'ci-9',
			'cs-8',
			'cs-1',
			'cs-5',
			'cs-2',
			'cs-7',
			'cs-4',
			'cs-6'
		];
		const dirtyMatchesMap = new Map([
			['ci-0', 'VakgUb '],
			['ci-8', 'qhod3lvs'],
			['ci-5', 'k gx-x'],
			['ci-3', 'utc1fvt'],
			['cs-9', '9kA79X'],
			['ci-4', 'POmQa6JxTO3Lc2'],
			['cs-3', 'UMteA'],
			['ci-2', 'mnrs'],
			['ci-7', 'krmbcrzml'],
			['ci-1', '0tsNyfd2'],
			['ci-6', 'OVxZC'],
			['cs-0', 'Auyo'],
			['ci-9', 'S7zCaau-ud ueT'],
			['cs-8', 'kbaW'],
			['cs-1', 'xMwad'],
			['cs-5', 'zCCqT'],
			['cs-2', '1OcS CX'],
			['cs-7', 'pja3T'],
			['cs-4', 'SbcO1OWSb'],
			['cs-6', '1 4FPz']
		]);
		const strOfRnd =
			'QPT13rJz RIoVPLq9eSVO 3-qoli YJrJVuyDR xmwad JsFcwSeS8DZ pklv PckJ vakgub  a2VO2tEYt t5 eN  QhoD3lvS M T0-p pja3t rn6tzs HgicR O0zqQUIyCFhmN 5kWnTlb 2Cr5E5o6 pDnM0Xyb9 Wd jWjvs2pu IspPxunGL flTb 4koos ieTw5o K gX-X uTC1FVt cTAUQ EiNJvhc ZY3oklhmLPUF 8VRapahgas88K j7qNMiJrmv6IS 15e3T9gYrUDXvA lIcXE IOfV7YI7BEAL 9kA79X o1F9 MH0mruj2t Jqefz O cqk8 UJy5IQTlkQm pomqa6jxto3lc2 GpkYBAs4NuQjJ oo0dFjTp7 9OZVxJZx SxVZL 35wz6AmQfMzb 5dxfjqBcWVwvP ukJ9faA7cwOOe MqlXpyEvx t03kNl hhA3Ff-T OaF UzmsIp UMteA mnrs TrbKEiEaVZ m-Jch75 rb6G auyo krmbCRZML 0tsnyfd2 i 5eKuM0Y8RX 0tsNyfd2 WVdT77Rqg8VvRq aBCW- pgdKw OeJcBAh0kINWO CJJGPBtrtPVg-g ovxzc EivCBcBI5SK9u ZLG8x6uj1H3agJ Auyo  p7bZmw7NQr LoIbGhvegSNr3M s7zcaau-ud uet nV3IHWK OES6P O9qI84hh 5uapQ kbaW Z9twJ7ohC umtea xMwad 0sCeFqZWyH1 EUO8AejlPA3TNH 8y9VHTMyjwf zCCqT sbco1owsb sPJlkRunRJ f8E7FfgSN6H 8yCBmPnDITt FonpivxmC r2JnUTwf0iui T3uMK PSjNOLoBA dYZV6sWkGz9 qhod3lvs Um VxAJiIqQX sfaDX zccqt DmzJF HosEmMrE 1mCxxSDRXVvqxm 1ocs cx OVxZC TXQ00BZCZ JvPFEbcr3R HAX7-fIFL1C xjLF5pZ8 pAOHbKkj4SM80 kbaw  QAuDgYFaOvZm 1OcS CX VakgUb  yzVfcOHuJmmi1 1 4fpz eKCzRrK0uV4 jkiK meFOT cI 9ka79x cuIkCGYKvjtK0T pja3T jXLggbzRVrfD97 POmQa6JxTO3Lc2 utc1fvt mnrs 34bvD iiyQ-Xs0FcI 21rVhQnO9CbZ aG8SQTe oLVnIkK8RPfZ9 k gx-x nngb1Cn SbcO1OWSb cO aA 0kjtIcK S7zCaau-ud ueT C3oU-UvE0YJ0 1 4FPz sbiIO4WN DDpPapx fcBn hzUsY bpgmwPkm krmbcrzml Auyoq';
		const replacedKws =
			'QPT13rJz RIoVPLq9eSVO 3-qoli YJrJVuyDR xmwad JsFcwSeS8DZ pklv PckJ ci-0 a2VO2tEYt t5 eN  ci-8 M T0-p pja3t rn6tzs HgicR O0zqQUIyCFhmN 5kWnTlb 2Cr5E5o6 pDnM0Xyb9 Wd jWjvs2pu IspPxunGL flTb 4koos ieTw5o ci-5 ci-3 cTAUQ EiNJvhc ZY3oklhmLPUF 8VRapahgas88K j7qNMiJrmv6IS 15e3T9gYrUDXvA lIcXE IOfV7YI7BEAL cs-9 o1F9 MH0mruj2t Jqefz O cqk8 UJy5IQTlkQm ci-4 GpkYBAs4NuQjJ oo0dFjTp7 9OZVxJZx SxVZL 35wz6AmQfMzb 5dxfjqBcWVwvP ukJ9faA7cwOOe MqlXpyEvx t03kNl hhA3Ff-T OaF UzmsIp cs-3 ci-2 TrbKEiEaVZ m-Jch75 rb6G auyo ci-7 ci-1 i 5eKuM0Y8RX ci-1 WVdT77Rqg8VvRq aBCW- pgdKw OeJcBAh0kINWO CJJGPBtrtPVg-g ci-6 EivCBcBI5SK9u ZLG8x6uj1H3agJ cs-0  p7bZmw7NQr LoIbGhvegSNr3M ci-9 nV3IHWK OES6P O9qI84hh 5uapQ cs-8 Z9twJ7ohC umtea cs-1 0sCeFqZWyH1 EUO8AejlPA3TNH 8y9VHTMyjwf cs-5 sbco1owsb sPJlkRunRJ f8E7FfgSN6H 8yCBmPnDITt FonpivxmC r2JnUTwf0iui T3uMK PSjNOLoBA dYZV6sWkGz9 ci-8 Um VxAJiIqQX sfaDX zccqt DmzJF HosEmMrE 1mCxxSDRXVvqxm 1ocs cx ci-6 TXQ00BZCZ JvPFEbcr3R HAX7-fIFL1C xjLF5pZ8 pAOHbKkj4SM80 kbaw  QAuDgYFaOvZm cs-2 ci-0 yzVfcOHuJmmi1 1 4fpz eKCzRrK0uV4 jkiK meFOT cI 9ka79x cuIkCGYKvjtK0T cs-7 jXLggbzRVrfD97 ci-4 ci-3 ci-2 34bvD iiyQ-Xs0FcI 21rVhQnO9CbZ aG8SQTe oLVnIkK8RPfZ9 ci-5 nngb1Cn cs-4 cO aA 0kjtIcK ci-9 C3oU-UvE0YJ0 cs-6 sbiIO4WN DDpPapx fcBn hzUsY bpgmwPkm ci-7 Auyoq';
		const replacedHtml =
			'QPT13rJz RIoVPLq9eSVO 3-qoli YJrJVuyDR xmwad JsFcwSeS8DZ pklv PckJ <x-a data-match-id="ci-0">vakgub </x-a> a2VO2tEYt t5 eN  <x-a data-match-id="ci-8">QhoD3lvS</x-a> M T0-p pja3t rn6tzs HgicR O0zqQUIyCFhmN 5kWnTlb 2Cr5E5o6 pDnM0Xyb9 Wd jWjvs2pu IspPxunGL flTb 4koos ieTw5o <x-a data-match-id="ci-5">K gX-X</x-a> <x-a data-match-id="ci-3">uTC1FVt</x-a> cTAUQ EiNJvhc ZY3oklhmLPUF 8VRapahgas88K j7qNMiJrmv6IS 15e3T9gYrUDXvA lIcXE IOfV7YI7BEAL <x-a data-match-id="cs-9">9kA79X</x-a> o1F9 MH0mruj2t Jqefz O cqk8 UJy5IQTlkQm <x-a data-match-id="ci-4">pomqa6jxto3lc2</x-a> GpkYBAs4NuQjJ oo0dFjTp7 9OZVxJZx SxVZL 35wz6AmQfMzb 5dxfjqBcWVwvP ukJ9faA7cwOOe MqlXpyEvx t03kNl hhA3Ff-T OaF UzmsIp <x-a data-match-id="cs-3">UMteA</x-a> <x-a data-match-id="ci-2">mnrs</x-a> TrbKEiEaVZ m-Jch75 rb6G auyo <x-a data-match-id="ci-7">krmbCRZML</x-a> <x-a data-match-id="ci-1">0tsnyfd2</x-a> i 5eKuM0Y8RX <x-a data-match-id="ci-1">0tsNyfd2</x-a> WVdT77Rqg8VvRq aBCW- pgdKw OeJcBAh0kINWO CJJGPBtrtPVg-g <x-a data-match-id="ci-6">ovxzc</x-a> EivCBcBI5SK9u ZLG8x6uj1H3agJ <x-a data-match-id="cs-0">Auyo</x-a>  p7bZmw7NQr LoIbGhvegSNr3M <x-a data-match-id="ci-9">s7zcaau-ud uet</x-a> nV3IHWK OES6P O9qI84hh 5uapQ <x-a data-match-id="cs-8">kbaW</x-a> Z9twJ7ohC umtea <x-a data-match-id="cs-1">xMwad</x-a> 0sCeFqZWyH1 EUO8AejlPA3TNH 8y9VHTMyjwf <x-a data-match-id="cs-5">zCCqT</x-a> sbco1owsb sPJlkRunRJ f8E7FfgSN6H 8yCBmPnDITt FonpivxmC r2JnUTwf0iui T3uMK PSjNOLoBA dYZV6sWkGz9 <x-a data-match-id="ci-8">qhod3lvs</x-a> Um VxAJiIqQX sfaDX zccqt DmzJF HosEmMrE 1mCxxSDRXVvqxm 1ocs cx <x-a data-match-id="ci-6">OVxZC</x-a> TXQ00BZCZ JvPFEbcr3R HAX7-fIFL1C xjLF5pZ8 pAOHbKkj4SM80 kbaw  QAuDgYFaOvZm <x-a data-match-id="cs-2">1OcS CX</x-a> <x-a data-match-id="ci-0">VakgUb </x-a> yzVfcOHuJmmi1 1 4fpz eKCzRrK0uV4 jkiK meFOT cI 9ka79x cuIkCGYKvjtK0T <x-a data-match-id="cs-7">pja3T</x-a> jXLggbzRVrfD97 <x-a data-match-id="ci-4">POmQa6JxTO3Lc2</x-a> <x-a data-match-id="ci-3">utc1fvt</x-a> <x-a data-match-id="ci-2">mnrs</x-a> 34bvD iiyQ-Xs0FcI 21rVhQnO9CbZ aG8SQTe oLVnIkK8RPfZ9 <x-a data-match-id="ci-5">k gx-x</x-a> nngb1Cn <x-a data-match-id="cs-4">SbcO1OWSb</x-a> cO aA 0kjtIcK <x-a data-match-id="ci-9">S7zCaau-ud ueT</x-a> C3oU-UvE0YJ0 <x-a data-match-id="cs-6">1 4FPz</x-a> sbiIO4WN DDpPapx fcBn hzUsY bpgmwPkm <x-a data-match-id="ci-7">krmbcrzml</x-a> Auyoq';

		it('getMatchIndexes correctly', () => {
			const res = match.getMatchIndexes(strOfRnd);
			expect(JSON.stringify(res)).to.equal(JSON.stringify(matches));
		});

		it('extractMatchIds correctly', () => {
			const res = match.extractMatchIds(strOfRnd);
			expect(JSON.stringify(res)).to.equal(JSON.stringify(ids));
		});

		it('extractDirtyMatches correctly', () => {
			const res = match.extractDirtyMatches(strOfRnd);
			expect(getMapAsString(res)).to.equal(getMapAsString(dirtyMatchesMap));
		});

		it('replaceKws correctly', () => {
			const res = match.replaceKws(strOfRnd);
			expect(res).to.equal(replacedKws);
		});

		it('wrapKwsWithHtml correctly', () => {
			const res = match.wrapKwsWithHtml(strOfRnd);
			expect(res).to.equal(replacedHtml);
		});
	});
});
