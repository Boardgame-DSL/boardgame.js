import { Data, Network, Node, Edge, Options } from "vis-network/standalone";
import React, { Component, createRef, ReactNode, RefObject } from "react";

export type ColoredGraph<i, a, b> = Array<[i, [a, Array<[i, b]>]]>;

export class ColoredGraphDisplay<i, a, b> extends Component<{}, {}> {
	private readonly divRef: RefObject<HTMLDivElement>;
	private network: Network;

	public constructor(props: {}) {
		super(props);

		this.divRef = createRef();

		this.renderGraph = this.renderGraph.bind(this);
	}

	public componentDidMount(): void {
		window.boardgame.addEventListener("state", this.renderGraph);

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
	}

	public componentWillUnmount(): void {
		window.boardgame.removeEventListener("state", this.renderGraph);
	}

	protected networkOptions(): Options {
		return { };
	}

	protected constructNode(i: i, a: a, ibs: Array<[i, b]>): Node {
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
				...this.constructNode(i, a, ibs),
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
	private renderGraph(state: ColoredGraph<i, a, b>): void {
		const graph = this.buildGraph(state);
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
