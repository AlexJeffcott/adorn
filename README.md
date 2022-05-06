# Adorn

## Performant and powerful keyword matching, extraction and annotation for the DOM

### Background and Inspiration

Want keyword matching for large amounts of text (with large numbers of keywords) in Javascript-friendly environments?

Want to leverage knowledge resources to enrich a website's content without the overhead of curating and maintaining the extra content?

Want to add interactive elements (whether simply styling, links, or tooltips or something more complex) based on a user's profile or settings?

Adorn your content nimbly, but with power and precision.

### Performance

The [complexity](https://en.wikipedia.org/wiki/Time_complexity) of the [FlashText algorithm](https://arxiv.org/abs/1711.00046) is linear and can search or replace keywords in one pass over a document. The time complexity of this algorithm is not dependent on the number of terms being searched or replaced. So for a document of size N (characters) and a dictionary of M keywords, the time complexity will be O(n). It is much faster than Regex, because regex time complexity is O(MxN).

The [Aho–Corasick algorithm](https://en.wikipedia.org/wiki/Aho%E2%80%93Corasick_algorithm), by contrast, is linear in the length of the strings plus the length of the searched text plus the number of output matches.

### Power

There are several methods available depending on what you wish to achieve including, a simple list of match ids, a list of 'dirty' matches, the full text returned with matches wrapped in a custom tag.

It is ready to be used in static html and plain text, in Node and in the Browser. There is also support for simple implementation in React.

It is possible to have case-insensitive AND case-sensitive matches in the same Match instance. In other words, the flower 'rose' is not matched when looking for the name 'Rose' but both 'flower' and 'Flower' can be matched in the same matcher instance unlike the original flash-text implementation.

You can optionally listen for DOM mutations and scrolling.

One possible disadvantage of this algorithm is that it does not match substrings and returns the longest match only (if you want to do that then aho-corasick is probably a better choice for you).


### Some examples
While the below examples showcase htmlWrapping via annotateDOM with a [custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements), there is no reason not to take a simpler approach and add a class, or inline styles, or even an anchor link with an href calculated from the matched keyword.

[Checkout the React Typescript codesandbox](https://codesandbox.io/s/adorn-react-0vbwqo)

#### Usage in static HTML as a Javascript plugin

```html
<html lang="en">
<head>
    <style>
        x-annotate {
            border-bottom-color: cadetblue;
            border-bottom-style: solid;
            border-bottom-width: 2px;
        }
    </style>
</head>
<body>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus cursus enim eu
    scelerisque. Nam eleifend purus sed quam facilisis aliquet. Fusce feugiat neque elit, non
    egestas ipsum molestie quis. Suspendisse quis ipsum malesuada, scelerisque tellus quis,
    auctor tortor. Nam gravida dolor at molestie facilisis. Donec faucibus nisl vitae ante
    accumsan, id vulputate lorem convallis. Integer condimentum nunc turpis, eget pellentesque
    nunc gravida nec. Maecenas in tincidunt eros. Nullam ac feugiat turpis. Interdum et
    malesuada fames ac ante ipsum primis in faucibus. Nullam at posuere urna. Phasellus
    fermentum dolor nec sapien congue feugiat. Duis aliquam, ex finibus porttitor viverra, quam
    augue gravida dui, quis cursus purus justo a mi.
  </p>
  <script type="module">
    import { TextNodesFromDOM, Match, annotateDOM } from '../annotate/build';

    const insensitive = new Map([
        ['123', ['Ipsum']],
        ['456', ['neque']],
        ['789', ['Ut']]
    ]);
    const sensitive = new Map([['321', ['Nullam']]]);
    const opts = { tag: 'x-annotate', getAttrs: (id) => `data-match-id="${id}"`};

    const match = new Match(insensitive, sensitive, opts);
    const textNodesFromDOM = new TextNodesFromDOM(document.body, [opts.tag.toUpperCase()]);

    annotateDOM(textNodesFromDOM.walk(document.body), match);
    textNodesFromDOM.watchDOM((ns) => annotateDOM(ns, match));
    textNodesFromDOM.watchScroll((ns) => annotateDOM(ns, match));
  </script>
</body>
</html>
```

#### Simple usage in React

```javascript
import { FC, useEffect } from 'react';
import { TextNodesFromDOM, Match, annotateDOM } from 'annotate';

const insensitive = new Map([
	['123', ['Ipsum']],
	['456', ['neque']],
	['789', ['Ut']]
]);
const sensitive = new Map([['321', ['Nullam']]]);
const opts = { tag: 'x-annotate', getAttrs: (id: string) => `data-match-id="${id}"`};
const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, opts);
const textNodesFromDOM = new TextNodesFromDOM(document.body, [opts.tag.toUpperCase()]);

const Ipsum: FC = () => {
  useEffect(() => {
    annotateDOM(textNodesFromDOM.walk(document.body), match);
    const scrollCB = textNodesFromDOM.watchScroll((ns: Node[]) => annotateDOM(ns, match));
    return () => textNodesFromDOM.endWatchScroll(scrollCB);
  }, []);

  return (
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus cursus enim eu
      scelerisque. Nam eleifend purus sed quam facilisis aliquet. Fusce feugiat neque elit, non
      egestas ipsum molestie quis. Suspendisse quis ipsum malesuada, scelerisque tellus quis,
      auctor tortor. Nam gravida dolor at molestie facilisis. Donec faucibus nisl vitae ante
      accumsan, id vulputate lorem convallis. Integer condimentum nunc turpis, eget pellentesque
      nunc gravida nec. Maecenas in tincidunt eros. Nullam ac feugiat turpis. Interdum et
      malesuada fames ac ante ipsum primis in faucibus. Nullam at posuere urna. Phasellus
      fermentum dolor nec sapien congue feugiat. Duis aliquam, ex finibus porttitor viverra, quam
      augue gravida dui, quis cursus purus justo a mi.
    </p>
  );
};
```
