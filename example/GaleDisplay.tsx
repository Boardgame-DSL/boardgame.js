import { ColoredGraphDisplay } from "../components";
import { Node, Edge, Options } from "vis-network/standalone";

type Position = null | 1 | 2;

type i = number;
type a = [number, number];
type b = [[number, number], Position];

interface Gale {
	start: number;
	goal: number;
	graph: {
		[i: number]: [[], { [ni: number]: Position }]
	};
}

const size = 100;
const nodeSize = 30;
const width = size;
const selectedWidth = 10;
const highlightedWidth = 12.5;

export class GaleDisplay extends ColoredGraphDisplay<i, a, b> {
	private static galeCoordinatesToId1(x: number, y: number): null | [number, number] {
		if (x % 2 === 0 && y % 2 === 0) {
			return [x === 0 ? -1 : x + y * 4 - 2, x === 8 ? -2 : x + y * 4];
		}
		else if (x % 2 === 1 && y % 2 === 1) {
			return [x + (y - 1) * 4 - 1, x + (y - 1) * 4 + 7];
		}
		else {
			return null;
		}
	}
	private static galeCoordinatesToId2(x: number, y: number): null | [number, number] {
		if (x % 2 === 0 && y % 2 === 0) {
			return [y === 0 ? -1 : y + x * 4 - 2, y === 8 ? -2 : y + x * 4];
		}
		else if (x % 2 === 1 && y % 2 === 1) {
			return [y + (x - 1) * 4 - 1, y + (x - 1) * 4 + 7];
		}
		else {
			return null;
		}
	}

	protected updateHighlights(info: Array<[number, number]>): void {
		this.highlights = new Set<string>();
		for (const edgeId of info) {
			let edgeId1 = [edgeId[0], edgeId[1]];
			if (edgeId1[0] > edgeId1[1] || edgeId1[0] === -2) {
				[edgeId1[0], edgeId1[1]] = [edgeId1[1], edgeId1[0]];
			}
			if (edgeId1[0] === -1) {
				edgeId1[0] += 0.02 * (edgeId1[1] / 8);
			}
			else if (edgeId1[1] === -2) {
				edgeId1[1] += 0.02 * ((edgeId1[0] - 6) / 8);
			}
			this.highlights.add(JSON.stringify(edgeId1));

			// Pleas don't look at this
			yLoop: for (let y = 0; y < 9; y++) {
				for (let x = 0; x < 9; x++) {
					const edgeTest = GaleDisplay.galeCoordinatesToId1(x, y);
					if (edgeTest != null && edgeTest[0] === edgeId[0] && edgeTest[1] === edgeId[1]) {
						const edgeId2 = GaleDisplay.galeCoordinatesToId2(x, y);
						edgeId2[0] += 200;
						edgeId2[1] += 200;
						if (y === 0 && x > 0) {
							edgeId2[0] += 0.01 * x;
						}
						else if (y === 8 && x > 0) {
							edgeId2[1] += 0.01 * x;
						}
						this.highlights.add(JSON.stringify(edgeId2));
						break yLoop;
					}
				}
			}
		}
	}

	protected updateState(s: Gale): void {
		const graph = new Map<i, [a, Map<i, b>]>();
		let prevLeft: number = null;
		let prevRight: number = null;
		let prevTop: number = null;
		let prevBottom: number = null;
		for (let y = 0; y < 9; y++) {
			for (let x = 0; x < 9; x++) {
				const edgeId = GaleDisplay.galeCoordinatesToId1(x, y);
				if (edgeId != null) {
					const b: b = [[x, y], s.graph[edgeId[0]][1][edgeId[1]]];

					let edgeId1 = [edgeId[0], edgeId[1]];
					if (x === 0) {
						if (y > 0) {
							edgeId1[0] += 0.01 * y;
						}
						if (prevLeft != null) {
							graph.get(prevLeft)[1].set(edgeId1[0], [null, 1]);
						}
						prevLeft = edgeId1[0];
					}
					else if (x === 8) {
						if (y > 0) {
							edgeId1[1] += 0.01 * y;
						}
						if (prevRight != null) {
							graph.get(prevRight)[1].set(edgeId1[1], [null, 1]);
						}
						prevRight = edgeId1[1];
					}

					const f1: a = y % 2 === 0 ? [x - 1, y] : [x, y - 1];
					const t1: a = y % 2 === 0 ? [x + 1, y] : [x, y + 1];
					const f1Node = graph.get(edgeId1[0]);
					if (f1Node == null) {
						graph.set(
							edgeId1[0],
							[
								f1,
								new Map<i, b>(new Array<[i, b]>([edgeId1[1], b]))
							]
						);
					}
					else {
						f1Node[1].set(edgeId1[1], b);
					}
					if (!graph.has(edgeId1[1])) {
						graph.set(
							edgeId1[1],
							[t1, new Map<i, b>()]
						);
					}

					let edgeId2 = GaleDisplay.galeCoordinatesToId2(x, y);
					edgeId2[0] += 200;
					edgeId2[1] += 200;
					if (y === 0) {
						if (x > 0) {
							edgeId2[0] += 0.01 * x;
						}
						if (prevTop != null) {
							graph.get(prevTop)[1].set(edgeId2[0], [null, 2]);
						}
						prevTop = edgeId2[0];
					}
					else if (y === 8) {
						if (x > 0) {
							edgeId2[1] += 0.01 * x;
						}
						if (prevBottom != null) {
							graph.get(prevBottom)[1].set(edgeId2[1], [null, 2]);
						}
						prevBottom = edgeId2[1];
					}

					const f2: a = y % 2 === 0 ? [x, y - 1] : [x - 1, y];
					const t2: a = y % 2 === 0 ? [x, y + 1] : [x + 1, y];
					const f2Node = graph.get(edgeId2[0]);
					if (f2Node == null) {
						graph.set(
							edgeId2[0],
							[
								f2,
								new Map<i, b>(new Array<[i, b]>([edgeId2[1], b]))
							]
						);
					}
					else {
						f2Node[1].set(edgeId2[1], b);
					}
					if (!graph.has(edgeId2[1])) {
						graph.set(
							edgeId2[1],
							[t2, new Map<i, b>()]
						);
					}
				}
			}
		}

		super.updateState(
			new Array<[i, [a, Map<i, b>]]>(
				...graph.entries()
			).map(([i, [a, bs]]) => [i,
				[a, new Array<[i, b]>(...bs.entries())]
			])
		);
	}

	protected networkOptions(): Options {
		return {
			physics: false,
		};
	}

	protected constructNode(i: i, [x, y]: a, highlighted: boolean, ibs: Array<[i, b]>): Node {
		return {
			borderWidth: 0,
			color: {
				background: y % 2 === 0 ? "#0000ff" : "#ff0000",
			},
			margin: {
				top: nodeSize / 2,
				left: nodeSize / 2,
				right: nodeSize / 2,
				bottom: nodeSize / 2,
			},
			shape: "circle",
			x: x * size,
			y: y * size,
		};
	}
	protected constructEdge(i: i, [x, y]: a, highlighted: boolean, ni: i, [_, b]: b): Edge {
		return {
			color: b === 1 ? "#0000ff" : b === 2 ? "#ff0000" : "rgba(0, 0, 0, 0.0)",
			hidden: !(b == null || (y % 2 === 0 ? b === 1 : b === 2)),
			width: b == null ? width : highlighted ? highlightedWidth : selectedWidth,
		};
	}

	protected onEdgeClicked(i: i, a: a, ni: i, [coord, _]: b): void {
		if (coord != null) {
			window.boardgame.inputMove(coord);
		}
	}
}