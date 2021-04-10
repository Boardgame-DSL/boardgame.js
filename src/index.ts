/**
 * A collection of event listeners for the different events.
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
 */
function invoke<T extends keyof typeof eventListeners>(eventName: T, ...args: Parameters<typeof eventListeners[T][number]>): void {
	eventListeners[eventName].forEach(f => (f as any)(...args));
}

let tempReady: () => void;
const internalBoardgame = {
	_putState: (s: any) => invoke("state", s),
	_putTurn: (p: 1 | 2) => invoke("turn", p),
	_getMove: () => new Promise(r => (window.boardgame as any).inputMove = r),
	_putInvalidInput: () => invoke("invalidInput"),
	_putInvalidMove: () => invoke("invalidMove"),
	_putGameOver: (p: null | 1 | 2, info: Array<any>) => invoke("gameOver", p, info),
	_ready: () => {},
};
const boardgame = {
	/**
	 * A Promise that resolves once the Haskell model is ready.
	 */
	initialized: new Promise<void>(r => tempReady = r),
	/**
	 * Adds a function that listens to events from the Haskell model.
	 * @param eventName The event to listen to.
	 * @param f         The callback function.
	 */
	addEventListener: <T extends keyof typeof eventListeners>(eventName: T, f: typeof eventListeners[T][number]): void => {
		eventListeners[eventName].push(f as any);
	},
	/**
	 * Removes a previously added event listener.
	 * @param eventName The event to listen to.
	 * @param f         The callback function.
	 */
	removeEventListener: <T extends keyof typeof eventListeners>(eventName: T, f: typeof eventListeners[T][number]): void => {
		eventListeners[eventName].splice(eventListeners[eventName].indexOf(f as any), 1);
	},
	/**
	 * A collection of functions used to start games in the Haskell backend.
	 */
	games: {} as Readonly<{ [name: string]: () => void }>,
	/**
	 * Sends a move to the Haskell backend.
	 * @param c The "coordinate" of the move.
	 */
	inputMove: (c: any): void => { throw new Error("Not initialized yet!"); },
} as const;
internalBoardgame._ready = tempReady;

export {};
declare global {
	interface Window {
		boardgame: typeof boardgame;
	}
}
window.boardgame = {
	...internalBoardgame,
	...boardgame,
};