import React, { Component, ReactNode } from "react";
import { GameOverStatus } from "./GameOverStatus";
import { StartButton } from "./StartButton";
import { TurnDisplay } from "./TurnDisplay";

export interface Properties {
	games: {
		[name: string]: JSX.Element,
	};
}
interface State {
	isInitialized: boolean,
	activeGame: string | null;
}

export class MultipleGames extends Component<Properties, State> {
	private static readyStringAsClassName(string: string): string {
		return string.replace(
			/\W/g,
			m => /^\s$/.test(m) ? "-" : ""
		);
	}

	public constructor(props: Properties) {
		super(props);

		this.state = {
			isInitialized: false,
			activeGame: null,
		};

		this.onInitialized = this.onInitialized.bind(this);
	}

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