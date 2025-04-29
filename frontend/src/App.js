import React, { useState, useEffect } from "react";
import GameMenu from "./components/GameMenu";
import DartScoreSelector from "./components/DartScoreSelector";
import AroundTheClock from "./components/AroundTheClock";
import UserData from "./components/UserData";
import LandingPage from "components/LandingPage";
import { userService } from 'service/UserService';

function App() {
  const [showMenu, setShowMenu] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerNames, setPlayerNames] = useState([""]);
  const [legLength, setLegLength] = useState(0);
  const [setLength, setSetLength] = useState(0);
  const [isDoubleOut, setIsDoubleOut] = useState(false);
  const [gameMode, setGameMode] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const handleUserChange = (user) => {
      setIsLoading(true);
      if (user) setIsLoggedIn(true);
      else setIsLoggedIn(false);
      setIsLoading(false);
    };

    userService.subscribe(handleUserChange);

    // Cleanup on unmount
    return () => {
      userService.unsubscribe(handleUserChange);
    };
  }, []);

  if (isLoading) {
    return "Loading";
  }

  // 🔒 Redirect to LandingPage if not logged in
  if (!isLoggedIn) {
    return <LandingPage />;
  }

  const onStartGame = (
    playerNames,
    gameMode,
    legLength,
    setLength,
    isDoubleOut
  ) => {
    for (const name of playerNames) {
      if (!name) {
        alert("Specify a name for every player");
        return;
      }
    }
    setPlayerNames(playerNames);
    setGameMode(gameMode);
    setShowMenu(false);
    setLegLength(legLength);
    setSetLength(setLength);
    setIsDoubleOut(isDoubleOut);
  };

  const onEndGame = () => {
    setShowMenu(true);
  };

  if (showLeaderboard)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
        <UserData setShowLeaderboard={setShowLeaderboard} />
      </div>
    );

  if (showMenu)
    return (
      <div>
        <GameMenu
          onStartGame={onStartGame}
          setShowLeaderBoard={setShowLeaderboard}
        />
      </div>
    );

  if (gameMode.id === 2) {
    return <AroundTheClock onEndGame={onEndGame} />;
  }

  return (
    <DartScoreSelector
      playerNames={playerNames}
      onEndGame={onEndGame}
      gameMode={gameMode}
      chosenLegLength={legLength}
      chosenSetLength={setLength}
      chosenIsDoubleOut={isDoubleOut}
    />
  );
}

export default App;
