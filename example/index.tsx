import React from "react";
import ReactDOM from "react-dom";
import { MultipleGames, NotificationArea } from "../components";
import { TicTacToeDisplay } from "./TicTacToeDisplay";
import { ArithmeticProgressionGameDisplay } from "./ArithmeticProgressionGameDisplay";
import { ShannonSwitchingGameDisplay } from "./ShannonSwitchingGameDisplay";
import { GaleDisplay } from "./GaleDisplay";
import { HexDisplay } from "./HexDisplay";
import { HavannahDisplay } from "./HavannahDisplay";
import { YavalathDisplay } from "./YavalathDisplay";
import { CrossDisplay } from "./CrossDisplay";
import { TicTacToeAlternativeDisplay } from "./TicTacToeAlternativeDisplay";
import "./index.scss";
import "../src";

ReactDOM.render(
	<React.StrictMode>
		<MultipleGames
			games={{
				"TicTacToe": <TicTacToeDisplay/>,
				"Arithmetic Progression Game": <ArithmeticProgressionGameDisplay/>,
				"Shannon Switching Game": <ShannonSwitchingGameDisplay/>,
				"Gale": <GaleDisplay/>,
				"Hex": <HexDisplay/>,
				"Havannah": <HavannahDisplay/>,
				"Yavalath": <YavalathDisplay/>,
				"Cross": <CrossDisplay/>,
				"Hex (Alternative Version)": <HexDisplay/>,
				"TicTacToe (Alternative Version)": <TicTacToeAlternativeDisplay/>,
			}}
		/>
		<NotificationArea/>
	</React.StrictMode>,
	document.querySelector("app")
);
