/**
 * A collection of event listeners for the different events.
 */
const eventListeners = {
	"state": new Array<Function>(),
	"turn": new Array<Function>(),
	"invalidInput": new Array<Function>(),
	"invalidMove": new Array<Function>(),
	"gameOver": new Array<Function>(),
} as const;

/**
 * Calls all listeners of the given event once each.
 * @param eventName The name of the event.
 * @param args      Arguments to be forwarded to the callbacks.
 */
function invoke(eventName: keyof typeof eventListeners, ...args: Array<any>): void {
	eventListeners[eventName].forEach(f => f(...args));
}

let tempReady;

globalThis.boardgame = {
	_putState: (s: any) => invoke("state", s),
	_putTurn: (p: any) => invoke("turn", p),
	_getMove: () => new Promise(r => globalThis.boardgame.inputMove = r),
	_putInvalidInput: () => invoke("invalidInput"),
	_putInvalidMove: () => invoke("invalidMove"),
	_putGameOver: p => invoke("gameOver", p),
	_ready: () => {},

	/**
	 * A Promise that resolves once the Haskell model is ready.
	 */
	initialized: new Promise(r => tempReady = r),
	/**
	 * Adds a function that listens to events from the Haskell model.
	 * @param eventName The event to listen to.
	 * @param f         The callback function.
	 */
	addEventListener: (eventName: keyof typeof eventListeners, f: Function) => eventListeners[eventName].push(f),
	/**
	 * Removes a previously added event listener.
	 * @param eventName The event to listen to.
	 * @param f         The callback function.
	 */
	removeEventListener: (eventName: keyof typeof eventListeners, f: Function) => {
		eventListeners[eventName].splice(eventListeners[eventName].indexOf(f), 1);
	},
	/**
	 * Starts a new game with the Haskell model. Might cancel any current game.
	 */
	startGame: () => { throw new Error("Not initialized yet!"); },
	/**
	 * Sends a move to the Haskell backend.
	 * @param c The "coordinate" of the move.
	 */
	inputMove: (c: any) => { throw new Error("Not initialized yet!"); },
} as const;
globalThis.boardgame._ready = tempReady;
