import React, { Component, ReactNode } from "react";
import { GameOverStatus } from "./GameOverStatus";
import { StartButton } from "./StartButton";
import { TurnDisplay } from "./TurnDisplay";

export namespace MultipleGames {
	export interface Properties {
		/**
		 * An object map from the names of games (exactly as specified in the
		 * Haskell model) to React components that can display the
		 * corresponding games.
		 */
		games: {
			[name: string]: JSX.Element,
		};
	}
}
interface State {
	isInitialized: boolean,
	activeGame: string | null;
}

/**
 * This React component displays a menu of multiple games, and when one is
 * chosen its component is displayed with the possibility to exit back to the
 * menu.
 *
 * Everything is rendered inside a `div.game`, this `div` gets the `selector`
 * class when on the menu and the `active` class when a game is shown. It also
 * gets the name of the game as a class, all whitespaces (matched by `/\s/`)
 * are replaced with `-` and all other non word characters (matched by `/\W/`)
 * are removed.
 *
 * Games are started as soon as the user clicks their items in the menu.
 * Meaning the games are ready to be played immediately when seen, game can be
 * restarted from within.
 *
 * The main ´div´ contains different things in the two states:
 *
 * When in the `selector` state: If the Haskell model isn't initialized yet, a
 * `p.uninitialized`. Otherwise a `p` with a header, and a `ul` containing a
 * `li > a` for each game is displayed.
 *
 * When in the `active` state: A `div.controls` containing a `button` for
 * exiting back to the menu, {@link StartButton}, and {@link TurnDisplay}. The
 * given React component corresponding to the selected game. And lastly a
 * {@link GameOverStatus}.
 */
export class MultipleGames extends Component<MultipleGames.Properties, State> {
	private static readyStringAsClassName(string: string): string {
		return string.replace(
			/\W/g,
			m => /^\s$/.test(m) ? "-" : ""
		);
	}

	/** @ignore */
	public constructor(props: MultipleGames.Properties) {
		super(props);

		this.state = {
			isInitialized: false,
			activeGame: null,
		};

		this.onInitialized = this.onInitialized.bind(this);
	}

	/** @ignore */
	public componentDidMount(): void {
		window.boardgame.initialized.then(this.onInitialized);
	}

	private onInitialized(): void {
		this.setState({
			isInitialized: true,
		});
	}

	private async startGame(name: string): Promise<void> {
		await this.setState({
			activeGame: name,
		});
		window.boardgame.games[name]();
	}

	/** @ignore */
	public render(): ReactNode {
		if (this.state.activeGame == null) {
			return this.renderSelector();
		}
		else {
			return this.renderGame();
		}
	}
	private renderSelector(): ReactNode {
		return (
			<div className="game selector">
				{
					!this.state.isInitialized ?
						<p className="uninitialized">Loading games...</p> :
						<>
							<p>Select a game</p>
							{this.renderGamesList()}
						</>
				}
			</div>
		);
	}
	private renderGamesList(): ReactNode {
		return (
			<ul>
				{
					Object.keys(this.props.games)
						.filter(n => n in window.boardgame.games)
						.map(n =>
							<li key={n}>
								<a
									onClick={this.startGame.bind(this, n)}
									href="#"
								>{n}</a>
							</li>
						)
				}
			</ul>
		);
	}
	private renderGame(): ReactNode {
		return (
			<div className={`game active ${MultipleGames.readyStringAsClassName(this.state.activeGame)}`}>
				<div className="controls">
					<button
						onClick={() => this.setState({ activeGame: null })}
					>Exit game</button>
					<StartButton
						gameName={this.state.activeGame}
						isRestart={true}
					/>
					<TurnDisplay/>
				</div>
				{this.props.games[this.state.activeGame]}
				<GameOverStatus/>
			</div>
		);
	}
}