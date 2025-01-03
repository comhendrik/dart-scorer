import React, {useEffect, useState} from "react";
import { Card, Title, Button, Subtitle } from "@tremor/react";

function DartScoreSelector({playerNames, onEndGame, gameMode}) {
    const [startedGame, setStartedGame] = useState(false); // State for Double
    const [legs, setLegs] = useState([]);
    const [scoresToZero, setScoresToZero] = useState([]);
    const [averages, setAverages] = useState([]);
    const [averagesCount, setAveragesCount] = useState([]);
    const [scores, setScores] = useState([]);
    const [currentStartingScore, setCurrentStartingScore] = useState(301);
    const [isDouble, setIsDouble] = useState(false); // State for Double
    const [isTriple, setIsTriple] = useState(false); // State for Triple
    const [currentScoreIndex, setCurrentScoreIndex] = useState(0);
    const [dartsThrown, setDartsThrown] = useState([]);

    const dartScores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // Dart score values


    useEffect(() => {
        if(startedGame) return;
        setScores(Array(playerNames.length).fill(gameMode.count))
        setAverages(Array(playerNames.length).fill(0))
        setLegs(Array(playerNames.length).fill(0))
        setAveragesCount(Array(playerNames.length).fill(0))
        setStartedGame(true)
    }, [playerNames.length, startedGame, gameMode]);
    const handleDartSelection = (dartScore) => {
        if (dartsThrown.length === 3) return
        if (scores[currentScoreIndex] <= 0) return
        let finalScore = dartScore;

        // Apply Double or Triple multiplier based on state
        if(!(dartScore === 50 || dartScore === 25)) {
            if (isDouble) {
                finalScore = dartScore * 2;
            } else if (isTriple) {
                finalScore = dartScore * 3;
            }
        }


        calculatePossibleScoresToZero(scores[currentScoreIndex] - finalScore);
        setScores((prevScores) => {
            const newScores = [...prevScores];
            newScores[currentScoreIndex] -= finalScore;
            return newScores;
        });

        setDartsThrown((prevScores) => [...prevScores, finalScore]);

        setIsDouble(false);
        setIsTriple(false);
    };

    const goToNextPlayer = () => {
        if (scores[currentScoreIndex] < 0) {
            setScores((prevScores) => {
                const newScores = [...prevScores];
                newScores[currentScoreIndex] = currentStartingScore;
                return newScores;
            });
        }
        if (dartsThrown.length !== 0) {


            setAverages((prevAverages) => {
                const newAverages = [...prevAverages];
                const sum = dartsThrown.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                const currentAverage = newAverages[currentScoreIndex]
                const playerAverageCount = averagesCount[currentScoreIndex]
                newAverages[currentScoreIndex] = ((currentAverage * playerAverageCount) + sum) / (playerAverageCount + 1)
                return newAverages;
            });


            setAveragesCount((prevAveragesCount) => {
                const newAveragesCount = [...prevAveragesCount];
                newAveragesCount[currentScoreIndex] += 1;
                return newAveragesCount;
            });
        }
        calculatePossibleScoresToZero(scores[(currentScoreIndex + 1) % scores.length])
        setCurrentStartingScore(scores[(currentScoreIndex + 1) % scores.length]);
        setIsDouble(false);
        setIsTriple(false);
        setDartsThrown([]);
        setCurrentScoreIndex((prev) => (prev + 1) % scores.length);


    };

    const toggleDouble = () => {
        setIsDouble(!isDouble);
        setIsTriple(false); // Reset Triple when Double is toggled
    };

    const toggleTriple = () => {
        setIsTriple(!isTriple);
        setIsDouble(false); // Reset Double when Triple is toggled
    };

    const revertThrow = () => {
        if (dartsThrown.length <= 0) return;

        setScores((prevScores) => {
            const newScores = [...prevScores];
            newScores[currentScoreIndex] += dartsThrown[dartsThrown.length - 1];
            return newScores;
        });
        calculatePossibleScoresToZero(scores[currentScoreIndex] += dartsThrown[dartsThrown.length - 1])
        setDartsThrown((prevScores) => prevScores.slice(0, -1));

    }

    const resetGame = () => {

        if (winnerIndex !== -1) {
            setLegs((prevLegs) => {
                const newLegs = [...prevLegs];
                newLegs[winnerIndex] += 1;
                return newLegs;
            });
        }
        setScores(Array(playerNames.length).fill(301))
        setAverages(Array(playerNames.length).fill(0.0))
        setAveragesCount(Array(playerNames.length).fill(0))
        setCurrentStartingScore(301);
        setIsDouble(false); // State for Double
        setIsTriple(false); // State for Triple
        setCurrentScoreIndex(0);
        setDartsThrown([]);
        setScoresToZero([])
    }

    const calculatePossibleScoresToZero = (currentScore: number) => {
        setScoresToZero([]);

        const allPossibleScores = [
            ...dartScores,                       // Single scores
            25,
            50,
            ...dartScores.map(score => score * 2), // Double scores
            ...dartScores.map(score => score * 3),  // Triple scores

        ];

        const allPossibleScoresAsString  = [
            ...dartScores,                       // Single scores
            "SINGLE BULL",
            "BULL",
            ...dartScores.map(score => "D" + score), // Double scores
            ...dartScores.map(score => "T" + score),  // Triple scores


        ];

        for (let i = allPossibleScores.length - 1; i >= 0; i--) {
            if (allPossibleScores[i] === currentScore) {
                setScoresToZero([allPossibleScoresAsString[i]]);
                return;
            }
            for (let j = allPossibleScores.length - 1; j >= 0; j--) {
                if (allPossibleScores[i] + allPossibleScores[j] === currentScore) {
                    setScoresToZero([allPossibleScoresAsString[i], allPossibleScoresAsString[j]]);
                    return;
                }
                for (let k = allPossibleScores.length - 1; k >= 0; k--) {
                    if (allPossibleScores[i] + allPossibleScores[j] + allPossibleScores[k] === currentScore) {
                        setScoresToZero([allPossibleScoresAsString[i], allPossibleScoresAsString[j], allPossibleScoresAsString[k]]);
                        return;
                    }
                }
            }
        }

    }

    const winnerIndex = scores.findIndex(score => score === 0);
    const winnerName = winnerIndex !== -1 ? playerNames[winnerIndex] : null;

    const loserIndex = scores.findIndex(score => score < 0);
    const loserName = loserIndex !== -1 ? playerNames[loserIndex] : null;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
            <Card className="max-w-lg w-full p-6 shadow-lg bg-white rounded-lg">
                <div className="flex justify-around items-center m-6">
                    {scores.map((score, index) => (
                        <div key={index}>
                            <Title
                                className={`text-center text-2xl text-gray-800 mb ${currentScoreIndex === index ? 'bg-gray-300 rounded-lg p-1' : ''}`}>
                                {score}
                            </Title>
                            <Subtitle>
                                {playerNames[index]}
                            </Subtitle>
                            <Subtitle>
                                ⊘: {parseFloat(averages[index].toFixed(1))}
                            </Subtitle>
                            <Subtitle>
                                L: {legs[index]}
                            </Subtitle>
                        </div>
                    ))}
                </div>

                {/* Show alert when player wins */}
                {winnerName && (
                    <div className="my-6">
                        <Card
                            className="flex flex-col items-center bg-green-100 border-green-400 border-2 p-4 rounded-lg">
                            <Title className="text-center text-xl text-green-600">
                                {winnerName} has won!
                            </Title>
                            <Button
                                onClick={resetGame}
                                variant={"secondary"}
                                className="bg-blue-500 text-white hover:bg-blue-600 transition duration-200 mt-4 rounded-lg p-2"
                            >
                                Reset Game
                            </Button>
                        </Card>
                    </div>
                )}

                {loserName && (
                    <div className="my-6">
                        <Card className="flex flex-col items-center bg-red-100 border-red-400 border-2 p-4 rounded-lg">
                            <Title className="text-center text-xl text-red-600">
                                {loserName} has thrown too much!
                            </Title>
                            <Button
                                onClick={goToNextPlayer}
                                variant={"secondary"}
                                className="bg-blue-500 text-white hover:bg-blue-600 transition duration-200 mt-4 rounded-lg p-2"
                            >
                                Continue
                            </Button>
                        </Card>
                    </div>
                )}

                <div className="flex items-center m-6">
                    <Subtitle>
                        Played Darts:
                    </Subtitle>
                    {dartsThrown.map((score, idx) => (
                        <Title key={idx} className='text-center text-2xl text-gray-800 mb ml-2'>
                            {score}
                        </Title>
                    ))}
                </div>

                <div className="flex items-center m-6">
                    <Subtitle>
                        Possible Options to end game:
                    </Subtitle>
                    {scoresToZero.map((score, idx) => (
                        <Title key={idx} className='text-center text-2xl text-gray-800 mb ml-2'>
                            {score}
                        </Title>
                    ))}
                </div>

                {/* Grid layout for selecting dart values */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                    {dartScores.map((dart) => (
                        <Button
                            key={dart}
                            onClick={() => handleDartSelection(dart)}
                            className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-lg"
                        >
                            {dart}
                        </Button>
                    ))}
                </div>

                {/* Grid layout for toggling Double and Triple */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                    <Button
                        onClick={toggleDouble}
                        className={`w-full ${isDouble ? 'bg-green-500 hover:bg-green-600 ' : 'bg-blue-500 hover:bg-blue-600 '} text-white transition duration-200 rounded-lg`}
                    >
                        Double
                    </Button>
                    <Button
                        onClick={toggleTriple}
                        className={`w-full ${isTriple ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'} text-white  transition duration-200 rounded-lg`}
                    >
                        Triple
                    </Button>
                    <Button
                        onClick={() => handleDartSelection(25)}
                        className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-lg"
                    >
                        25
                    </Button>
                    <Button
                        onClick={() => handleDartSelection(50)}
                        className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-lg"
                    >
                        50
                    </Button>
                    <Button
                        onClick={() => handleDartSelection(0)}
                        className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-lg"
                    >
                        0
                    </Button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                    <Button
                        className="w-full bg-red-500 text-white hover:bg-red-600 transition duration-200 rounded-lg"
                        onClick={onEndGame}
                    >
                        End
                    </Button>
                    <Button
                        className="w-full bg-red-500 text-white hover:bg-red-600 transition duration-200 rounded-lg"
                        onClick={revertThrow}
                    >
                        Revert
                    </Button>
                    <Button
                        className="w-full bg-red-500 text-white hover:bg-red-600 transition duration-200 rounded-lg"
                        onClick={resetGame}
                    >
                        Reset
                    </Button>

                    <Button
                        className="w-full bg-red-500 text-white hover:bg-red-600 transition duration-200 rounded-lg"
                        onClick={goToNextPlayer}
                    >
                        Next
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default DartScoreSelector;
