import React from "react";
import ReactDOM from "react-dom";
import { NotificationArea, StartButton, TurnDisplay, ColoredGraphDisplay } from "../components";
import "../src";

ReactDOM.render(
	<React.StrictMode>
		<StartButton/>
		<TurnDisplay/>
		<ColoredGraphDisplay/>
		<NotificationArea/>
	</React.StrictMode>,
	document.querySelector("app")
);
