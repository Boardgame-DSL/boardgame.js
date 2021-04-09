import { ColoredGraphDisplay } from "../components";
import { Node, Edge, Options } from "vis-network/standalone";

type i = [number, number];
type a = null | 1 | 2;
type b = [number, number];

export class HexDisplay extends ColoredGraphDisplay<i, a, b> {
	protected networkOptions(): Options {
		return {
			physics: false,
		};
	}

	protected constructNode(i: i, a: a, highlighted: boolean, ibs: Array<[i, b]>): Node {
		return {
			shape: "hexagon",
			size: highlighted ? 54 : 48,
			color: (a === 1 ? "#0000ff" : a === 2 ? "#ff0000" : "#777777"),
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