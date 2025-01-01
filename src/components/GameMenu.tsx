import React, { useState } from 'react';
import { Button, Card, Subtitle, TextInput, Title } from '@tremor/react';
import { XCircleIcon, PlusIcon } from "@heroicons/react/24/solid";

function GameMenu({ onStartGame }) {
    const [playerNames, setPlayerNames] = useState(['']);

    const handleAddPlayer = () => {
        setPlayerNames([...playerNames, '']);
    };

    const handleRemovePlayer = (index) => {
        setPlayerNames(playerNames.filter((_, i) => i !== index));
    };

    const handleNameChange = (index, name) => {
        const updatedNames = [...playerNames];
        updatedNames[index] = name;
        setPlayerNames(updatedNames);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
            <Card className="max-w-lg w-full p-6 shadow-lg bg-white rounded-lg">
                <div className="flex flex-col items-center justify-center mt-4">
                    <Title className="text-4xl font-bold">DartScorer</Title>
                    <Subtitle>Add Players and click on Play to begin</Subtitle>
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
                                <XCircleIcon className="h-6 w-6" />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={handleAddPlayer}
                        className="flex items-center text-blue-500 hover:text-blue-600 transition duration-200"
                    >
                        <PlusIcon className="h-6 w-6 mr-2" />
                        Add Player
                    </button>
                </div>

                <div className="flex justify-center mt-6">
                    <Button
                        disabled={playerNames.length === 0}
                        className={`w-32 ${playerNames.length === 0 ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} text-white transition duration-200 rounded-lg`}
                        onClick={() => onStartGame(playerNames)}
                    >
                        Play
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default GameMenu;
