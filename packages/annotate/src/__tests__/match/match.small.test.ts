import { expect } from 'chai';
import { Match } from '../../';

const text = 'abc ABC def DEF';
const ipsumCaseInsensitive = new Map([['ci-123', ['abc']]]);
const ipsumCaseSensitive = new Map([['cs-123', ['DEF']]]);
const opts = { tag: 'x-a' };
const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, opts);

describe('match should', () => {
	it('create trie correctly (299 bytes etc)', () => {
		const { trieSizeInBytes, trieAsString } = match.getDetails();
		expect(trieSizeInBytes).to.equal(299);
		expect(trieAsString).to.equal(
			'[["a",[["b",[["c",[["_kw_","ci-123"]]],["C",[["_kw_","ci-123"]]]]],["B",[["c",[["_kw_","ci-123"]]],["C",[["_kw_","ci-123"]]]]]]],["A",[["b",[["c",[["_kw_","ci-123"]]],["C",[["_kw_","ci-123"]]]]],["B",[["c",[["_kw_","ci-123"]]],["C",[["_kw_","ci-123"]]]]]]],["D",[["E",[["F",[["_kw_","cs-123"]]]]]]]]'
		);
	});

	it('getMatchIndexes correctly', () => {
		const res = match.getMatchIndexes(text);
		expect(JSON.stringify(res)).to.equal(
			JSON.stringify([
				['ci-123', 0, 2],
				['ci-123', 4, 6],
				['cs-123', 12, 13]
			])
		);
	});
});
