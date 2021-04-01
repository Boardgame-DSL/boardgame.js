import React, { Component, ReactNode } from "react";
import "./TicTacToeDisplay.scss";

type Position = null | 1 | 2;

type Board = ReadonlyArray<ReadonlyArray<Position>>;

interface State {
	board: Board;
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
		};

		this.updateState = this.updateState.bind(this);
	}

	public componentDidMount(): void {
		window.boardgame.addEventListener("state", this.updateState);
	}

	private updateState(s: Board): void {
		this.setState({
			board: s,
		});
	}

	public componentWillUnmount(): void {
		window.boardgame.removeEventListener("state", this.updateState);
	}

	public render(): ReactNode {
		return (
			<table>
				<tbody>
					{
						this.state.board.map((row, y) =>
							<tr key={y}>
								{
									row.map((p, x) =>
										<td
											key={x}
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