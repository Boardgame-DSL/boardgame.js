import React from "react";
import ReactDOM from "react-dom";
import { GameOverStatus, NotificationArea, StartButton, TurnDisplay } from "../components";
import { HexDisplay } from "./HexDisplay";
import { TicTacToeDisplay } from "./TicTacToeDisplay";
import "../src";

ReactDOM.render(
	<React.StrictMode>
		<div className="controls">
			<StartButton gameName="TicTacToe"/>
			<TurnDisplay/>
		</div>
		<GameOverStatus/>
		<TicTacToeDisplay/>
		<NotificationArea/>
	</React.StrictMode>,
	document.querySelector("app")
);
