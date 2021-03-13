import React from "react";
import ReactDOM from "react-dom";
import { GameOverStatus, NotificationArea, StartButton, TurnDisplay } from "../components";
import { SSGDisplay } from "./SSGDisplay";
import "../src";

ReactDOM.render(
	<React.StrictMode>
		<div className="controls">
			<StartButton/>
			<TurnDisplay/>
		</div>
		<GameOverStatus/>
		<SSGDisplay/>
		<NotificationArea/>
	</React.StrictMode>,
	document.querySelector("app")
);
