import React from "react";
import ReactDOM from "react-dom";
import { MultipleGames, NotificationArea } from "../components";
import { HexDisplay } from "./HexDisplay";
import { TicTacToeAlternativeDisplay } from "./TicTacToeAlternativeDisplay";
import "../src";

ReactDOM.render(
	<React.StrictMode>
		<MultipleGames
			games={{
				"Hex": <HexDisplay/>,
				"TicTacToe (Alternative Version)": <TicTacToeAlternativeDisplay/>,
			}}
		/>
		<NotificationArea/>
	</React.StrictMode>,
	document.querySelector("app")
);
