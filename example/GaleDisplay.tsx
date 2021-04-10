import { ColoredGraphDisplay } from "../components";
import { Node, Edge, Options } from "vis-network/standalone";

type Coordinate = [number, number];
type Position = null | 1 | 2;

type i = Coordinate;
type a = void;
type b = [Coordinate, Position];

type Gale = ReadonlyArray<[Coordinate, Position]>;

const size = 100;
const nodeSize = 30;
const width = size;
const selectedWidth = 10;
const highlightedWidth = 12.5;

export class GaleDisplay extends ColoredGraphDisplay<i, a, b> {
	protected updateState(s: Gale): void {
		const graph = new Map<string, [a, Array<[string, b]>]>();
		function addEdge(from: Coordinate, to: Coordinate, b: b): Coordinate {
			const fromKey = JSON.stringify(from);
			const toKey = JSON.stringify(to);

			const node = graph.get(fromKey);
			if (node == null) {
				graph.set(
					fromKey,
					[
						null,
						new Array<[string, b]>([toKey, b])
					]
				);
			}
			else {
				node[1].push([toKey, b]);
			}

			if (!graph.has(toKey)) {
				graph.set(
					toKey,
					[
						null,
						new Array<[string, b]>()
					]
				);
			}

			return to;
		}
		function addP1Edge(coordX: number, y: number, b: b): Coordinate {
			return addEdge(
				[coordX + (y % 2), y - (y % 2)],
				[coordX + 2 - (y % 2), y + (y % 2)],
				b
			);
		}
		function addP2Edge(coordX: number, y: number, b: b): Coordinate {
			return addEdge(
				[coordX + (1 - (y % 2)), y - (1 - (y % 2))],
				[coordX + (1 - (y % 2)) + (y % 2) * 2, y + (1 - (y % 2))],
				b
			);
		}

		let p1Max: Coordinate = [0, 0];
		let p2Max: Coordinate = [-1, -1];
		for (const [[x, y], v] of s) {
			const coordX = x * 2 + (y % 2);
			const b: b = [[coordX, y], v];

			const p1Coord = addP1Edge(coordX, y, b);
			p1Max = [Math.max(p1Max[0], p1Coord[0]), Math.max(p1Max[1], p1Coord[1])];

			const p2Coord = addP2Edge(coordX, y, b);
			p2Max = [Math.max(p2Max[0], p2Coord[0]), Math.max(p2Max[1], p2Coord[1])];
		}

		for (let y = 0; y < p1Max[1]; y += 2) {
			for (const x of [0, p1Max[0]]) {
				const fromKey = JSON.stringify([x, y]);
				const toKey = JSON.stringify([x, y + 2]);
				graph.get(fromKey)[1].push([toKey, [[-1, -1], 1]]);
			}
		}

		for (let x = 1; x < p2Max[0]; x += 2) {
			for (const y of [-1, p2Max[1]]) {
				const fromKey = JSON.stringify([x, y]);
				const toKey = JSON.stringify([x + 2, y]);
				graph.get(fromKey)[1].push([toKey, [[-1, -1], 2]]);
			}
		}

		super.updateState(new Array<[string, [a, Array<[string, b]>]]>(
			...graph.entries()
		).map(([k, [a, ibs]]) => [JSON.parse(k), [a, ibs.map(([i, b]) => [JSON.parse(i), b])]]));
	}

	protected networkOptions(): Options {
		return {
			physics: false,
		};
	}

	protected constructNode([x, y]: i, a: a, highlighted: boolean, ibs: Array<[i, b]>): Node {
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
	protected constructEdge([x, y]: i, a: a, highlighted: boolean, [nX, nY]: i, [[cX, cY], b]: b): Edge {
		return {
			color: b === 1 ? "#0000ff" : b === 2 ? "#ff0000" : "rgba(0, 0, 0, 0.0)",
			hidden: !(b == null || (y % 2 === 0 ? b === 1 : b === 2)),
			width: b == null ? width : highlighted ? highlightedWidth : selectedWidth,
		};
	}

	protected onEdgeClicked(i: i, a: a, ni: i, [coord, _]: b): void {
		window.boardgame.inputMove(coord);
	}
}