import React, { useCallback, useEffect, useState } from "react";
import { Card, Title, Button, Subtitle } from "@tremor/react";
import GameMode from "../interfaces/GameMode";
import { ForwardIcon, PlayCircleIcon } from "@heroicons/react/16/solid";
import { gamesService } from "service/GamesService";
import { userService } from "service/UserService";

interface DartScoreSelectorProps {
    playerNames: string[];
    onEndGame: () => {};
    gameMode: GameMode;
    chosenLegLength: number;
    chosenSetLength: number;
    chosenIsDoubleOut: boolean;
}

function DartScoreSelector({ playerNames, onEndGame, gameMode, chosenLegLength, chosenSetLength, chosenIsDoubleOut }: DartScoreSelectorProps) {
    const [startedGame, setStartedGame] = useState(false);
    const [legs, setLegs] = useState<number[]>([]);
    const [sets, setSets] = useState<number[]>([]);
    const [legLength, setLegLength] = useState<number>(-1);
    const [setLength, setSetLength] = useState<number>(-1);
    const [scoresToZero, setScoresToZero] = useState<string[]>([]);
    const [averages, setAverages] = useState<number[]>([]);
    const [averagesCount, setAveragesCount] = useState<number[]>([]);
    const [scores, setScores] = useState<number[]>([]);
    const [currentStartingScore, setCurrentStartingScore] = useState<number>(301);
    const [isDouble, setIsDouble] = useState(false);
    const [isTriple, setIsTriple] = useState(false);
    const [currentScoreIndex, setCurrentScoreIndex] = useState(0);
    const [dartsThrown, setDartsThrown] = useState<number[]>([]);
    const [isDoubleOut, setIsDoubleOut] = useState<boolean>(true);
    const [isLoss, setIsLoss] = useState<boolean>(false);
    const [isWon, setIsWon] = useState<boolean>(false);
    const [isWinningGame, setIsWinningGame] = useState<boolean>(false);

    const dartScores = Array.from({ length: 20 }, (_, i) => i + 1);

    const startGame = useCallback(() => {
        setIsDoubleOut(chosenIsDoubleOut);
        setScores(Array(playerNames.length).fill(gameMode.count));
        setAverages(Array(playerNames.length).fill(0));
        setLegs(Array(playerNames.length).fill(0));
        setSets(Array(playerNames.length).fill(0));
        setAveragesCount(Array(playerNames.length).fill(0));
        setLegLength(chosenLegLength);
        setSetLength(chosenSetLength);
        setStartedGame(true);
        setDartsThrown([]);
        setIsLoss(false);
        setIsWon(false);
        setIsWinningGame(false);
    }, [chosenIsDoubleOut, playerNames, gameMode, chosenSetLength, chosenLegLength]);

    useEffect(() => {
        if (!startedGame) startGame();
    }, [startGame, startedGame]);

    const handleDartSelection = (dartScore: number) => {
        if (dartsThrown.length === 3 || scores[currentScoreIndex] <= 0 || (isDoubleOut && scores[currentScoreIndex] <= 1)) return;

        let finalScore = dartScore;
        if (!(dartScore === 50 || dartScore === 25)) {
            if (isDouble) finalScore *= 2;
            else if (isTriple) finalScore *= 3;
        }

        let newScore = scores[currentScoreIndex] - finalScore;
        if (newScore < 0 || (newScore === 1 && isDoubleOut)) setIsLoss(true);
        else if (newScore === 0) {
            if (isDoubleOut && !isDouble) setIsLoss(true);
            else setIsWon(true);
        }

        calculatePossibleScoresToZero(scores[currentScoreIndex] - finalScore);
        setScores(prev => {
            const updated = [...prev];
            updated[currentScoreIndex] -= finalScore;
            return updated;
        });

        setDartsThrown(prev => [...prev, finalScore]);
        setIsDouble(false);
        setIsTriple(false);
    };

    const calculatePossibleScoresToZero = (currentScore: number) => {
        const possible = [...dartScores, 25, 50, ...dartScores.map(n => n * 2), ...dartScores.map(n => n * 3)];
        const labels = [
            ...dartScores.map(n => n.toString()),
            "S-BULL",
            "BULL",
            ...dartScores.map(n => `D${n}`),
            ...dartScores.map(n => `T${n}`)
        ];

        for (let i = possible.length - 1; i >= 0; i--) {
            if (possible[i] === currentScore) return setScoresToZero([labels[i]]);
            for (let j = possible.length - 1; j >= 0; j--) {
                if (possible[i] + possible[j] === currentScore) return setScoresToZero([labels[i], labels[j]]);
                for (let k = possible.length - 1; k >= 0; k--) {
                    if (possible[i] + possible[j] + possible[k] === currentScore) return setScoresToZero([labels[i], labels[j], labels[k]]);
                }
            }
        }
        setScoresToZero([]);
    };

    const toggleDouble = () => setIsDouble(prev => !prev);
    const toggleTriple = () => setIsTriple(prev => !prev);

    const revertThrow = () => {
        if (dartsThrown.length === 0) return;
        const last = dartsThrown[dartsThrown.length - 1];
        setScores(prev => {
            const updated = [...prev];
            updated[currentScoreIndex] += last;
            return updated;
        });
        calculatePossibleScoresToZero(scores[currentScoreIndex] + last);
        setDartsThrown(prev => prev.slice(0, -1));
    };

    const goToNextPlayer = () => {
        if (isLoss) {
            setScores(prev => {
                const updated = [...prev];
                updated[currentScoreIndex] = currentStartingScore;
                return updated;
            });
            setIsLoss(false);
        } else {
            setCurrentStartingScore(scores[(currentScoreIndex + 1) % scores.length]);
        }

        if (dartsThrown.length > 0) {
            const sum = dartsThrown.reduce((a, b) => a + b, 0);
            setAverages(prev => {
                const updated = [...prev];
                updated[currentScoreIndex] = ((prev[currentScoreIndex] * averagesCount[currentScoreIndex]) + sum) / (averagesCount[currentScoreIndex] + 1);
                return updated;
            });
            setAveragesCount(prev => {
                const updated = [...prev];
                updated[currentScoreIndex] += 1;
                return updated;
            });
        }

        calculatePossibleScoresToZero(scores[(currentScoreIndex + 1) % scores.length]);
        setDartsThrown([]);
        setCurrentScoreIndex((prev) => (prev + 1) % scores.length);
        setIsDouble(false);
        setIsTriple(false);
    };

    const resetGame = () => {
        if (isWon) {
            setLegs(prev => {
                const updated = [...prev];
                updated[currentScoreIndex] += 1;
                if (updated[currentScoreIndex] === legLength) {
                    setSets(prevSets => {
                        const newSets = [...prevSets];
                        newSets[currentScoreIndex] += 1;
                        return newSets;
                    });
                    updated[currentScoreIndex] = 0;
                }
                return updated;
            });
            const user_id = userService.getUserID()
            if (user_id !== undefined) {
                gamesService.addGame(true, user_id);
            }
            
        }

        setScores(Array(playerNames.length).fill(301));
        setAverages(Array(playerNames.length).fill(0.0));
        setAveragesCount(Array(playerNames.length).fill(0));
        setCurrentStartingScore(301);
        setCurrentScoreIndex(0);
        setIsDouble(false);
        setIsTriple(false);
        setDartsThrown([]);
        setScoresToZero([]);
    };

    const goToNextLeg = () => {
        setLegs(prev => {
            const updated = [...prev];
            updated[currentScoreIndex] += 1;
            if (updated[currentScoreIndex] === legLength) {
                setSets(prev => {
                    const newSets = [...prev];
                    newSets[currentScoreIndex] += 1;
                    if (newSets[currentScoreIndex] === setLength) setIsWinningGame(true);
                    return newSets;
                });
                updated[currentScoreIndex] = 0;
            }
            return updated;
        });

        setIsWon(false);
        setScores(Array(playerNames.length).fill(gameMode.count));
        setAverages(Array(playerNames.length).fill(0));
        setAveragesCount(Array(playerNames.length).fill(0));
        setDartsThrown([]);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
            <Card className="w-full max-w-4xl p-4 shadow-lg bg-white rounded-lg">
                <div className="flex flex-wrap justify-around items-center gap-4 mb-6">
                    {scores.map((score, index) => (
                        <div key={index} className="text-center">
                            <Title className={`text-xl ${currentScoreIndex === index ? 'bg-gray-300 rounded-lg p-1' : ''}`}>{score}</Title>
                            <Subtitle>{playerNames[index]}</Subtitle>
                            <Subtitle>⊘: {parseFloat(averages[index].toFixed(1))}</Subtitle>
                            <Subtitle>S: {sets[index]}</Subtitle>
                            <Subtitle>L: {legs[index]}</Subtitle>
                        </div>
                    ))}
                </div>

                <div className="flex items-center mb-4">
                    <PlayCircleIcon className="h-6 w-6 text-gray-500" />
                    {dartsThrown.map((score, idx) => (
                        <Title key={idx} className="ml-2 text-lg">{score}</Title>
                    ))}
                </div>

                <div className="flex items-center mb-4">
                    <ForwardIcon className="h-6 w-6 text-gray-500" />
                    {scoresToZero.map((score, idx) => (
                        <Title key={idx} className="ml-2 text-lg">{score}</Title>
                    ))}
                </div>

                {isWon && (
                    <Card className="bg-green-100 border-2 border-green-400 p-4 rounded-lg text-center mb-6">
                        <Title className="text-green-600">Leg is won, Congratulations!</Title>
                        <Button onClick={goToNextLeg} color="green" className="m-2">Next Leg</Button>
                    </Card>
                )}

                {isLoss && (
                    <Card className="bg-red-100 border-2 border-red-400 p-4 rounded-lg text-center mb-6">
                        <Title className="text-red-600">Not the right dart</Title>
                        <Button onClick={goToNextPlayer} color="red" className="m-2">Continue</Button>
                    </Card>
                )}

                {isWinningGame && (
                    <Card className="bg-green-100 border-2 border-green-400 p-4 rounded-lg text-center mb-6">
                        <Title className="text-green-600">Player has won the whole Game!</Title>
                        <Button onClick={startGame} color="green" className="m-2">Start New Game</Button>
                    </Card>
                )}

                {!isLoss && !isWon && !isWinningGame && (
                    <>
                        <div className="grid grid-cols-4 gap-3 mb-6">
                            {dartScores.map((dart) => (
                                <Button key={dart} onClick={() => handleDartSelection(dart)} className="text-sm py-2 px-3 min-w-0">{dart}</Button>
                            ))}
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-6">
                            <Button onClick={toggleDouble} color={isDouble ? "orange" : "blue"} className="text-sm py-2 px-3 min-w-0">Double</Button>
                            <Button onClick={toggleTriple} color={isTriple ? "orange" : "blue"} className="text-sm py-2 px-3 min-w-0">Triple</Button>
                            <Button onClick={() => handleDartSelection(25)} color="blue" className="text-sm py-2 px-3 min-w-0">25</Button>
                            <Button onClick={() => handleDartSelection(50)} color="blue" className="text-sm py-2 px-3 min-w-0">50</Button>
                            <Button onClick={() => handleDartSelection(0)} color="blue" className="text-sm py-2 px-3 min-w-0 col-span-4">0</Button>
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-6">
                            <Button onClick={onEndGame} color="red" className="text-sm py-2 px-3 min-w-0">End</Button>
                            <Button onClick={revertThrow} color="red" className="text-sm py-2 px-3 min-w-0">Revert</Button>
                            <Button onClick={resetGame} color="red" className="text-sm py-2 px-3 min-w-0">Reset</Button>
                            <Button onClick={goToNextPlayer} color="red" className="text-sm py-2 px-3 min-w-0">Next</Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}

export default DartScoreSelector;
