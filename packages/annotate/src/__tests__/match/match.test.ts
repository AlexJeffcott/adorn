import { expect } from 'chai';
import { Match } from '../../';
import {
	ipsumCaseSensitive,
	ipsumCaseInsensitive,
	ipsumText,
	extractedMatchIds,
	replacedKws,
	extractedDirtyMatches,
	wrappedKwsWithHtml
} from 'test-utils';

const opts = { tag: 'x-a' };
const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, opts);

describe('annotate with', () => {
	describe('text ending in full stop should', () => {
		it('extractMatchIds correctly', () => {
			const res = match.extractMatchIds(ipsumText);
			expect(JSON.stringify(res)).to.equal(JSON.stringify(extractedMatchIds));
		});

		it('replaceKws correctly', () => {
			const res = match.replaceKws(ipsumText);
			expect(res).to.equal(replacedKws);
		});

		it('extractDirtyMatches correctly', () => {
			const res = match.extractDirtyMatches(ipsumText);
			expect(JSON.stringify(res)).to.equal(JSON.stringify(extractedDirtyMatches));
		});

		it('wrapKwsWithHtml correctly', () => {
			const res = match.wrapKwsWithHtml(ipsumText);
			expect(res).to.equal(wrappedKwsWithHtml);
		});
	});
});
