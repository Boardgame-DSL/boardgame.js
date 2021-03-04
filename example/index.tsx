import React from "react";
import ReactDOM from "react-dom";
import { GameOverStatus, NotificationArea, StartButton, TurnDisplay } from "../components";
import { HexDisplay } from "./HexDisplay";
import "../src";

ReactDOM.render(
	<React.StrictMode>
		<div className="controls">
			<StartButton/>
			<TurnDisplay/>
		</div>
		<GameOverStatus/>
		<HexDisplay/>
		<NotificationArea/>
	</React.StrictMode>,
	document.querySelector("app")
);
