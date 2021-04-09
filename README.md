# `boardgame.js`

The frontend glue for [Haskell boardgames](https://github.com/Boardgame-DSL/boardgame)
on the web.

The package is hosted on `npm`, install it with the following command.
```sh
npm install @boardgame-dsl/boardgame
```

You can also directly include the "glue" part of the library from [unpkg](https://unpkg.com/)
with a script tag:
```html
<script src="https://unpkg.com/@boardgame-dsl/boardgame@<version>/index.js"></script>
```

## The Library

The library is almost required when using boardgame WASM.

Import it in the entry file of your project:
```typescript
import "@boardgame-dsl/boardgame";
```
Later access its functions trough the `window.boardgame` object.

It is located in `./src`, `lib.config.js`, run `npm run build-lib` to build.
Output is placed in `./dist/index.js`.

## UI Components

The UI components library can be useful when using boardgame WASM. It includes
some standard components written in [React](https://reactjs.org/).

Import components from the components sub-package.
```typescript
import { ColoredGraphDisplay, ... } from "@boardgame-dsl/boardgame/components";
```

It is located in `./components`, `components.config.js`, run
`npm run build-components` to build. Output is placed in `./dist/components.js`.

## Example

An example project is available. To use it, place `boardgame.js` and
`boardgame.wasm` (output of the Haskell [boardgame](https://github.com/Boardgame-DSL/boardgame)
project) in `./dist-example`, and then run `npm start`. This will start a dev
server on [`localhost:9090`](http://localhost:9090/).

The example projects files are located in `./example`.
