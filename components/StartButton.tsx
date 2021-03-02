import React from "react";
import { Component, ReactNode } from "react";

interface State {
	isInitialized: boolean;
	isRestart: boolean;
}

export class StartButton extends Component<{}, State> {
	public constructor(props: {}) {
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
		window.boardgame.startGame();
		this.setState({
			isRestart: true,
		});
	}

	public render(): ReactNode {
		return (
			<button
				disabled={!this.state.isInitialized}
				onClick={this.startGame.bind(this)}
			>
				{this.state.isRestart ? "Restart" : "Start"}
			</button>
		);
	}
}