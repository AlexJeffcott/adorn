import { expect } from 'chai';
import { Match } from '../../';

describe('match should', () => {
	const ci = new Map([['2', ['a']]]);
	const cs = new Map([['5', ['Aristonem']]]);

	const match = new Match(new Map(ci), new Map(cs), {
		tag: 'x-a',
		getAttrs: (id: string) => [['data-match-id', id]]
	});
	const matches = [['5', 0, 8]];

	const str = 'Aristonem but not aristonem';
	const replacedHtml = '<x-a data-match-id="5">Aristonem</x-a> but not aristonem';

	it('makes trie correctly', () => {
		const { trieAsString } = match.getDetails();
		expect(trieAsString).to.equal(
			'CI ===> [["a",[["_kw_","2"]]],["A",[["_kw_","2"]]]] || CS ===> [["A",[["r",[["i",[["s",[["t",[["o",[["n",[["e",[["m",[["_kw_","5"]]]]]]]]]]]]]]]]]]]]'
		);
	});

	it('getMatchIndexes correctly', () => {
		const res = match.getMatchIndexes(str);
		expect(JSON.stringify(res)).to.equal(JSON.stringify(matches));
	});

	it('wrapKwsWithHtml correctly', () => {
		const res = match.wrapKwsWithHtml(str);
		expect(res).to.equal(replacedHtml);
	});
});
