import React, {useState} from "react";
import GameMenu from "./components/GameMenu";
import DartScoreSelector from "./components/DartScoreSelector";

function App() {
  const [showMenu, setShowMenu] = useState(true);
  const [playerNames, setPlayerNames] = useState(['']);
  const [gameMode, setGameMode] = useState({})

   const onStartGame = (playerNames, gameMode) => {
       setPlayerNames(playerNames)
       setGameMode(gameMode)
       setShowMenu(false)
   }

   const onEndGame = () => {
     setShowMenu(true)
   }

  if (showMenu) return (
      <GameMenu onStartGame={onStartGame} />
  );

  if (gameMode.id === 2) return (
      <div>ATC Mode under development, Please reload</div>
  );

  return (
      <DartScoreSelector playerNames={playerNames} onEndGame={onEndGame} gameMode={gameMode}/>
  );


}

export default App;