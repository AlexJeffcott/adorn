# Adorn
## Performant and powerful keyword matching, extraction and annotation for the DOM
### Background and Inspiration
https://en.wikipedia.org/wiki/Aho%E2%80%93Corasick_algorithm

https://arxiv.org/abs/1711.00046

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
