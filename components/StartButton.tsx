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
	}

	public componentDidMount(): void {
		this.waitForInitialized();
		(window as any).boardgame.addEventListener("gameOver", this.onGameOver.bind(this));
	}

	private async waitForInitialized(): Promise<void> {
		await (window as any).boardgame.initialized;
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
		(window as any).boardgame.removeEventListener("gameOver", this.onGameOver.bind(this));
	}

	private startGame(): void {
		(window as any).boardgame.startGame();
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