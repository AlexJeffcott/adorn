import { expect } from 'chai';
import inspector from 'inspector';
import fs from 'fs';
import { Match } from '../../';

describe('match should', () => {
	it.skip('check heap', () => {
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

	it('create trie correctly', () => {
		const ipsumCaseInsensitive = new Map([['ci', ['abc', 'def', 'ghi jkl', 'mnop-qr2']]]);
		const ipsumCaseSensitive = new Map([['cs', ['ZXY', 'VUT']]]);
		const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, { tag: 'x-a' });
		const { trieAsString } = match.getDetails();
		expect(trieAsString).to.equal(
			'[["a",[["b",[["c",[["_kw_","ci"]]],["C",[["_kw_","ci"]]]]],["B",[["c",[["_kw_","ci"]]],["C",[["_kw_","ci"]]]]]]],["A",[["b",[["c",[["_kw_","ci"]]],["C",[["_kw_","ci"]]]]],["B",[["c",[["_kw_","ci"]]],["C",[["_kw_","ci"]]]]]]],["d",[["e",[["f",[["_kw_","ci"]]],["F",[["_kw_","ci"]]]]],["E",[["f",[["_kw_","ci"]]],["F",[["_kw_","ci"]]]]]]],["D",[["e",[["f",[["_kw_","ci"]]],["F",[["_kw_","ci"]]]]],["E",[["f",[["_kw_","ci"]]],["F",[["_kw_","ci"]]]]]]],["g",[["h",[["i",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]],["I",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]]]],["H",[["i",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]],["I",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]]]]]],["G",[["h",[["i",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]],["I",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]]]],["H",[["i",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]],["I",[[" ",[["j",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]],["J",[["k",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]],["K",[["l",[["_kw_","ci"]]],["L",[["_kw_","ci"]]]]]]]]]]]]]]],["m",[["n",[["o",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]],["O",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]]]],["N",[["o",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]],["O",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]]]]]],["M",[["n",[["o",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]],["O",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]]]],["N",[["o",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]],["O",[["p",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]],["P",[["-",[["q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]],["Q",[["r",[["2",[["_kw_","ci"]]]]],["R",[["2",[["_kw_","ci"]]]]]]]]]]]]]]]]],["Z",[["X",[["Y",[["_kw_","cs"]]]]]]],["V",[["U",[["T",[["_kw_","cs"]]]]]]]]'
		);
	});

	it('creating trie with duplicate CI kws should error', () => {
		const ipsumCaseInsensitive = new Map([['ci', ['abc', 'abc']]]);
		const iThrowError = () => new Match(ipsumCaseInsensitive, null, { tag: 'x-a' });
		expect(iThrowError).to.throw(Error, 'lower-cased case-insensitive map contains duplicates');
	});

	it('creating trie with duplicate CI kws should error', () => {
		const ipsumCaseSensitive = new Map([['cs', ['abc', 'abc']]]);
		const iThrowError = () => new Match(null, ipsumCaseSensitive, { tag: 'x-a' });
		expect(iThrowError).to.throw(Error, 'case-sensitive map contains duplicates');
	});

	it('creating trie with duplicate lowercase CS kws should not error', () => {
		const ipsumCaseSensitive = new Map([['cs', ['abc', 'aBc']]]);
		const iThrowError = () => new Match(null, ipsumCaseSensitive, { tag: 'x-a' });
		expect(iThrowError).not.to.throw(Error);
	});

	it('creating trie with clashes between CI and CS kws should error', () => {
		const ipsumCaseInsensitive = new Map([['ci', ['ABC']]]);
		const ipsumCaseSensitive = new Map([['cs', ['abc', 'aBc']]]);
		const iThrowError = () => new Match(ipsumCaseInsensitive, ipsumCaseSensitive, { tag: 'x-a' });
		expect(iThrowError).to.throw(
			Error,
			'merged lower-cased case-insensitive list and deduped lower-cased case-sensitive map contains duplicates'
		);
	});

	it('getMatchIndexes correctly', () => {
		const text =
			'Here is a text for testing abc purposes ABC with some matches def here and DEF there VUT.mnop-qr2';
		const ipsumCaseInsensitive = new Map([['ci', ['abc', 'def', 'ghi jkl', 'mnop-qr2']]]);
		const ipsumCaseSensitive = new Map([['cs', ['ZXY', 'VUT']]]);
		const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, { tag: 'x-a' });

		const res = match.getMatchIndexes(text);
		expect(JSON.stringify(res)).to.equal(
			JSON.stringify([
				['ci', 27, 29],
				['ci', 40, 42],
				['ci', 62, 64],
				['ci', 75, 77],
				['cs', 85, 87],
				['ci', 89, 95]
			])
		);
	});

	it('getMatchIndexes correctly with confounders', () => {
		const text = 'abcd abc abcd';
		const ipsumCaseInsensitive = new Map([
			['short', ['abc']],
			['long', ['abcd']]
		]);
		const ipsumCaseSensitive = new Map();
		const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, { tag: 'x-a' });

		const res = match.getMatchIndexes(text);
		expect(JSON.stringify(res)).to.equal(
			JSON.stringify([
				['long', 0, 3],
				['short', 5, 7],
				['long', 9, 11]
			])
		);
	});
});
