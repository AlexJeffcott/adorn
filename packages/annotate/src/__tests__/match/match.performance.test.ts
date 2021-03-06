import { expect } from 'chai';
import { Match } from '../../';
import { performance, PerformanceObserver } from 'perf_hooks';
import { ipsumCaseSensitive, ipsumCaseInsensitive, ipsumText } from '@fairfox/test-utils';

const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, {
	tag: 'x-a',
	getAttrs: (id: string) => [['data-match-id', id]]
});

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
