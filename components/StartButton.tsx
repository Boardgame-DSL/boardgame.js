import React from "react";
import { Component, ReactNode } from "react";

export interface Properties {
	gameName?: string;
}

interface State {
	isInitialized: boolean;
	isRestart: boolean;
}

export class StartButton extends Component<Properties, State> {
	private get gameName(): string {
		return this.props.gameName ?? "default";
	}

	public constructor(props: Properties) {
		super(props);

		this.state = {
			isInitialized: false,
			isRestart: false,
		};

		this.onGameOver = this.onGameOver.bind(this);
	}

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