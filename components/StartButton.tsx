import React from "react";
import { Component, ReactNode } from "react";

export namespace StartButton {
	export interface Properties {
		/**
		 * The name of the game that this button starts. The default value is
		 * `default`.
		 */
		gameName?: string;
		/**
		 * Should this button start in the "restart" state (`true`), or the
		 * "start" state (`false`).
		 */
		isRestart?: boolean;
	}
}

interface State {
	isInitialized: boolean;
	isRestart: boolean;
}

/**
 * This React components renders a single `button` that when clicked starts the
 * game specified by its {@linkcode StartButton.Properties.gameName | gameName}
 * property.
 */
export class StartButton extends Component<StartButton.Properties, State> {
	private get gameName(): string {
		return this.props.gameName ?? "default";
	}

	/** @ignore */
	public constructor(props: StartButton.Properties) {
		super(props);

		this.state = {
			isInitialized: false,
			isRestart: this.props.isRestart ?? false,
		};

		this.onGameOver = this.onGameOver.bind(this);
	}

	/** @ignore */
	public componentDidMount(): void {
		this.waitForInitialized();
		window.boardgame.addEventListener("gameOver", this.onGameOver);
	}

	private async waitForInitialized(): Promise<void> {
		await window.boardgame.initialized;
		this.setState({
			isInitialized: true,
		});
	}
	private onGameOver(): void {
		this.setState({
			isRestart: false,
		});
	}

	/** @ignore */
	public componentWillUnmount(): void {
		window.boardgame.removeEventListener("gameOver", this.onGameOver);
	}

	private startGame(): void {
		if (this.gameName in window.boardgame.games) {
			window.boardgame.games[this.gameName]();
			this.setState({
				isRestart: true,
			});
		}
	}

	/** @ignore */
	public render(): ReactNode {
		return (
			<button
				disabled={!this.state.isInitialized || !(this.gameName in window.boardgame.games)}
				onClick={this.startGame.bind(this)}
			>
				{this.state.isRestart ? "Restart" : "Start"}
			</button>
		);
	}
}