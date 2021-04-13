import { ColoredGraph, ColoredGraphDisplay } from "../components";
import { Node, Edge } from "vis-network/standalone";

type i = number;
type a = [];
type b = null | 1 | 2;

interface SSG {
	start: i;
	goal: i;
	graph: {
		[i: number]: [[], { [i: number]: b }]
	};
}

const nodeSize = 30;
const width = 10;
const highlightedWidth = 12.5;
const cutGap = 20;
const cutWidth = 5;

export class ShannonSwitchingGameCGDisplay extends ColoredGraphDisplay<i, a, b> {
	private start: i;
	private goal: i;

	protected updateState(s: SSG): void {
		this.start = s.start;
		this.goal = s.goal;
		this.graph = ColoredGraph.mapToKeyValueNumber(s.graph);
	}

	protected constructNode(i: i, a: a, highlighted: boolean, bis: Array<[i, b]>): Node {
		return {
			borderWidth: width,
			color: {
				border: i === this.start || i === this.goal ? "#ffd700" :
					bis.some(([_, b]) => b === 1) ? "#0000ff" : "#000000",
				background: "#ffffff",
			},
			margin: {
				top: nodeSize / 2,
				left: nodeSize / 2,
				right: nodeSize / 2,
				bottom: nodeSize / 2,
			},
			shape: "circle",
		};
	}

	protected constructEdge(i: i, a: a, highlighted: boolean, ni: i, b: b): Edge {
		return {
			color: b === 1 ? "#0000ff" : b === 2 ? "#ff0000" : "#000000",
			dashes: b !== 2 ? false : [width, cutGap],
			hidden: i > ni,
			width: highlighted ? highlightedWidth : b !== 2 ? width : cutWidth,
			smooth: true
		};
	}

	protected onEdgeClicked(i: i, a: a, ni: i, b: b): void {
		window.boardgame.inputMove([i, ni]);
	}
}