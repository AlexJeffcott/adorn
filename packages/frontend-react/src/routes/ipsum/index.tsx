import { FC, useEffect, useState } from 'react';
import { TextNodesFromDOM, Match, annotateDOM } from 'annotate';
import { ipsumCaseSensitive, ipsumCaseInsensitive, ipsumParagraphs } from 'test-utils';
import './index.css';

const opts = { tag: 'x-a' };
const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, opts);
const textNodesFromDOM = new TextNodesFromDOM(document.body, [opts.tag.toUpperCase()]);

const Ipsum: FC = () => {
	const [showH4, setShowH4] = useState(false);
	const [showH5, setShowH5] = useState(false);

	useEffect(() => {
		annotateDOM(textNodesFromDOM.walk(document.body), match);
		const scrollCB = textNodesFromDOM.watchScroll((ns: Node[]) => annotateDOM(ns, match));
		return () => textNodesFromDOM.endWatchScroll(scrollCB);
	}, [showH4, showH5]);

	return (
		<div className="content">
			<h1>Lorem Ipsum</h1>
			{showH4 ? (
				<h4>
					&quot;Neque porro quisquam est qui dolorem <i>ipsum</i> quia dolor sit amet, consectetur,
					adipisci velit...&quot;
				</h4>
			) : (
				<button onClick={() => setShowH4(true)}>show h4</button>
			)}
			{showH5 ? (
				<h5>
					&quot;There is no one who loves pain itself, who seeks after it and wants to have it,
					simply because it is pain...&quot;
				</h5>
			) : (
				<button onClick={() => setShowH5(true)}>show h5</button>
			)}
			{ipsumParagraphs.map((p: string, index: number) => (
				<p key={`${p[0]}-${index}`}>{p}</p>
			))}
		</div>
	);
};

export default Ipsum;
