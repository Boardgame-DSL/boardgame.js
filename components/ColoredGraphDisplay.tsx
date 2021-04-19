import { Data, Network, Node, Edge, Options } from "vis-network/standalone";
import React, { Component, createRef, ReactNode, RefObject } from "react";

/**
 * Type descriptor of the Haskell models `ColoredGraph`.
 * @typeParam i Coordinates for vertices.
 * @typeParam a The type of values on vertices.
 * @typeParam b The type of value on edges.
 */
export interface ColoredGraph<i, a, b> extends Array<[i, [a, Array<[i, b]>]]> { }

export namespace ColoredGraph {
	/**
	 * If the key to the `ColoredGraph` map is a number or a string in the Haskell
	 * backend, Haskell will spit out an object instead of a key-value-list. This
	 * function transforms such objects to key-value-lists.
	 * @typeParam i The type the coordinates for vertices will be transformed into.
	 * @typeParam a The type of value on vertices.
	 * @typeParam b The type of value on edges.
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
	 * @typeParam a The type of value on vertices.
	 * @typeParam b The type of value on edges.
	 * @param map The object given by the Haskell backend.
	 */
	export const mapToKeyValueString: <a, b>(map: ColoredGraphObject<a, b>) => ColoredGraph<string, a, b> =
		mapToKeyValue.bind(null, (k: string) => k);
	/**
	 * If the key to the `ColoredGraph` map is a number in the Haskell backend,
	 * Haskell will spit out an object instead of a key-value-list. This
	 * function transforms such objects to key-value-lists.
	 * @typeParam a The type of value on vertices.
	 * @typeParam b The type of value on edges.
	 * @param map The object given by the Haskell backend.
	 */
	export const mapToKeyValueNumber: <a, b>(map: ColoredGraphObject<a, b>) => ColoredGraph<number, a, b> =
		mapToKeyValue.bind(null, (k: string) => parseFloat(k));
};

type ColoredGraphObject<a, b> = { [key: string]: [a, { [key: string]: b }] };

/**
 * A React component that can display games where the underlying model is (or
 * transformable into) a {@link ColoredGraph}.
 *
 * Extend this component to customize its appearance.
 *
 * It render a single `div.graph-container`. The inside of the `div` is
 * implementation specific and subject to change.
 * @typeParam i The type the coordinates for vertices will be transformed into.
 * @typeParam a The type of value on vertices.
 * @typeParam b The type of value on edges.
 */
export class ColoredGraphDisplay<i, a, b> extends Component<{}, {}> {
	private readonly divRef: RefObject<HTMLDivElement>;
	private network: Network;

	/**
	 * The {@link ColoredGraph} that this component currently displays.
	 */
	protected graph: ColoredGraph<i, a, b>;
	protected highlights: Set<string>;

	/** @ignore */
	public constructor(props: {}) {
		super(props);

		this.divRef = createRef();

		this.onGameOver = this.onGameOver.bind(this);
		this.updateGraph = this.updateGraph.bind(this);
	}

	protected updateHighlights(info: Array<any>): void {
		this.highlights = new Set<string>(info.map(c => JSON.stringify(c)));
	}

	private onGameOver(victor: null | 1 | 2, info: Array<any>): void {
		this.updateHighlights(info);
		this.renderGraph();
	}

	/** @ignore */
	public componentDidMount(): void {
		window.boardgame.addEventListener("state", this.updateGraph);
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
		this.highlights = new Set<string>();
	}

	/** @ignore */
	public componentWillUnmount(): void {
		window.boardgame.removeEventListener("state", this.updateGraph);
		window.boardgame.removeEventListener("gameOver", this.onGameOver);
	}

	/**
	 * Defines options used when defining the network. Override to define
	 * custom options.
	 * @returns For usage details of `Options` see the documentation of
	 *          [vis.js](https://visjs.github.io/vis-network/docs/network/#options).
	 */
	protected networkOptions(): Options {
		return {};
	}

