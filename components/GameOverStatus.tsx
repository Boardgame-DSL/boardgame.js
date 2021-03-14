import React, { Component, ReactNode } from "react";

interface State {
	isGameOver: boolean;
	victor: null | 1 | 2;
}

export class GameOverStatus extends Component<{}, State> {
	public constructor(props: {}) {
		super(props);

		this.state = {
			isGameOver: false,
			victor: null,
		};

		this.onGameOver = this.onGameOver.bind(this);
		this.onState = this.onState.bind(this);
	}

	public componentDidMount(): void {
		window.boardgame.addEventListener("gameOver", this.onGameOver);
		window.boardgame.addEventListener("state", this.onState);
	}

	private onGameOver(victor: null | 1 | 2): void {
		this.setState({
			isGameOver: true,
			victor,
		});
	}

	private onState(): void {
		this.setState({
			isGameOver: false,
		});
	}

	public componentWillUnmount(): void {
		window.boardgame.removeEventListener("gameOver", this.onGameOver);
		window.boardgame.removeEventListener("state", this.onState);
	}

	public render(): ReactNode {
		return (
			<div className="game-over-status">
				{
					!this.state.isGameOver ? null :
					<p className={`victor-${this.state.victor}`}>
						{
							this.state.victor == null ?
								"It's a draw 😕" :
								`Player ${this.state.victor} won!`
						}
					</p>
				}
			</div>
		);
	}
}
