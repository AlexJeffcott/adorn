import { createPopper, auto, Instance } from '@popperjs/core';

const CARD_TAG_NAME = 'content-card';
const MATCH_WRAPPER_CONTENT_ID_ATTR = 'data-content-id';
const TOOLTIP_OPENED_EVENT = 'annotation_tooltip_opened';
const ARROW_ID_SELECTOR = '#content-card-arrow';

function getPopperOptions(arrow: HTMLElement) {
	return {
		placement: auto,
		modifiers: [
			{ name: 'eventListeners', enabled: true },
			{
				name: 'offset',
				enabled: true,
				options: {
					offset: [0, 8]
				}
			},
			{
				name: 'arrow',
				options: {
					element: arrow
				}
			},
			{
				name: 'flip',
				enabled: true,
				options: {
					allowedAutoPlacements: ['top', 'bottom'],
					rootBoundary: 'viewport'
				}
			},
			{
				name: 'preventOverflow',
				enabled: true,
				options: {
					boundariesElement: 'viewport'
				}
			}
		]
	};
}

class Tip extends HTMLElement {
	track: TrackMethod;
	private popperInstance: Instance | null;
	private arrow: HTMLElement | undefined | null;
	private target: HTMLSpanElement;
	private content: HTMLElement | null;
	static get observedAttributes() {
		return [MATCH_WRAPPER_CONTENT_ID_ATTR];
	}

	get contentId() {
		return this.getAttribute(MATCH_WRAPPER_CONTENT_ID_ATTR);
	}

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.track = (args) => console.log('Track method placeholder', args);
		this.popperInstance = null;
		this.content = document.querySelector(CARD_TAG_NAME);
		this.arrow = this.content?.shadowRoot?.querySelector(ARROW_ID_SELECTOR);
		this.target = document.createElement('span');

		const stylesheet = new CSSStyleSheet();
		stylesheet.insertRule(
			':host-context([data-annotation-variant="underline"]) > span { border-bottom: solid 1px #0aa6b8}'
		);
		stylesheet.insertRule(
			':host-context([data-annotation-variant="none"]) > span {border-bottom: initial;pointer-events: none;}'
		);
		// @ts-ignore
		this.shadowRoot.adoptedStyleSheets = [stylesheet];
	}

	connectedCallback() {
		// if (this.shadowRoot === null) return undefined;
		// const styleElem = document.createElement('style');
		// styleElem.innerText = styles;
		// this.shadowRoot.appendChild(styleElem);
		this.render();
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue !== newValue) {
			this.render();
		}
	}

	render() {
		if (this.shadowRoot === null) return undefined;
		if (!this.childNodes[0]) return undefined;
		if (this.childNodes[0].textContent === null) return undefined;
		this.target.innerText = this.childNodes[0].textContent;
		this.shadowRoot.appendChild(this.target);

		this.target.addEventListener('mouseover', (event) => {
			event.stopPropagation();
			this.open();

			this.content?.addEventListener(
				'mouseover',
				(event) => {
					event.stopPropagation();
					this.content?.setAttribute('show-popper', '');
				},
				{ once: true }
			);

			this.content?.addEventListener(
				'mouseleave',
				(event) => {
					event.stopPropagation();
					this.content?.removeAttribute('show-popper');
					this.close();
				},
				{ once: true }
			);
		});

		this.target.addEventListener('mouseleave', (event) => {
			event.stopPropagation();
			this.content?.removeAttribute('show-popper');
			this.close();
		});
	}

	open() {
		if (!this.content) {
			return undefined;
		}

		if (this.popperInstance !== null) {
			this.popperInstance.destroy();
			this.popperInstance = null;
		}

		this.content.setAttribute(MATCH_WRAPPER_CONTENT_ID_ATTR, this.contentId as string);
		if (this.content.getAttribute(MATCH_WRAPPER_CONTENT_ID_ATTR) !== this.contentId) {
			this.open();
			return undefined;
		}

		this.arrow = this.content?.shadowRoot?.querySelector(ARROW_ID_SELECTOR);
		if (!this.arrow) {
			this.open();
			return undefined;
		}

		this.popperInstance = createPopper(this.target, this.content, getPopperOptions(this.arrow));
		this.popperInstance.forceUpdate();
		this.content.setAttribute('show-popper', '');
		this.track([
			TOOLTIP_OPENED_EVENT,
			{
				contentId: this.contentId || ''
			}
		]);
	}

	close() {
		setTimeout(() => {
			if (this.content !== null && !this.content.hasAttribute('show-popper')) {
				this.content.removeAttribute(MATCH_WRAPPER_CONTENT_ID_ATTR);
				if (this.popperInstance !== null) {
					this.popperInstance.destroy();
					this.popperInstance = null;
				}
			}
		}, 50);
	}
}

export type TrackMethod = (args: [string, Record<string, string>]) => void;
export { Tip };
