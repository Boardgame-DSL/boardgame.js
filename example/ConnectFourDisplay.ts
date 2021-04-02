import { ColoredGraph, ColoredGraphDisplay } from "../components";
import { Node, Edge, Options } from "vis-network/standalone";

type i = [number, number];
type a = null | 1 | 2;
type b = string;

interface State {
	k: number;
	board: ColoredGraph<i, a, b>;
}

const size = 100;
const margin = 10;
const lineWidth = 2;

export class ConnectFourDisplay extends ColoredGraphDisplay<i, a, b> {
	private ctxRender(a: a, { ctx, x, y }: { ctx: CanvasRenderingContext2D, x: number, y: number }): any {
		return {
			drawNode() {
				ctx.fillStyle = "#aaaaaa";
				ctx.fillRect(x - size / 2, y - size / 2, size, size);
				ctx.strokeStyle = "#707070";
				ctx.lineWidth = lineWidth;
				ctx.strokeRect(x - size / 2, y - size / 2, size, size);
				if (a === 1) {
					ctx.fillStyle = "#0000ff";
				}
				else if (a === 2) {
					ctx.fillStyle = "#ff0000";
				}
				else {
					ctx.fillStyle = "#ffffff";
				}
				ctx.beginPath();
				ctx.ellipse(x, y, (size - margin) / 2, (size - margin) / 2, 0, 0, Math.PI * 2);
				ctx.fill();
				ctx.closePath();
			},
			nodeDimensions: { width: size, height: size },
		};
	}

	protected updateState(s: State): void {
		super.updateState(s.board);
	}

	protected networkOptions(): Options {
		return {
			physics: false,
		};
	}

	protected constructNode([x, y]: i, a: a, ibs: Array<[i, b]>): Node & { ctxRenderer: any } {
		return {
			ctxRenderer: this.ctxRender.bind(this, a),
			shape: "custom",
			size: size / 2,
			x: y * size,
			y: -x * size,
		};
	}
	protected constructEdge(i: i, a: a, ni: i, b: b): Edge {
		return {
			hidden: true,
		};
	}

	protected onNodeClicked(i: i, a: a, ibs: Array<[i, b]>): void {
		window.boardgame.inputMove(i);
	}
}