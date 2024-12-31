// components/GameMenu.js
import React, { useState } from 'react';
import { Button, Card, Select, SelectItem, TextInput, Title } from '@tremor/react';
import { motion } from 'framer-motion';
import {StarIcon, UsersIcon} from "@heroicons/react/24/solid";

function GameMenu({ onStartGame }) {
    const [gameMode, setGameMode] = useState('301');
    const [playerNames, setPlayerNames] = useState(['']);

    const handleAddPlayer = () => {
        setPlayerNames([...playerNames, '']);
    };

    const handleNameChange = (index, name) => {
        const updatedNames = [...playerNames];
        updatedNames[index] = name;
        setPlayerNames(updatedNames);
    };

    const handleStartGame = () => {
        onStartGame(gameMode, playerNames.filter(name => name.trim() !== ''));
    };

    const handleGameModeSelect = (mode) => {
        alert(`Game mode selected: ${mode}`);
        // Implement game mode logic here (navigate, start mode, etc.)
    };

    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x:0 }}>
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
                <Card className="w-full max-w-2xl p-8 shadow-lg bg-white rounded-lg">
                    <Title className="text-center text-3xl mb-6 text-gray-800">
                        Dart Scoring Game
                    </Title>

                    <div className="flex justify-center space-x-4">
                        {/* Button for '301' game mode */}
                        <Button
                            variant="secondary"
                            color="blue"
                            onClick={() => handleGameModeSelect("301")}
                            icon={UsersIcon}
                        >
                            301
                        </Button>

                        {/* Button for '501' game mode */}
                        <Button
                            variant="secondary"
                            color="blue"
                            onClick={() => handleGameModeSelect("501")}
                            icon={UsersIcon}
                        >
                            501
                        </Button>

                        {/* Button for 'Cricket' game mode */}
                        <Button
                            variant="secondary"
                            color="blue"
                            onClick={() => handleGameModeSelect("Cricket")}
                            icon={StarIcon}
                        >
                            Cricket
                        </Button>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}

export default GameMenu;