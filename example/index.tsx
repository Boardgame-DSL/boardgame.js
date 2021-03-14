import React from "react";
import ReactDOM from "react-dom";
import { MultipleGames, NotificationArea } from "../components";
import { HexDisplay } from "./HexDisplay";
import { TicTacToeDisplay } from "./TicTacToeDisplay";
import "../src";

ReactDOM.render(
	<React.StrictMode>
		<MultipleGames
			games={{
				"Hex": <HexDisplay/>,
				"TicTacToe": <TicTacToeDisplay/>,
			}}
		/>
		<NotificationArea/>
	</React.StrictMode>,
	document.querySelector("app")
);
