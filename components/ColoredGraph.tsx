import { Data, DataSet, Network } from "vis-network/standalone";
import React, { Component, createRef, ReactNode, RefObject } from "react";

export type ColoredGraph<i, a, b> = Array<[i, [a, Array<[b, i]>]]>;

export class ColoredGraphDisplay extends Component<{}, {}> {
	private readonly divRef: RefObject<HTMLDivElement>;
	private network: Network;

	public constructor(props: {}) {
		super(props);

		this.divRef = createRef();

		this.renderGraph = this.renderGraph.bind(this);
	}

	public componentDidMount(): void {
		window.boardgame.addEventListener("state", this.renderGraph);

		this.network = new Network(this.divRef.current, {}, {});
	}

	public componentWillUnmount(): void {
		window.boardgame.removeEventListener("state", this.renderGraph);
	}

	private buildGraph(state: ColoredGraph<any, any, any>): Data {
		const nodes = new Array<{ id: string, label: string }>();
		for (const [i, [a, _]] of state) {
			nodes.push({
				id: JSON.stringify(i),
				label: JSON.stringify(a),
			});
		}

		const edges = new Array<{ from: string, label: string, to: string }>();
		for (const [i, [_, neighbours]] of state) {
			for (const [b, n] of neighbours) {
				edges.push({
					from: JSON.stringify(i),
					label: JSON.stringify(b),
					to: JSON.stringify(n),
				});
			}
		}

		return {
			nodes: new DataSet(nodes),
			edges: new DataSet(edges),
		};
	}
	private renderGraph(state: ColoredGraph<any, any, any>): void {
		const graph = this.buildGraph(state);
		this.network.setData(graph);
	}

	public render(): ReactNode {
		return (
			<div ref={this.divRef}/>
		);
	}
}
