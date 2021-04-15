/**
 * This module defines the `window.boardgame` object of type {@link Boardgame}.
 * This object is used by the Haskell model to communicate change, and can be
 * used from the JavaScript runtime to invoke Haskell functions.
 *
 * It is almost required to run Web Assembly boardgames. But you can implement
 * it yourself if you do not want to depend on this library.
 * @module boardgame
 */

/**
 * A collection of event listeners for the different events.
 * @ignore
 */
const eventListeners = {
	"state": new Array<(s: any) => void>(),
	"turn": new Array<(p: 1 | 2) => void>(),
	"invalidInput": new Array<() => void>(),
	"invalidMove": new Array<() => void>(),
	"gameOver": new Array<(p: null | 1 | 2, info: Array<any>) => void>(),
} as const;

/**
 * Calls all listeners of the given event once each.
 * @param eventName The name of the event.
 * @param args      Arguments to be forwarded to the callbacks.
 * @ignore
 */
function invoke<T extends keyof typeof eventListeners>(eventName: T, ...args: Parameters<typeof eventListeners[T][number]>): void {
	eventListeners[eventName].forEach(f => (f as any)(...args));
}

/** @ignore */
let tempReady: () => void;
/** @ignore */
const internalBoardgame = {
	_putState: (s: any) => invoke("state", s),
	_putTurn: (p: 1 | 2) => invoke("turn", p),
	_getMove: () => new Promise(r => (window.boardgame as any).inputMove = r),
	_putInvalidInput: () => invoke("invalidInput"),
	_putInvalidMove: () => invoke("invalidMove"),
	_putGameOver: (p: null | 1 | 2, info: Array<any>) => invoke("gameOver", p, info),
	_ready: () => {},
};
/**
 * The public definition of the `boardgame` object that gets attached to the
 * `window`. I.e. it's accessed via `window.boardgame`.
 */
interface Boardgame {
	/**
	 * A Promise that resolves once the Haskell model is ready.
	 */
	initialized: Promise<void>;
	/**
	 * Adds a function that listens to events from the Haskell model.
	 * @param eventName The event to listen to.
	 * @param f         The callback function.
	 */
	addEventListener<T extends keyof typeof eventListeners>(eventName: T, f: typeof eventListeners[T][number]): void;
	/**
	 * Removes a previously added event listener.
	 * @param eventName The event to listen to.
	 * @param f         The callback function.
	 */
	removeEventListener<T extends keyof typeof eventListeners>(eventName: T, f: typeof eventListeners[T][number]): void;
	/**
	 * A collection of functions used to start games in the Haskell model.
	 */
	games: Readonly<GameCollection>;
	/**
	 * Sends a move to the Haskell model.
	 * @param c The "coordinate" of the move.
	 */
	inputMove(c: any): void;
}
/**
 * An object map from game name to functions that start the games.
 */
interface GameCollection {
	/**
	 * A function that starts the game in the Haskell model.
	 */
	[name: string]: () => void;
}
/** @ignore */
const boardgame: Boardgame = {
	initialized: new Promise<void>(r => tempReady = r),
	addEventListener: <T extends keyof typeof eventListeners>(eventName: T, f: typeof eventListeners[T][number]): void => {
		eventListeners[eventName].push(f as any);
	},
	removeEventListener: <T extends keyof typeof eventListeners>(eventName: T, f: typeof eventListeners[T][number]): void => {
		eventListeners[eventName].splice(eventListeners[eventName].indexOf(f as any), 1);
	},
	games: {} as Readonly<{ [name: string]: () => void }>,
	inputMove: (c: any): void => { throw new Error("Not initialized yet!"); },
};
internalBoardgame._ready = tempReady;

interface Window {
	boardgame: Boardgame;
}
window.boardgame = {
	...internalBoardgame,
	...boardgame,
};