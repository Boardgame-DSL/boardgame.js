import { Data, Network, Node, Edge, Options } from "vis-network/standalone";
import React, { Component, createRef, ReactNode, RefObject } from "react";

export interface ColoredGraph<i, a, b> extends Array<[i, [a, Array<[i, b]>]]> { }

type ColoredGraphObject<a, b> = { [key: string]: [a, { [key: string]: b }] };

/**
 * If the key to the `ColoredGraph` map is a number or a string in the Haskell
 * backend, Haskell will spit out an object instead of a key-value-list. This
 * function transforms such objects to key-value-lists.
 * @param keyTransformer A function that transforms `string`s into `i`s.
 * @param map            The object given by the Haskell backend.
 */
function mapToKeyValue<i, a, b>(keyTransformer: (key: string) => i, map: ColoredGraphObject<a, b>): ColoredGraph<i, a, b> {
	return Object.entries(map)
		.map(([i, [a, edges]]) => [
			keyTransformer(i),
			[
				a,
				Object.entries(edges)
					.map(([i, b]) => [keyTransformer(i), b])
			]
		]);
}
/**
 * If the key to the `ColoredGraph` map is a string in the Haskell backend,
 * Haskell will spit out an object instead of a key-value-list. This
 * function transforms such objects to key-value-lists.
 * @param map The object given by the Haskell backend.
 */
const mapToKeyValueString: <i, a, b>(map: ColoredGraphObject<a, b>) => ColoredGraph<i, a, b> =
	mapToKeyValue.bind(null, (k: string) => k);
/**
 * If the key to the `ColoredGraph` map is a number in the Haskell backend,
 * Haskell will spit out an object instead of a key-value-list. This
 * function transforms such objects to key-value-lists.
 * @param map The object given by the Haskell backend.
 */
const mapToKeyValueNumber: <i, a, b>(map: ColoredGraphObject<a, b>) => ColoredGraph<i, a, b> =
	mapToKeyValue.bind(null, (k: string) => parseFloat(k));
export const ColoredGraph = {
	mapToKeyValueString,
	mapToKeyValueNumber,
};

export class ColoredGraphDisplay<i, a, b> extends Component<{}, {}> {
	private readonly divRef: RefObject<HTMLDivElement>;
	private network: Network;
	private highlights: Array<i>;

	protected graph: ColoredGraph<i, a, b>;

	public constructor(props: {}) {
		super(props);

		this.divRef = createRef();

		this.onGameOver = this.onGameOver.bind(this);
		this.renderGraph = this.renderGraph.bind(this);
	}

	private onGameOver(victor: null | 1 | 2, info: Array<any>): void {
		this.highlights = info;
		this.renderGraph(this.graph);
	}

	public componentDidMount(): void {
		window.boardgame.addEventListener("state", this.renderGraph);
		window.boardgame.addEventListener("gameOver", this.onGameOver);

		this.network = new Network(
			this.divRef.current,
			{},
			{
				physics: {
					repulsion: {
						centralGravity: 0.0,
					},
					solver: "repulsion",
				},
				...this.networkOptions(),
				interaction: {
					dragNodes: false,
					dragView: false,
					zoomView: false,
				},
			}
		);
		this.highlights = new Array();
	}

	public componentWillUnmount(): void {
		window.boardgame.removeEventListener("state", this.renderGraph);
		window.boardgame.removeEventListener("gameOver", this.onGameOver);
	}

	protected networkOptions(): Options {
		return { };
	}

	protected updateState(s: any): void {
		this.graph = s as ColoredGraph<i, a, b>;
	}

	protected constructNode(i: i, a: a, highlighted: boolean, ibs: Array<[i, b]>): Node {
		return {
			label: JSON.stringify(a),
		};
	}
	protected constructEdge(i: i, a: a, ni: i, b: b): Edge {
		return {
			label: JSON.stringify(b),
		};
	}

	protected onNodeClicked(i: i, a: a, ibs: Array<[i, b]>): void { }
	protected onEdgeClicked(i: i, a: a, ni: i, b: b): void { }

	private buildGraph(state: ColoredGraph<i, a, b>): Data {
		let isFirst = true;
		const nodes = new Array<Node>();
		for (const [i, [a, ibs]] of state) {
			nodes.push({
				...this.constructNode(i, a, this.highlights.some(x => JSON.stringify(x) === JSON.stringify(i)), ibs),
				id: JSON.stringify(i),
				chosen: {
					node: this.onNodeClicked.bind(this, i, a, ibs),
					label: false,
				},
				...(isFirst ? {
					x: 0,
					y: 0,
				} : {})
			});
			isFirst = false;
		}

		const edges = new Array<Edge>();
		for (const [i, [a, neighbours]] of state) {
			for (const [ni, b] of neighbours) {
				edges.push({
					...this.constructEdge(i, a, ni, b),
					from: JSON.stringify(i),
					to: JSON.stringify(ni),
					chosen: {
						edge: this.onEdgeClicked.bind(this, i, a, ni, b),
						label: false,
					}
				});
			}
		}

		return {
			nodes,
			edges,
		};
	}
	private renderGraph(s: any): void {
		this.updateState(s);
		const graph = this.buildGraph(this.graph);
		this.network.setData(graph);
	}

	public render(): ReactNode {
		return (
			<div
				ref={this.divRef}
				className="graph-container"
			/>
		);
	}
}
