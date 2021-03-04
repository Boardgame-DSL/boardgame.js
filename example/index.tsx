import React from "react";
import ReactDOM from "react-dom";
import { NotificationArea, StartButton, TurnDisplay } from "../components";
import { HexDisplay } from "./HexDisplay";
import "../src";

ReactDOM.render(
	<React.StrictMode>
		<StartButton/>
		<TurnDisplay/>
		<HexDisplay/>
		<NotificationArea/>
	</React.StrictMode>,
	document.querySelector("app")
);
