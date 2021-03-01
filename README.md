# `boardgame.js`

## The Library

The library is almost required when using boardgame WASM.

It is located in `./src`, `webpack.config.js`, run `npm run build-lib` to build.
Output is placed in `./dist/index.js`.

## UI Components

The UI components library can be useful when using boardgame WASM. It includes
some standard components written in [React](https://reactjs.org/).

It is located in `./components`, `components.config.js`, run
`npm run build-components` to build. Output is placed in `./dist/components.js`.

## Example

An example project is available. To use it, place `boardgame.js` and
`boardgame.wasm` (output of the Haskell [boardgame](https://github.com/Boardgame-DSL/boardgame)
project) in `./dist`, and then run `npm start`. This will start a dev server on
[`localhost:9090`](http://localhost:9090/).

The example projects files are located in `./example`.
