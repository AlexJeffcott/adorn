import type { Match } from '../match';

const rangeWrap = (textNodes: Array<Node | HTMLElement>, match: Match) => {
	const range = document.createRange();

	const wrap = (n: Node) => {
		const oldText = n.textContent || '';
		const matches = match.getMatchIndexes(oldText);

		matches.reverse().forEach((m) => {
			const newParent = document.createElement('annotation-anchor');
			match.opts
				.getAttrs(m[0])
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
