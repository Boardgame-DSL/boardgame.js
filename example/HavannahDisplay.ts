import { ColoredGraph, ColoredGraphDisplay } from "../components";
import { Node, Edge, Options } from "vis-network/standalone";

type i = [number, number];
type a = null | 1 | 2;
type b = string;

type Havannah = ColoredGraph<i, a, b>;

export class HavannahDisplay extends ColoredGraphDisplay<i, a, b> {
	protected updateState(s: Havannah): void {
		super.updateState(s);
	}

	protected networkOptions(): Options {
		return {
			physics: false,
		};
	}

	protected constructNode([x, y]: i, a: a, highlighted: boolean, ibs: Array<[i, b]>): Node {
		return {
			shape: "hexagon",
			size: 50,
			color: a === 1 ? "#0000ff" : a === 2 ? "#ff0000" : "#777777",
			x: x * 80,
			y: y * 95 + x * 45,
		};
	}
	protected constructEdge(i: i, a: a, ni: i, b: b): Edge {
		return { };
	}

	protected onNodeClicked(i: i, a: a, ibs: Array<[i, b]>): void {
		window.boardgame.inputMove(i);
	}
}