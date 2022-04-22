# Adorn
## Performant and powerful keyword matching, extraction and annotation for the DOM
### Background and Inspiration
I believe that there is a use-case for keyword matching in large amounts of text (with large numbers of keywords) in Javascript-friendly environments. I believe there is a further use-case for wrapping such matches in xml; to be used to add highlighting, tooltips or any other interactivity to keyword text in websites.

I felt that the current possibilities available to achieve this were lacking, so created this library.

### Performance
The [complexity](https://en.wikipedia.org/wiki/Time_complexity) of the [FlashText algorithm](https://arxiv.org/abs/1711.00046) is linear and can search or replace keywords in one pass over a document. The time complexity of this algorithm is not dependent on the number of terms being searched or replaced. So for a document of size N (characters) and a dictionary of M keywords, the time complexity will be O(n). It is much faster than Regex, because regex time complexity is O(MxN).

The [Aho–Corasick algorithm](https://en.wikipedia.org/wiki/Aho%E2%80%93Corasick_algorithm), by contrast, is linear in the length of the strings plus the length of the searched text plus the number of output matches.

### Power
There are several methods available depending on what you wish to achieve including, a simple list of match ids, a list of 'dirty' matches, the full text returned with matches wrapped in a custom tag.

It is ready to be used in static html and plain text, in Node and in the Browser. There is also support for simple implementation in React.

It is possible to have case-insensitive AND case-sensitive matches in the same Match instance. In other words, the flower 'rose' is not matched when looking for the name 'Rose' but both 'flower' and 'Flower' can be matched in the same matcher instance unlike the original flash-text implementation.

You can optionally listen for DOM mutations and scrolling.

One possible disadvantage of this algorithm is that it does not match substrings and returns the longest match only (if you want to do that then aho-corasick is probably a better choice for you).

### Usage in static HTML
```html
<html lang="en">
<head>
    <style>
        #root {
            height: 2500px;
        }
        x-annotate {
            border-bottom-color: cadetblue;
            border-bottom-style: solid;
            border-bottom-width: 2px;
        }
    </style>
</head>
<body>
    <div id="content">
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus cursus enim eu
            scelerisque. Nam eleifend purus sed quam facilisis aliquet. Fusce feugiat neque elit, non
            egestas ipsum molestie quis. Suspendisse quis ipsum malesuada, scelerisque tellus quis,
            auctor tortor. Nam gravida dolor at molestie facilisis. Donec faucibus nisl vitae ante
            accumsan, id vulputate lorem convallis. Integer condimentum nunc turpis, eget pellentesque
            nunc gravida nec. Maecenas in tincidunt eros. Nullam ac feugiat turpis. Interdum et
            malesuada fames ac ante ipsum primis in faucibus. Nullam at posuere urna. Phasellus
            fermentum dolor nec sapien congue feugiat. Duis aliquam, ex finibus porttitor viverra,
            quam augue gravida dui, quis cursus purus justo a mi.
        </p>
    </div>
    <script type="module">
        import { TextNodesFromDOM, Match, annotateDOM } from '../annotate/build';
    
        const insensitive = new Map([
            ['123', ['Ipsum']],
            ['456', ['neque']],
            ['789', ['Ut']]
        ]);
        const sensitive = new Map([['321', ['Nullam']]]);
        const opts = { tag: 'x-annotate' };
    
        const match = new Match(insensitive, sensitive, opts);
        const textNodesFromDOM = new TextNodesFromDOM(document.body, [opts.tag.toUpperCase()]);
    
        annotateDOM(textNodesFromDOM.walk(document.body), match);
        textNodesFromDOM.watchDOM((ns) => annotateDOM(ns, match));
        textNodesFromDOM.watchScroll((ns) => annotateDOM(ns, match));
    </script>
</body>
</html>
```

### Usage in React
```javascript
import { FC, useEffect } from 'react';
import { TextNodesFromDOM, Match, annotateDOM } from 'annotate';

const insensitive = new Map([
    ['123', ['Ipsum']],
    ['456', ['neque']],
    ['789', ['Ut']]
]);
const sensitive = new Map([['321', ['Nullam']]]);
const opts = { tag: 'x-annotate' };
const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, opts);
const textNodesFromDOM = new TextNodesFromDOM(document.body, [opts.tag.toUpperCase()]);

const Ipsum: FC = () => {
    useEffect(() => {
        annotateDOM(textNodesFromDOM.walk(document.body), match);
        const scrollCB = textNodesFromDOM.watchScroll((ns: Node[]) => annotateDOM(ns, match));
        return () => textNodesFromDOM.endWatchScroll(scrollCB);
    }, []);
	
    return (
        <div className="content">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus cursus enim eu
                scelerisque. Nam eleifend purus sed quam facilisis aliquet. Fusce feugiat neque elit, non
                egestas ipsum molestie quis. Suspendisse quis ipsum malesuada, scelerisque tellus quis,
                auctor tortor. Nam gravida dolor at molestie facilisis. Donec faucibus nisl vitae ante
                accumsan, id vulputate lorem convallis. Integer condimentum nunc turpis, eget pellentesque
                nunc gravida nec. Maecenas in tincidunt eros. Nullam ac feugiat turpis. Interdum et
                malesuada fames ac ante ipsum primis in faucibus. Nullam at posuere urna. Phasellus
                fermentum dolor nec sapien congue feugiat. Duis aliquam, ex finibus porttitor viverra,
                quam augue gravida dui, quis cursus purus justo a mi.
            </p>
        </div>
    )
}
```
### Usage in Node

### Developer area
#### Get started
```shell
npm i
npm run bootstrap
npm run run start --scope annotate
npm run run start --scope frontend-react
npm run run lint --scope frontend-react
```

#### update deps
```shell
npx npm-check-updates -u
```
