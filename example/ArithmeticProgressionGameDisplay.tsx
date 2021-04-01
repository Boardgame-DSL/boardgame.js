import React, { Component, ReactNode } from "react";
import "./ArithmeticProgressionGameDisplay.scss";

type Position = null | 1 | 2;

type Positions = ReadonlyArray<Position>;

interface State {
	n: number;
	positions: Positions;
}

export class ArithmeticProgressionGameDisplay extends Component<{}, State> {
	public constructor(props: {}) {
		super(props);

		this.state = {
			n: 0,
			positions: new Array<Position>(),
		};

		this.updateState = this.updateState.bind(this);
	}

	public componentDidMount(): void {
		window.boardgame.addEventListener("state", this.updateState);
	}

	private updateState(s: State): void {
		this.setState(s);
	}

	public componentWillUnmount(): void {
		window.boardgame.removeEventListener("state", this.updateState);
	}

	public render(): ReactNode {
		return (
			<div>
				{
					this.state.positions.map((p, i) =>
						<div
							key={i}
							onClick={() => window.boardgame.inputMove(i + 1)}
						>
							<span className="head">{i + 1}</span>
							<span className={`position ${p}`}>
								{ p == null ? "" : p === 1 ? "🔵" : "❌" }
							</span>
						</div>
					)
				}
			</div>
		);
	}
}