'use client';
import React, { useState } from 'react';
import { Button, Card, Subtitle, TextInput, Title } from '@tremor/react';
import { XCircleIcon, PlusIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import GameMode from "../interfaces/GameMode";
interface GameMenuProps {
    onStartGame: (playerNames: string[], gameMode: {}, legLength: number, setLength: number) => {};
}

function GameMenu({ onStartGame } : GameMenuProps) {
    const [playerNames, setPlayerNames] = useState(['']);
    const [selectedMode, setSelectedMode] = useState(0);
    const [doubleOut, setDoubleOut] = useState(false)
    const [sets, setSets] = useState(1);
    const [legs, setLegs] = useState(1);

    const gameModes: GameMode[] = [
        { id: 0, label: "301" , count: 301},
        { id: 1, label: "501", count: 501 },
        { id: 2, label: "ATC", count: 0 },
    ];


    const handleAddPlayer = () => {
        setPlayerNames([...playerNames, '']);
    };

    const handleRemovePlayer = (index: number) => {
        setPlayerNames(playerNames.filter((_ : string, i: number) => i !== index));
    };

    const handleNameChange = (index: number, name: string) => {
        const updatedNames = [...playerNames];
        updatedNames[index] = name;
        setPlayerNames(updatedNames);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
            <Card className="max-w-lg w-full p-6 shadow-lg bg-white rounded-lg">
                <div className="flex flex-col items-center justify-center mt-4">
                    <Title className="text-4xl font-bold">DartScorer</Title>
                </div>

                <div className="mt-6">
                    {playerNames.map((playerName, index) => (
                        <div key={index} className="flex items-center mb-4">
                            <TextInput
                                value={playerName}
                                placeholder={`Player ${index + 1}`}
                                onChange={(e) => handleNameChange(index, e.target.value)}
                                className="flex-grow"
                            />
                            <button
                                onClick={() => handleRemovePlayer(index)}
                                className="ml-2 text-red-500 hover:text-red-600 transition duration-200"
                            >
                                <XCircleIcon className="h-6 w-6"/>
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={handleAddPlayer}
                        className="flex items-center text-blue-500 hover:text-blue-600 transition duration-200"
                    >
                        <PlusIcon className="h-6 w-6 mr-2"/>
                        Add Player
                    </button>
                </div>

                <div className="flex justify-around mt-4">
                    {gameModes.map((mode) => (
                        <Button
                            key={mode.id}
                            variant={selectedMode === mode.id ? "primary" : "secondary"}
                            onClick={() => setSelectedMode(mode.id)}
                            color={selectedMode === mode.id ? "orange" : "blue"}
                            >{mode.label}</Button>
                    ))}
                </div>

                <div className="flex justify-around mt-4">
                    <Button
                        onClick={() => setDoubleOut(false)}
                        variant={!doubleOut ? "primary" : "secondary"}
                        color={!doubleOut ? "orange" : "blue"}
                    >Single Out</Button>
                    <Button
                        onClick={() => setDoubleOut(true)}
                        variant={doubleOut ? "primary" : "secondary"}
                        color={doubleOut ? "orange" : "blue"}
                    >Double Out</Button>
                </div>


                <div className="flex flex-col items-center gap-8 p-8">

                    {/* Number Controls (Horizontal Layout) */}
                    <div className="flex gap-12">
                        {/* Sets Control */}
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-xl font-bold text-gray-700">Sets</span>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    onClick={() => setSets(Math.max(1, sets-1))}
                                >
                                    <ChevronLeftIcon className="h-6 w-6"/>
                                </Button>
                                <span className="text-2xl font-bold text-gray-900">{sets}</span>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    onClick={() => setSets(sets + 1)}
                                >
                                    <ChevronRightIcon className="h-6 w-6"/>
                                </Button>
                            </div>
                        </div>

                        {/* Legs Control */}
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-xl font-bold text-gray-700">Legs</span>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    onClick={() => setLegs(Math.max(1, legs-1))}
                                >
                                    <ChevronLeftIcon className="h-6 w-6"/>
                                </Button>
                                <span className="text-2xl font-bold text-gray-900">{legs}</span>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    onClick={() => setLegs(legs + 1)}
                                >
                                    <ChevronRightIcon className="h-6 w-6"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <Button
                        disabled={playerNames.length === 0}
                        color={playerNames.length === 0 ? "gray" : "blue"}
                        onClick={() => onStartGame(playerNames, gameModes[selectedMode], legs, sets)}
                    >
                        Play
                    </Button>
                </div>


            </Card>
        </div>
    );
}

export default GameMenu;
