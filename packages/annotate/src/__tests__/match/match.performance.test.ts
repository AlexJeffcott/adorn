import { expect } from 'chai';
import { Match } from '../../';
import { performance, PerformanceObserver } from 'perf_hooks';
import { ipsumCaseSensitive, ipsumCaseInsensitive, ipsumText } from 'test-utils';

const opts = { tag: 'x-a' };
const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, opts);

describe('annotate with', () => {
	it('extractMatchIds correctly and in less than 3ms', () => {
		const obs = new PerformanceObserver((list) => {
			expect(list.getEntries()[0].duration).to.be.lessThan(2.5);
			performance.clearMarks();
			obs.disconnect();
		});
		obs.observe({ entryTypes: ['function'] });

		const wrapped = performance.timerify((_ipsum: string) => match.extractMatchIds(_ipsum));
		wrapped(ipsumText);
		obs.disconnect();
	});
	it('extractMatchIds correctly and in less than 3ms', () => {
		const obs = new PerformanceObserver((list) => {
			expect(list.getEntries()[0].duration).to.be.lessThan(2.5);
			performance.clearMarks();
			obs.disconnect();
		});
		obs.observe({ entryTypes: ['function'] });

		const wrapped = performance.timerify((_ipsum: string) => match.extractMatchIds(_ipsum));
		wrapped(ipsumText);
		obs.disconnect();
	});
});
