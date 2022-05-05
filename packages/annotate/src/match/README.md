# Match

### A JavaScript implementation of [flashtext](https://github.com/vi3k6i5/flashtext) adapted for handling case-[in]sensitivity in a single instantiation and elaborating the found text.

#### TODOs

1. [~~check cs and ci maps do not clash~~]()
   - if you have ci: 'abc' and cs: 'AB'|'aB' the trie will be fine:
   ```yaml
   a:
     b:
       c:
         _kw_: ci
       C:
         _kw_: ci
     B:
       _kw_: cs // this is fine
       c:
         _kw_: ci
       C:
         _kw_: ci
   A:
     b:
       c:
         _kw_: ci
       C:
         _kw_: ci
       B:
         _kw_: cs
         c:
           _kw_: ci
         C:
           _kw_: ci
   ```
   - but if you have ci: 'abc' and cs: 'ABC'|'AbC' the trie will be which is not fine:
   ```yaml
   a:
      b:
         c:
            _kw_: ci
         C:
            _kw_: ci
      B:
         c:
            _kw_: ci
         C:
            _kw_: ci
   A:
      b:
         c:
            _kw_: ci
         C:
            _kw_: cs // this is not fine
            _kw_: ci
         B:
            c:
               _kw_: ci
            C:
               _kw_: ci
   ```
