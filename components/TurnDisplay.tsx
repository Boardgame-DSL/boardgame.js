import React, { Component, ReactNode } from "react";

interface State {
	player: 1 | 2 | null;
}

/**
 * This React component displays whose turn it currently is.
 *
 * It does so in a `div.turn`. The `div` is given an additional class that
 * determine whose turn it it, `player1` and `player2` for the players, and
 * `player-null` when no game is started yet.
 */
export class TurnDisplay extends Component<{}, State> {
	/** @ignore */
	public constructor(props: {}) {
		super(props);

		this.state = {
			player: null,
		};

		this.onTurn = this.onTurn.bind(this);
	}

	/** @ignore */
	public componentDidMount(): void {
		window.boardgame.addEventListener("turn", this.onTurn);
	}
	/** @ignore */
	public componentWillUnmount(): void {
		window.boardgame.removeEventListener("turn", this.onTurn);
	}

	private onTurn(player: 1 | 2): void {
		this.setState({ player });
	}

	/** @ignore */
	public render(): ReactNode {
		if (this.state.player == null) {
			return (
				<div className="turn player-null">
					No game started yet!
				</div>
			);
		}
		else {
			return (
				<div className={`turn player${this.state.player}`}>
					It is player {this.state.player}s turn!
				</div>
			);
		}
	}
}
