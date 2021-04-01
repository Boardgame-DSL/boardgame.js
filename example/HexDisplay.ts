import { ColoredGraph, ColoredGraphDisplay } from "../components";
import { Node, Edge, Options } from "vis-network/standalone";
import "./HexDisplay.scss";

type i = [number, number];
type a = null | 1 | 2;
type b = [number, number];

interface State {
	n: number;
	board: ColoredGraph<i, a, b>;
}

export class HexDisplay extends ColoredGraphDisplay<i, a, b> {
	protected updateState(s: State): void {
		super.updateState(s.board);
	}

	protected networkOptions(): Options {
		return {
			physics: false,
		};
	}

	protected constructNode(i: i, a: a, ibs: Array<[i, b]>): Node {
		return {
			shape: "hexagon",
			size: 50,
			color: a === 1 ? "#0000ff" : a === 2 ? "#ff0000" : "#777777",
			x: i[0] * 80,
			y: i[1] * 95 + i[0] * 45,
		};
	}
	protected constructEdge(i: i, a: a, ni: i, b: b): Edge {
		return { };
	}

	protected onNodeClicked(i: i, a: a, ibs: Array<[i, b]>): void {
		window.boardgame.inputMove(i);
	}
}