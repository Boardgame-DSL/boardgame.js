import React from "react";
import ReactDOM from "react-dom";
import { MultipleGames, NotificationArea } from "../components";
import { TicTacToeDisplay } from "./TicTacToeDisplay";
import { ArithmeticProgressionGameDisplay } from "./ArithmeticProgressionGameDisplay";
import { HexDisplay } from "./HexDisplay";
import { TicTacToeAlternativeDisplay } from "./TicTacToeAlternativeDisplay";
import "./index.scss";
import "../src";

ReactDOM.render(
	<React.StrictMode>
		<MultipleGames
			games={{
				"TicTacToe": <TicTacToeDisplay/>,
				"Arithmetic Progression Game": <ArithmeticProgressionGameDisplay/>,
				"Hex": <HexDisplay/>,
				"TicTacToe (Alternative Version)": <TicTacToeAlternativeDisplay/>,
			}}
		/>
		<NotificationArea/>
	</React.StrictMode>,
	document.querySelector("app")
);
