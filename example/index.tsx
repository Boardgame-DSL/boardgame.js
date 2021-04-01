import React from "react";
import ReactDOM from "react-dom";
import { MultipleGames, NotificationArea } from "../components";
import { TicTacToeDisplay } from "./TicTacToeDisplay";
import { HexDisplay } from "./HexDisplay";
import { TicTacToeAlternativeDisplay } from "./TicTacToeAlternativeDisplay";
import "./index.scss";
import "../src";

ReactDOM.render(
	<React.StrictMode>
		<MultipleGames
			games={{
				"TicTacToe": <TicTacToeDisplay/>,
				"Hex": <HexDisplay/>,
				"TicTacToe (Alternative Version)": <TicTacToeAlternativeDisplay/>,
			}}
		/>
		<NotificationArea/>
	</React.StrictMode>,
	document.querySelector("app")
);
