import React, {useState} from "react";
import GameMenu from "./components/GameMenu.tsx";
import DartScoreSelector from "./components/DartScoreSelector.tsx";

function App() {
  const [showMenu, setShowMenu] = useState(true);
  const [playerNames, setPlayerNames] = useState(['']);


   const onStartGame = (playerNames) => {
     setPlayerNames(playerNames)
     setShowMenu(false)
   }

   const onEndGame = () => {
     setShowMenu(true)
   }

  if (showMenu) return (
      <GameMenu onStartGame={onStartGame} />
  );

  return (
      <DartScoreSelector playerNames={playerNames} onEndGame={onEndGame}/>
  );


}

export default App;