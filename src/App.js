import React, {useState} from "react";
import GameMenu from "./components/GameMenu";
import DartScoreSelector from "./components/DartScoreSelector";
import AroundTheClock from "./components/AroundTheClock";

function App() {
  const [showMenu, setShowMenu] = useState(true);
  const [playerNames, setPlayerNames] = useState(['']);
  const [legLength, setLegLength] = useState(0);
  const [setLength, setSetLength] = useState(0);
  const [isDoubleOut, setIsDoubleOut] = useState(false);
  const [gameMode, setGameMode] = useState({})

   const onStartGame = (playerNames, gameMode, legLength, setLength) => {

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

  if (showMenu) return (
      <GameMenu onStartGame={onStartGame} />
  );

  if (gameMode.id === 2) return (
      <AroundTheClock onEndGame={onEndGame}/>
  );

  return (
      <DartScoreSelector playerNames={playerNames} onEndGame={onEndGame} gameMode={gameMode} chosenLegLength={legLength} chosenSetLength={setLength}/>
  );


}

export default App;