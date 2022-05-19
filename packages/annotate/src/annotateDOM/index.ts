/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import type { Match } from '../match';
const rangeWrap = (textNodes: Array<Node | HTMLElement>, match: Match) => {
	const range = document.createRange();

	const wrap = (n: Node) => {
		const oldText = n.textContent || '';
		const matches = match.getMatchIndexes(oldText);
		matches.reverse().forEach((m) => {
			// todo: fix this type to allow arbitrary methods to be added to the custom element
			const newParent: any = document.createElement(match.opts.tag);
			if (Array.isArray(match.opts.elementMethods))
				match.opts.elementMethods.forEach(
					([methodName, method]) => (newParent[methodName] = method)
				);
			match.opts
				.getAttrs?.(m[0])
				.forEach(([prop, value]: [string, string]) => newParent.setAttribute(prop, value));
			range.setStart(n, m[1]);
			range.setEnd(n, m[2] + 1);
			range.surroundContents(newParent);
		});
	};
	textNodes.forEach(wrap);
};

export const annotateDOM = (textNodes: Array<Node | HTMLElement>, match: Match) => {
	rangeWrap(textNodes, match);
};
