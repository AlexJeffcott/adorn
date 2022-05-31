import { expect } from 'chai';
import { Match } from '../../';

describe('match should', () => {
	const cs = new Map([
		['1', ['ab']],
		['2', ['abc def']]
	]);

	const match = new Match(null, new Map(cs), {
		tag: 'x-a',
		getAttrs: (id: string) => [['data-match-id', id]]
	});
	const matches = [['1', 0, 1]];

	const str = 'ab but not abc';
	const replacedHtml = '<x-a data-match-id="1">ab</x-a> but not abc';

	it('makes trie correctly', () => {
		const { trieAsString } = match.getDetails();
		expect(trieAsString).to.equal(
			'CI ===> [] || CS ===> [["a",[["b",[["_kw_","1"],["c",[[" ",[["d",[["e",[["f",[["_kw_","2"]]]]]]]]]]]]]]]]'
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
