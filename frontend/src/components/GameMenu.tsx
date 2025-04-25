'use client';
import React, { useState } from 'react';
import { Button, Card, TextInput, Title } from '@tremor/react';
import { XCircleIcon, PlusIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import GameMode from "../interfaces/GameMode";
import { userService } from 'service/UserService';

interface GameMenuProps {
    onStartGame: (playerNames: string[], gameMode: {}, legLength: number, setLength: number, isDoubleOut: boolean) => {};
    setShowLeaderBoard: (show: boolean) => {}
}

function GameMenu({ onStartGame, setShowLeaderBoard }: GameMenuProps) {
    const [playerNames, setPlayerNames] = useState(['']);
    const [selectedMode, setSelectedMode] = useState(0);
    const [doubleOut, setDoubleOut] = useState(false);
    const [sets, setSets] = useState(1);
    const [legs, setLegs] = useState(1);

    const gameModes: GameMode[] = [
        { id: 0, label: "301", count: 301 },
        { id: 1, label: "501", count: 501 },
        { id: 2, label: "ATC", count: 0 },
    ];

    const handleAddPlayer = () => setPlayerNames([...playerNames, '']);
    const handleRemovePlayer = (index: number) =>
        setPlayerNames(playerNames.filter((_, i) => i !== index));
    const handleNameChange = (index: number, name: string) => {
        const updatedNames = [...playerNames];
        updatedNames[index] = name;
        setPlayerNames(updatedNames);
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-gradient-to-r from-blue-500 to-indigo-500 flex justify-center items-start overflow-auto pt-8 px-4">
            <Card className="w-full max-w-screen-md bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center mb-6">
                    <Title className="text-[5vw] sm:text-[3vw] font-bold leading-tight">Dart Scorer</Title>
                </div>

                <div className="space-y-4 mb-6">
                    {playerNames.map((playerName, index) => (
                        <div key={index} className="flex items-center gap-2 w-full">
                        <TextInput
                            value={playerName}
                            placeholder={`Player ${index + 1}`}
                            onChange={(e) => handleNameChange(index, e.target.value)}
                            className="w-full"
                        />
                        <button
                            onClick={() => handleRemovePlayer(index)}
                            className="text-red-500 hover:text-red-600 flex-shrink-0"
                        >
                            <XCircleIcon className="h-[5vw] w-[5vw] max-h-6 max-w-6" />
                        </button>
                    </div>
                    
                    ))}
                    <button
                        onClick={handleAddPlayer}
                        className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                        <PlusIcon className="h-[5vw] w-[5vw] max-h-6 max-w-6 mr-2" />
                        <span className="text-[4vw] sm:text-[1.2vw] font-medium">Add Player</span>
                    </button>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {gameModes.map((mode) => (
                        <Button
                            key={mode.id}
                            variant={selectedMode === mode.id ? "primary" : "secondary"}
                            onClick={() => setSelectedMode(mode.id)}
                            color="blue"
                            className="text-[3.5vw] sm:text-[1vw] px-[4vw] sm:px-6"
                        >
                            {mode.label}
                        </Button>
                    ))}
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    <Button
                        onClick={() => setDoubleOut(false)}
                        variant={!doubleOut ? "primary" : "secondary"}
                        color="blue"
                        className="text-[3.5vw] sm:text-[1vw] px-[4vw] sm:px-6"
                    >
                        Single Out
                    </Button>
                    <Button
                        onClick={() => setDoubleOut(true)}
                        variant={doubleOut ? "primary" : "secondary"}
                        color="blue"
                        className="text-[3.5vw] sm:text-[1vw] px-[4vw] sm:px-6"
                    >
                        Double Out
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row justify-around items-center gap-8 mb-6">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[4vw] sm:text-[1.2vw] font-bold text-gray-700">Sets</span>
                        <div className="flex items-center gap-3">
                            <Button variant="secondary" size="sm" onClick={() => setSets(Math.max(1, sets - 1))}>
                                <ChevronLeftIcon className="h-[5vw] w-[5vw] max-h-6 max-w-6" />
                            </Button>
                            <span className="text-[4vw] sm:text-[1.2vw] font-semibold">{sets}</span>
                            <Button variant="secondary" size="sm" onClick={() => setSets(sets + 1)}>
                                <ChevronRightIcon className="h-[5vw] w-[5vw] max-h-6 max-w-6" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[4vw] sm:text-[1.2vw] font-bold text-gray-700">Legs</span>
                        <div className="flex items-center gap-3">
                            <Button variant="secondary" size="sm" onClick={() => setLegs(Math.max(1, legs - 1))}>
                                <ChevronLeftIcon className="h-[5vw] w-[5vw] max-h-6 max-w-6" />
                            </Button>
                            <span className="text-[4vw] sm:text-[1.2vw] font-semibold">{legs}</span>
                            <Button variant="secondary" size="sm" onClick={() => setLegs(legs + 1)}>
                                <ChevronRightIcon className="h-[5vw] w-[5vw] max-h-6 max-w-6" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    <Button
                        disabled={playerNames.length === 0}
                        color={playerNames.length === 0 ? "gray" : "blue"}
                        onClick={() =>
                            onStartGame(playerNames, gameModes[selectedMode], legs, sets, doubleOut)
                        }
                        className="text-[4vw] sm:text-[1.2vw] px-[5vw] sm:px-6"
                    >
                        Play
                    </Button>
                    <Button
                        disabled={playerNames.length === 0}
                        color={playerNames.length === 0 ? "gray" : "blue"}
                        onClick={() => setShowLeaderBoard(true)}
                        className="text-[4vw] sm:text-[1.2vw] px-[5vw] sm:px-6"
                    >
                        Leaderboard
                    </Button>
                </div>
                <div className="flex justify-center mt-6">
                    <Button
                        color="red"
                        onClick={() => userService.logout()}
                        className="text-[4vw] sm:text-[1.2vw] px-[5vw] sm:px-6"
                    >
                        Logout
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default GameMenu;
