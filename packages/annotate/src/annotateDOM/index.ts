import type { Match } from '../match';

export const annotateDOM = (textNodes: Array<Node | HTMLElement>, match: Match) => {
	const renderNode = document.createElement('span');
	textNodes.forEach((n) => {
		const oldText = n.textContent || '';
		const newHtml = match.wrapKwsWithHtml(oldText);

		if (oldText === newHtml) return;
		if (n.parentElement === null) return;

		if (n.nextSibling === null && n.previousSibling === null) {
			// if the text node's parent only has one child, then it is safe to overwrite all the innerHTML
			n.parentElement.innerHTML = newHtml;
		} else {
			renderNode.innerHTML = newHtml;
			if ('replaceWith' in n) {
				// todo: why has this error appeared from nowhere?
				// @ts-ignore
				n.replaceWith(...renderNode.childNodes);
			}
		}
	});
};
