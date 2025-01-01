import React, {useState} from "react";
import GameMenu from "./components/GameMenu.tsx";
import DartScoreSelector from "./components/DartScoreSelector.tsx";

function App() {
  const [showMenu, setShowMenu] = useState(true);
  const [playerNames, setPlayerNames] = useState(['']);


  if (showMenu) return (
      <GameMenu />
  );

  return (
      <DartScoreSelector />
  );


}

export default App;