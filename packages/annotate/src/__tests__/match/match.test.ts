import { expect } from 'chai';
import { Match } from '../../';
import { ipsum, ipsumCaseInsensitive, ipsumCaseSensitive } from '../__mocks__/ipsumIns';
import {
	extractedMatchIds,
	replacedKws,
	extractedDirtyMatches,
	wrappedKwsWithHtml
} from '../__mocks__/ipsumOuts';

const opts = { tag: 'x-a' };
const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, opts);

describe('annotate with', () => {
	describe('text ending in full stop should', () => {
		it('extractMatchIds correctly', () => {
			const res = match.extractMatchIds(ipsum);
			expect(JSON.stringify(res)).to.equal(JSON.stringify(extractedMatchIds));
		});

		it('replaceKws correctly', () => {
			const res = match.replaceKws(ipsum);
			expect(res).to.equal(replacedKws);
		});

		it('extractDirtyMatches correctly', () => {
			const res = match.extractDirtyMatches(ipsum);
			expect(JSON.stringify(res)).to.equal(JSON.stringify(extractedDirtyMatches));
		});

		it('wrapKwsWithHtml correctly', () => {
			const res = match.wrapKwsWithHtml(ipsum);
			expect(res).to.equal(wrappedKwsWithHtml);
		});
	});
});
