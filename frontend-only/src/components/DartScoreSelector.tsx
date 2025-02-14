import React, {useCallback, useEffect, useState} from "react";
import { Card, Title, Button, Subtitle } from "@tremor/react";
import GameMode from "../interfaces/GameMode";
import {ForwardIcon, PlayCircleIcon} from "@heroicons/react/16/solid";

interface DartScoreSelectorProps {
    playerNames: string[];
    onEndGame: () => {};
    gameMode: GameMode;
    chosenLegLength: number;
    chosenSetLength: number;
    chosenIsDoubleOut: boolean
}

function DartScoreSelector({playerNames, onEndGame, gameMode, chosenLegLength, chosenSetLength, chosenIsDoubleOut} : DartScoreSelectorProps) {
    const [startedGame, setStartedGame] = useState(false); // State for Double
    const [legs, setLegs] = useState<number[]>([]);
    const [sets, setSets] = useState<number[]>([]);
    const [legLength, setLegLength] = useState<number>(-1);
    const [setLength, setSetLength] = useState<number>(-1);
    const [scoresToZero, setScoresToZero] = useState<string[]>([]);
    const [averages, setAverages] = useState<number[]>([]);
    const [averagesCount, setAveragesCount] = useState<number[]>([]);
    const [scores, setScores] = useState<number[]>([]);
    const [currentStartingScore, setCurrentStartingScore] = useState<number>(301);
    const [isDouble, setIsDouble] = useState(false); // State for Double
    const [isTriple, setIsTriple] = useState(false); // State for Triple
    const [currentScoreIndex, setCurrentScoreIndex] = useState(0);
    const [dartsThrown, setDartsThrown] = useState<number[]>([]);
    const [isDoubleOut, setIsDoubleOut] = useState<boolean>(true);


    const [isLoss, setIsLoss] = useState<boolean>(false);
    const [isWon, setIsWon] = useState<boolean>(false);
    const [isWinningGame, setIsWinningGame] = useState<boolean>(false);

    const dartScores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // Dart score values


    const startGame = useCallback(() => {
        setIsDoubleOut(chosenIsDoubleOut)
        setScores(Array(playerNames.length).fill(gameMode.count))
        setAverages(Array(playerNames.length).fill(0))
        setLegs(Array(playerNames.length).fill(0))
        setSets(Array(playerNames.length).fill(0))
        setAveragesCount(Array(playerNames.length).fill(0))
        setLegLength(chosenLegLength)
        setSetLength(chosenSetLength)
        setStartedGame(true)
        setDartsThrown([])
        setIsLoss(false)
        setIsWon(false)
        setIsWinningGame(false)

    }, [chosenIsDoubleOut, playerNames, gameMode, chosenSetLength, chosenLegLength])

    useEffect(() => {
        if(startedGame) return;
        startGame()
    }, [startGame, startedGame]);



    const handleDartSelection = (dartScore: number) => {
        if (dartsThrown.length === 3) return
        if (scores[currentScoreIndex] <= 0) return
        if (isDoubleOut && scores[currentScoreIndex] <= 1) return


        let finalScore = dartScore;
        let currentScore = scores[currentScoreIndex]

        // Apply Double or Triple multiplier based on state
        if(!(dartScore === 50 || dartScore === 25)) {
            if (isDouble) {
                finalScore = dartScore * 2;
            } else if (isTriple) {
                finalScore = dartScore * 3;
            }
        }



        let newScore = currentScore - finalScore;
        if(newScore < 0 || (newScore === 1 && isDoubleOut)) {
            setIsLoss(true)
        } else if (newScore === 0) {
            if(isDoubleOut && !isDouble) setIsLoss(true)
            else setIsWon(true)
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
        if (isLoss) {
            setScores((prevScores) => {
                const newScores = [...prevScores];
                newScores[currentScoreIndex] = currentStartingScore;
                return newScores;
            });

            if (playerNames.length === 1) {
                // set it here because otherwise you will get problem playing alone
                setCurrentStartingScore(currentStartingScore);
            } else {
                setCurrentStartingScore(scores[(currentScoreIndex + 1) % scores.length]);
            }
            setIsLoss(false)
        } else {
            setCurrentStartingScore(scores[(currentScoreIndex + 1) % scores.length]);
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

        if (isWon) {
            setLegs((prevLegs) => {
                const newLegs = [...prevLegs];
                newLegs[currentScoreIndex] += 1;
                if (newLegs[currentScoreIndex] === legLength) {
                    setSets((prevSets) => {
                        const newSets = [...prevSets];
                        newSets[currentScoreIndex] += 1;
                        return newSets;
                    });
                    newLegs[currentScoreIndex] = 0;
                }
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
        setDartsThrown([])
        setScoresToZero([])
    }

    const goToNextLeg = () => {
        setLegs((prevLegs) => {
            const newLegs = [...prevLegs];
            newLegs[currentScoreIndex] += 1;
            if (newLegs[currentScoreIndex] === legLength) {
                setSets((prevSets) => {
                    const newSets = [...prevSets];
                    newSets[currentScoreIndex] += 1;
                    if (newSets[currentScoreIndex] === setLength) {
                        setIsWinningGame(true);
                    }
                    return newSets;
                });
                newLegs[currentScoreIndex] = 0;
            }
            return newLegs;
        });


        setIsWon(false);

        setScores(Array(playerNames.length).fill(gameMode.count))
        setAverages(Array(playerNames.length).fill(0))
        setAveragesCount(Array(playerNames.length).fill(0))
        setDartsThrown([])
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
            ...dartScores.map(score => "" + score),                       // Single scores
            "S-BULL",
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
                                S: {sets[index]}
                            </Subtitle>
                            <Subtitle>
                                L: {legs[index]}
                            </Subtitle>
                        </div>
                    ))}
                </div>

                <div className="flex items-center m-6">
                    <PlayCircleIcon className="h-8 w-8 text-gray-500"/>
                    {dartsThrown.map((score, idx) => (
                        <Title key={idx} className='text-center text-2xl text-gray-800 mb ml-2'>
                            {score}
                        </Title>
                    ))}
                </div>

                <div className="flex items-center m-6">
                    <ForwardIcon className="h-8 w-8 text-gray-500"/>
                    {scoresToZero.map((score, idx) => (
                        <Title key={idx} className='text-center text-2xl text-gray-800 mb ml-2'>
                            {score}
                        </Title>
                    ))}
                </div>

                {/* Show alert when player wins */}
                {isWon && (
                    <div className="my-6">
                        <Card
                            className="flex flex-col items-center bg-green-100 border-green-400 border-2 p-4 rounded-lg">
                            <Title className="text-center text-xl text-green-600">
                                Leg is won, Congratulations!
                            </Title>
                            <Button
                                onClick={goToNextLeg}
                                variant={"primary"}
                                color={"green"}
                                className={"m-2"}
                            >
                                Next Leg
                            </Button>
                        </Card>
                    </div>
                )}

                {isLoss && (
                    <div className="my-6">
                        <Card className="flex flex-col items-center bg-red-100 border-red-400 border-2 p-4 rounded-lg">
                            <Title className="text-center text-xl text-red-600">
                                Not the right dart
                            </Title>
                            <Button
                                onClick={goToNextPlayer}
                                variant={"primary"}
                                color={"red"}
                                className={"m-2"}
                            >
                                Continue
                            </Button>
                        </Card>
                    </div>
                )}

                {/* Show alert when player wins */}
                {isWinningGame && (
                    <div className="my-6">
                        <Card
                            className="flex flex-col items-center bg-green-100 border-green-400 border-2 p-4 rounded-lg">
                            <Title className="text-center text-xl text-green-600">
                                Player has won the whole Game!
                            </Title>
                            <Button
                                onClick={startGame}
                                variant={"primary"}
                                color={"green"}
                                className={"m-2"}
                            >
                                Start New Game
                            </Button>
                        </Card>
                    </div>
                )}

                {(!isLoss && !isWon && !isWinningGame) && (
                    <div>
                        {/* Grid layout for selecting dart values */}
                        <div className="grid grid-cols-5 gap-4 mb-6">
                            {dartScores.map((dart) => (
                                <Button
                                    key={dart}
                                    onClick={() => handleDartSelection(dart)}
                                    color={"blue"}
                                >
                                    {dart}
                                </Button>
                            ))}
                        </div>

                        {/* Grid layout for toggling Double and Triple */}
                        <div className="grid grid-cols-5 gap-4 mb-6">
                            <Button
                                onClick={toggleDouble}
                                color={isDouble ? "orange" : "blue"}
                            >
                                Double
                            </Button>
                            <Button
                                onClick={toggleTriple}
                                color={isTriple ? "orange" : "blue"}
                            >
                                Triple
                            </Button>
                            <Button
                                onClick={() => handleDartSelection(25)}
                                color={"blue"}
                            >
                                25
                            </Button>
                            <Button
                                onClick={() => handleDartSelection(50)}
                                color={"blue"}
                            >
                                50
                            </Button>
                            <Button
                                onClick={() => handleDartSelection(0)}
                                color={"blue"}
                            >
                                0
                            </Button>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <Button
                                onClick={onEndGame}
                                color={"red"}
                            >
                                End
                            </Button>
                            <Button
                                onClick={revertThrow}
                                color={"red"}
                            >
                                Revert
                            </Button>
                            <Button
                                onClick={resetGame}
                                color={"red"}
                            >
                                Reset
                            </Button>

                            <Button
                                onClick={goToNextPlayer}
                                color={"red"}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}


            </Card>
        </div>
    );
}

export default DartScoreSelector;
