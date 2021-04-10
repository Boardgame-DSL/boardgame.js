import React, { Component, ReactNode } from "react";
import "./ArithmeticProgressionGameDisplay.scss";

type Position = null | 1 | 2;

type Positions = ReadonlyArray<Position>;

interface Model {
	n: number;
	positions: Positions;
}
interface State extends Model {
	highlighted: ReadonlySet<number>;
}

export class ArithmeticProgressionGameDisplay extends Component<{}, State> {
	public constructor(props: {}) {
		super(props);

		this.state = {
			n: 0,
			positions: new Array<Position>(),
			highlighted: new Set<number>(),
		};

		this.updateState = this.updateState.bind(this);
		this.onGameOver = this.onGameOver.bind(this);
	}

	public componentDidMount(): void {
		window.boardgame.addEventListener("state", this.updateState);
		window.boardgame.addEventListener("gameOver", this.onGameOver);
	}

	private updateState(s: Model): void {
		this.setState({
			...s,
			highlighted: new Set<number>(),
		});
	}

	private onGameOver(victor: null | 1 | 2, info: Array<number>): void {
		this.setState({
			highlighted: new Set<number>(info),
		});
	}

	public componentWillUnmount(): void {
		window.boardgame.removeEventListener("state", this.updateState);
		window.boardgame.removeEventListener("gameOver", this.onGameOver);
	}

	public render(): ReactNode {
		return (
			<div className={`gameHolder ${this.state.highlighted.size > 0 ? "gameOver" : null}`}>
				{
					this.state.positions.map((p, i) =>
						<div
							key={i}
							className={this.state.highlighted.has(i + 1) ? "highlighted" : null}
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