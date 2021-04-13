import { ColoredGraphDisplay } from "../components";
import { Node, Edge, Options } from "vis-network/standalone";

type i = number;
type a = void;
type b = null | 1 | 2;

interface State {
	n: number;
	positions: ReadonlyArray<[[i, i], b]>;
}

const size = 150;
const nodeSize = 30;
const width = 10;
const highlightedWidth = 12.5;

export class ShannonSwitchingGameDisplay extends ColoredGraphDisplay<i, a, b> {
	private n: number = 0;

	protected updateState(s: State): void {
		this.n = s.n;

		const graph = new Map<i, [a, Array<[i, b]>]>();
		for (const [[f, t], b] of s.positions) {
			const node = graph.get(f);
			if (node == null) {
				graph.set(
					f,
					[
						null,
						new Array<[i, b]>([t, b])
					]
				);
			}
			else {
				node[1].push([t, b]);
			}
			if (!graph.has(t)) {
				graph.set(
					t,
					[
						null,
						new Array<[i, b]>()
					]
				);
			}
		}

		super.updateState(new Array<[i, [a, Array<[i, b]>]]>(...graph.entries()));
	}

	protected networkOptions(): Options {
		return {
			physics: false,
		};
	}

	protected constructNode(i: i, a: a, highlighted: boolean, ibs: Array<[i, b]>): Node {
		return {
			borderWidth: width,
			color: {
				border: i === 0 || i === this.n * this.n - 1 ? "#0000ff" :
					i === this.n - 1 || i === this.n * (this.n - 1) ? "#ff0000" : "#000000",
				background: "#ffffff",
			},
			margin: {
				top: nodeSize / 2,
				left: nodeSize / 2,
				right: nodeSize / 2,
				bottom: nodeSize / 2,
			},
			shape: "circle",
			x: (i % this.n) * size,
			y: (Math.floor(i / this.n)) * size,
		};
	}

	protected constructEdge(i: i, a: a, highlighted: boolean, ni: i, b: b): Edge {
		return {
			color: b === 1 ? "#0000ff" : b === 2 ? "#ff0000" : "#000000",
			width: highlighted ? highlightedWidth : width,
			smooth: true
		};
	}

	protected onEdgeClicked(i: i, a: a, ni: i, b: b): void {
		window.boardgame.inputMove([i, ni]);
	}
}