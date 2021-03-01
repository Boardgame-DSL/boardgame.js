import React from "react";
import ReactDOM from "react-dom";
import { NotificationArea, StartButton, TurnDisplay } from "../components";
import "../src";

ReactDOM.render(
	<React.StrictMode>
		<StartButton/>
		<TurnDisplay/>
		<NotificationArea/>
	</React.StrictMode>,
	document.querySelector("app")
);
