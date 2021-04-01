import { ColoredGraph, ColoredGraphDisplay } from "../components";
import { Node, Edge, Options } from "vis-network/standalone";

type i = [number, number];
type a = null | 1 | 2;
type b = [number, number];

interface State {
	k: number;
	board: ColoredGraph<i, a, b>;
}

const size = 100;
const symbolSize = size * 0.9;
const thickness = 15;

export class TicTacToeAlternativeDisplay extends ColoredGraphDisplay<i, a, b> {
	private ctxRender(a: a, { ctx, x, y }: { ctx: CanvasRenderingContext2D, x: number, y: number }): any {
		return {
			drawNode() {
				ctx.fillStyle = "#aaaaaa";
				ctx.fillRect(x - size / 2, y - size / 2, size, size);
				if (a === 1) {
					ctx.strokeStyle = "#0000ff";
					ctx.lineWidth = thickness;
					ctx.beginPath();
					ctx.ellipse(x, y, (symbolSize - thickness) / 2, (symbolSize - thickness) / 2, 0, 0, Math.PI * 2);
					ctx.stroke();
					ctx.closePath();
				}
				else if (a === 2) {
					ctx.strokeStyle = "#ff0000";
					ctx.lineWidth = thickness;
					ctx.beginPath();
					ctx.moveTo(x - (symbolSize - thickness) / 2, y - (symbolSize - thickness) / 2);
					ctx.lineTo(x + (symbolSize - thickness) / 2, y + (symbolSize - thickness) / 2);
					ctx.stroke();
					ctx.beginPath();
					ctx.moveTo(x - (symbolSize - thickness) / 2, y + (symbolSize - thickness) / 2);
					ctx.lineTo(x + (symbolSize - thickness) / 2, y - (symbolSize - thickness) / 2);
					ctx.stroke();
					ctx.closePath();
				}
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

	protected constructNode(i: i, a: a, ibs: Array<[i, b]>): Node & { ctxRenderer: any } {
		return {
			ctxRenderer: this.ctxRender.bind(this, a),
			shape: "custom",
			size: size / 2,
			x: i[0] * size,
			y: i[1] * size,
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