	/**
	 * Updates {@link graph} with the latest model from Haskell.
	 * The default implementation assumes the model is a direct representation
	 * of a {@link ColoredGraph}. In the case of other models, override this
	 * method and transform it into a {@link ColoredGraph}.
	 *
	 * If the Haskell models `i` is `string` or `number`, use
	 * {@link ColoredGraph.mapToKeyValueString} and
	 * {@link ColoredGraph.mapToKeyValueNumber} respectively.
	 * @param s The state received from the Haskell model. Can be anything.
	 */
	protected updateState(s: any): void {
		this.graph = s as ColoredGraph<i, a, b>;
	}

	/**
	 * Defines options for displaying each vertex. Override to customize the
	 * appearance.
	 * @param i           The coordinate of this vertex.
	 * @param a           The value of this vertex.
	 * @param highlighted Indicating whether or not this vertex is part of the
	 *                    winning set.
	 * @param ibs         The outgoing edges, their target coordinates and
	 *                    values, of this vertex.
	 * @returns For usage details of `Node` see the documentation of
	 *          [vis.js](https://visjs.github.io/vis-network/docs/network/nodes.html).
	 */
	protected constructNode(i: i, a: a, highlighted: boolean, ibs: Array<[i, b]>): Node {
		return {
			label: JSON.stringify(a),
		};
	}
	/**
	 * Defines options for displaying each edge. Override to customize the
	 * appearance.
	 * @param i           The coordinate of the "from" vertex.
	 * @param a           The value of the "from" vertex.
	 * @param highlighted Indicating whether or not this edge is part of the
	 *                    winning set.
	 * @param ni          The coordinate of the "to" vertex.
	 * @param b           The value of the edge.
	 * @returns For usage details of `Edge` see the documentation of
	 *          [vis.js](https://visjs.github.io/vis-network/docs/network/edges.html).
	 */
	protected constructEdge(i: i, a: a, highlighted: boolean, ni: i, b: b): Edge {
		return {
			label: JSON.stringify(b),
		};
	}

	/**
	 * Override to define an action to take when the user clicks on a vertex.
	 * Probably some form of interaction with `window.boardgame.inputMove(...)`.
	 * @param i   The coordinate of this vertex.
	 * @param a   The value of this vertex.
	 * @param ibs The outgoing edges, their target coordinates and values, of
	 *            this vertex.
	 */
	protected onNodeClicked(i: i, a: a, ibs: Array<[i, b]>): void { }
	/**
	 * Override to define an action to take when the user clicks on a edge.
	 * Probably some form of interaction with `window.boardgame.inputMove(...)`.
	 * @param i  The coordinate of the "from" vertex.
	 * @param a  The value of the "from" vertex.
	 * @param ni The coordinate of the "to" vertex.
	 * @param b  The value of this edge.
	 */
	protected onEdgeClicked(i: i, a: a, ni: i, b: b): void { }

	private buildGraph(state: ColoredGraph<i, a, b>): Data {
		const nodes = new Array<Node>();
		for (const [i, [a, ibs]] of state) {
			const iStructure = JSON.stringify(i);
			nodes.push({
				...this.constructNode(i, a, this.highlights.has(iStructure), ibs),
				id: iStructure,
				chosen: {
					node: this.onNodeClicked.bind(this, i, a, ibs),
					label: false,
				},
			});
		}

		const edges = new Array<Edge>();
		for (const [i, [a, neighbours]] of state) {
			for (const [ni, b] of neighbours) {
				const bStructure = JSON.stringify([i, ni]);
				edges.push({
					from: JSON.stringify(i),
					to: JSON.stringify(ni),
					chosen: {
						edge: this.onEdgeClicked.bind(this, i, a, ni, b),
						label: false,
					},
					smooth: false,
					...this.constructEdge(i, a, this.highlights.has(bStructure), ni, b),
				});
			}
		}

		this.highlights.clear();

		return {
			nodes,
			edges,
		};
	}
	private updateGraph(s: any): void {
		this.updateState(s);
		this.renderGraph();
	}
	private renderGraph(): void {
		const graph = this.buildGraph(this.graph);
		this.network.setData(graph);
	}

	/** @ignore */
	public render(): ReactNode {
		return (
			<div
				ref={this.divRef}
				className="graph-container"
			/>
		);
	}
}
