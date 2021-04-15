/**
 * This module contains React components that can be use to quickly build a UI
 * for boardgames. To reduce bloat, this module is not included unless
 * specified.
 *
 * Most components (such as {@link TurnDisplay}, {@link StartButton},
 * {@link NotificationArea}, {@link GameOverStatus}, and {@link MultipleGames})
 * are independent of game model implementation. However,
 * {@link ColoredGraphDisplay} is meant specifically for games implemented with
 * a `ColoredGraph`. This component can display such games in an almost
 * playable state without any configuration, and with configuration it can even
 * look pretty.
 * @module boardgame/components
 */
export { TurnDisplay } from "./TurnDisplay";
export { StartButton } from "./StartButton";
export { NotificationArea } from "./NotificationArea";
export { ColoredGraph, ColoredGraphDisplay } from "./ColoredGraphDisplay";
export { GameOverStatus } from "./GameOverStatus";
export { MultipleGames } from "./MultipleGames";
