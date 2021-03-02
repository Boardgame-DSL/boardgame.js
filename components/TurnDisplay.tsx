import React, { Component, ReactNode } from "react";

interface State {
	player: 1 | 2 | null;
}

export class TurnDisplay extends Component<{}, State> {
	public constructor(props: {}) {
		super(props);

		this.state = {
			player: null,
		};

		this.onTurn = this.onTurn.bind(this);
	}

	public componentDidMount(): void {
		window.boardgame.addEventListener("turn", this.onTurn);
	}
	public componentWillUnmount(): void {
		window.boardgame.removeEventListener("turn", this.onTurn);
	}

	private onTurn(player: 1 | 2): void {
		this.setState({ player });
	}

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
