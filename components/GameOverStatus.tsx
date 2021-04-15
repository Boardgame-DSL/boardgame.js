import React, { Component, ReactNode } from "react";

interface State {
	isGameOver: boolean;
	victor: null | 1 | 2;
}

/**
 * This React component displays a `div.game-over-status` and reacts to
 * "gameOver" events from Haskell. When a player wins a `p` is rendered inside
 * the containing `div`. The `p`-tag will have a class describing who won,
 * `winner-1`, `winner-2`, or in the case of a draw `winner-null`. When a new
 * game is started the inside of the containing `div` is cleared.
 */
export class GameOverStatus extends Component<{}, State> {
	/** @ignore */
	public constructor(props: {}) {
		super(props);

		this.state = {
			isGameOver: false,
			victor: null,
		};

		this.onGameOver = this.onGameOver.bind(this);
		this.onState = this.onState.bind(this);
	}

	/** @ignore */
	public componentDidMount(): void {
		window.boardgame.addEventListener("gameOver", this.onGameOver);
		window.boardgame.addEventListener("state", this.onState);
	}

	private onGameOver(victor: null | 1 | 2, info: any): void {
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

	/** @ignore */
	public componentWillUnmount(): void {
		window.boardgame.removeEventListener("gameOver", this.onGameOver);
		window.boardgame.removeEventListener("state", this.onState);
	}

	/** @ignore */
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
