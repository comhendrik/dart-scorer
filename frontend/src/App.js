import React, {useState} from "react";
import GameMenu from "./components/GameMenu";
import DartScoreSelector from "./components/DartScoreSelector";
import AroundTheClock from "./components/AroundTheClock";
import Leaderboard from "./components/Leaderboard";
import {Button} from "@tremor/react";
import UserData from "./components/UserData";

function App() {
  const [showMenu, setShowMenu] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [playerNames, setPlayerNames] = useState(['']);
  const [legLength, setLegLength] = useState(0);
  const [setLength, setSetLength] = useState(0);
  const [isDoubleOut, setIsDoubleOut] = useState(false);
  const [gameMode, setGameMode] = useState({})

   const onStartGame = (playerNames, gameMode, legLength, setLength, isDoubleOut) => {

        for (const name of playerNames) {
            if(name === undefined || name === null || name === '') {
               alert("Specify a name for every player")
                return
            }
        }
        setPlayerNames(playerNames)
        setGameMode(gameMode)
        setShowMenu(false)
        setLegLength(legLength)
        setSetLength(setLength)
        setIsDoubleOut(isDoubleOut)
   }

   const onEndGame = () => {
     setShowMenu(true)
   }

   if (showLeaderboard) return (
       <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
           <UserData/>
           <Button onClick={() => setShowLeaderboard(false)}>Back</Button>
       </div>
   );
    if (showMenu) return (
        <div>
            <GameMenu onStartGame={onStartGame}/>
            <Button onClick={() => setShowLeaderboard(true)}>Leaderboard</Button>
        </div>
    );

    if (gameMode.id === 2) return (
        <AroundTheClock onEndGame={onEndGame}/>
    );

    return (
        <DartScoreSelector playerNames={playerNames} onEndGame={onEndGame} gameMode={gameMode}
                           chosenLegLength={legLength} chosenSetLength={setLength} chosenIsDoubleOut={isDoubleOut}/>
    );

}

export default App;

