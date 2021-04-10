import React, { Component, ReactNode } from "react";
import "./TicTacToeDisplay.scss";

type Position = null | 1 | 2;

type Board = ReadonlyArray<ReadonlyArray<Position>>;

interface State {
	board: Board;
	highlighted: ReadonlySet<string>;
}

export class TicTacToeDisplay extends Component<{}, State> {
	public constructor(props: {}) {
		super(props);

		this.state = {
			board: new Array<ReadonlyArray<Position>>(
				new Array<Position>( null, null, null ),
				new Array<Position>( null, null, null ),
				new Array<Position>( null, null, null ),
			),
			highlighted: new Set<string>(),
		};

		this.updateState = this.updateState.bind(this);
		this.onGameOver = this.onGameOver.bind(this);
	}

	public componentDidMount(): void {
		window.boardgame.addEventListener("state", this.updateState);
		window.boardgame.addEventListener("gameOver", this.onGameOver);
	}

	private updateState(s: Board): void {
		this.setState({
			board: s,
			highlighted: new Set<string>(),
		});
	}

	private onGameOver(victor: null | 1 | 2, info: Array<[number, number]>): void {
		this.setState({
			highlighted: new Set<string>(info.map(c => JSON.stringify(c))),
		});
	}

	public componentWillUnmount(): void {
		window.boardgame.removeEventListener("state", this.updateState);
		window.boardgame.removeEventListener("gameOver", this.onGameOver);
	}

	public render(): ReactNode {
		return (
			<table className={this.state.highlighted.size > 0 ? "gameOver" : null}>
				<tbody>
					{
						this.state.board.map((row, y) =>
							<tr key={y}>
								{
									row.map((p, x) =>
										<td
											key={x}
											className={this.state.highlighted.has(JSON.stringify([x, y])) ? "highlighted" : null}
											onClick={() => window.boardgame.inputMove([x, y])}
										>
										{ p == null ? "🔲" : p === 1 ? "🔵" : "❌" }
										</td>
									)
								}
							</tr>
						)
					}
				</tbody>
			</table>
		);
	}
}