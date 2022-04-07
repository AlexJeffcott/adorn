import throttle from 'lodash.throttle';

const relDiff = (a: number, b: number): number => 100 * Math.abs((a - b) / ((a + b) / 2));
export class TextNodesFromDOM {
	private baseElement: HTMLElement | Node;
	private range: Range;
	private ownerDocument: Document;
	private ignoreNodeNames: Array<string>;
	private readonly nodeReg =
		/(head|script|style|meta|noscript|input|img|svg|cite|button|path|d|defs)/i;
	private textNodes: Node[];

	constructor(baseElement: HTMLElement, ignoreNodeNames: string[]) {
		this.baseElement = baseElement;
		this.ownerDocument = this.baseElement.ownerDocument || document;
		this.range = this.ownerDocument.createRange();
		this.textNodes = [];
		this.ignoreNodeNames = ignoreNodeNames || [];
	}

	getIsTextNodeInViewport = (node: Node) => {
		this.range.selectNode(node);
		const r = this.range.getBoundingClientRect();
		const viewport = window.visualViewport;

		// node rect
		const nodeTopRelativeToTopOfCurrentScreen = r.top;
		const nodeBottomRelativeToTopOfCurrentScreen = r.bottom;
		const nodeLeftRelativeToCurrentScreen = r.left;
		const nodeRightRelativeToCurrentScreen = r.right;

		// node visibility
		const nodeHasDimensions = r.width > 0 && r.height > 0; // is the node 0 height or width?

		const nodeIsTooHigh = nodeBottomRelativeToTopOfCurrentScreen <= 0;
		const nodeIsTooLow = nodeTopRelativeToTopOfCurrentScreen >= viewport.height;
		const nodeIsTooLeft = nodeLeftRelativeToCurrentScreen <= 0;
		const nodeIsTooRight = nodeRightRelativeToCurrentScreen >= viewport.width;
		const nodeIsWithinVisibleScreen =
			!nodeIsTooHigh && !nodeIsTooLow && !nodeIsTooLeft && !nodeIsTooRight;

		return nodeHasDimensions && nodeIsWithinVisibleScreen;
	};

	walkerFilter = (node: Node) => {
		if (this.nodeReg.test(node.parentElement?.tagName || '')) return NodeFilter.FILTER_REJECT;
		if (this.ignoreNodeNames.includes(node.parentElement?.tagName || ''))
			return NodeFilter.FILTER_REJECT;
		if (!node.textContent) return NodeFilter.FILTER_REJECT;
		if (node.textContent.trim().length < 3) return NodeFilter.FILTER_REJECT;
		if (!this.getIsTextNodeInViewport(node)) return NodeFilter.FILTER_REJECT;
		return NodeFilter.FILTER_ACCEPT;
	};

	watchScroll = (watchCB: (nodes: Node[]) => void): (() => void) => {
		let lastKnownScrollPosition = window.scrollY;
		const watchScrollCB = throttle(() => {
			const prev = lastKnownScrollPosition;
			lastKnownScrollPosition = window.scrollY;
			const diff = relDiff(prev, lastKnownScrollPosition);
			if (diff > 0.5) {
				window.requestAnimationFrame((requestedAnimationFrame: number): void => {
					window.cancelAnimationFrame(requestedAnimationFrame);
					watchCB(this.walk(document.body));
				});
			}
		}, 500);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call
		document.addEventListener('scroll', watchScrollCB, true);
		return watchScrollCB;
	};

	watchDOM = (watchDOMCB: (nodes: Node[]) => void): MutationObserver => {
		const mutationFilter = (mutations: MutationRecord[], observer: MutationObserver): void => {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					const n = mutation.addedNodes[0];
					if (n.parentElement === null) return;
					if (this.nodeReg.test(n.parentElement?.tagName || '')) return;
					if (this.ignoreNodeNames.includes(n.parentElement?.tagName || '')) return;
					const addedNodes: Node[] = this.walk(n.parentElement);
					if (addedNodes.length > 0) watchDOMCB(addedNodes);
				}
			}
		};

		const mutationObserver = new MutationObserver(mutationFilter);
		const mutationConfig: MutationObserverInit = {
			attributes: true,
			attributeFilter: ['style'],
			childList: true,
			characterData: true,
			subtree: true
		};

		mutationObserver?.observe(document.body, mutationConfig);
		return mutationObserver;
	};

	endWatchDOM(mo: MutationObserver): void {
		mo?.disconnect();
	}

	endWatchScroll(cb: () => void): void {
		document.removeEventListener('scroll', cb);
	}

	walk = (base: HTMLElement | Node) => {
		const baseElementOrNode = base || document.body;
		this.textNodes = [];
		const walker: TreeWalker = this.ownerDocument.createTreeWalker(
			baseElementOrNode,
			NodeFilter.SHOW_TEXT,
			this.walkerFilter.bind(this)
		);

		while (walker.nextNode()) {
			this.textNodes.push(walker.currentNode);
		}

		return this.textNodes;
	};
}
