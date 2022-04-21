# Frontend with React and Typescript

## Used for testing annotate package in a React application

## Gotchas

1. You must ensure that the annotate package is built before you can utilise it here (including tests). You can do this 'manually' by:
   ```shell
   # from the root of the mono-repo
   npx lerna run --scope annotate build
   npx lerna run --scope annotate emit
   npx lerna clean
   npx lerna bootstrap --hoist
   ```
