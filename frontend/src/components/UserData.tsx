import React, { useEffect, useState } from "react";
import {
    Card,
    Title,
    Text,
    LineChart,
    Tracker,
    CategoryBar,
    Select,
    SelectItem,
    Button
} from "@tremor/react";
import { gamesService } from "../service/GamesService";

interface LeaderboardProps {
    setShowLeaderboard: (show: boolean) => {}
}

function Leaderboard({ setShowLeaderboard } : LeaderboardProps) {
    const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
    const [selectedUser, setSelectedUser] = useState<{"id": number, "username": string} | null>(null);
    const [gameData, setGameData] = useState<{}[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [maxChartData, setMaxChartData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch list of users
        const fetchUsers = async () => {
            try {
                //const usersData = await gamesService.fetchUsers();
                const usersData = [{ "id": 1, "username": "Player1" }, { "id": 2, "username": "Player2" }]

                setUsers(usersData);
                if (usersData.length > 0) {
                    setSelectedUser(usersData[0]); // Select first user by default
                }
            } catch (err: any) {
                setError(err.message);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedUser === null) return;

        const fetchData = async () => {
            try {
                const data = await gamesService.fetchGames(selectedUser.id);
                const newGameData: {}[] = [];
                data.forEach((game: any, index: number) => {
                    newGameData.push({ color: game.haswon ? "emerald" : "rose", tooltip: game.haswon ? "Win" : "Loss" });
                });

                // Dummy data for now - replace with actual user statistics
                const newChartData = data.map((game: any, index: number) => ({
                    date: index + 1,
                    Average: Math.random() * 100, // Replace with real game average data
                }));

                const newMaxChartData = data.map((game: any, index: number) => ({
                    date: index + 1,
                    Result: Math.random() * 180, // Replace with real highest play data
                }));

                setGameData(newGameData);
                setChartData(newChartData);
                setMaxChartData(newMaxChartData);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchData();
    }, [selectedUser]);

    const valueFormatter = (number: number) => `${number}`;

    return (
        <Card className="max-w-lg w-full p-6 shadow-lg bg-white rounded-lg m-5">
            <Title>User Data</Title>
            <Text className="mb-4">Statistics</Text>

            {/* User Selection */}
            <Select className="mb-4" value={selectedUser?.username ?? ""}
            onValueChange={(value) => {
                const user = users.find((u) => u.username === value);
                setSelectedUser(user || null); // Update selectedUser based on username match
            }}>
                {users.map((user) => (
                    <SelectItem key={user.id} value={user.username}>
                        {user.username}
                    </SelectItem>
                ))}
            </Select>

            <Card className="mx-auto max-w-md mt-5">
                <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Averages over sets
                </h3>
                <LineChart
                    className="mt-4 h-72"
                    data={chartData}
                    index="date"
                    yAxisWidth={65}
                    categories={["Average"]}
                    colors={["indigo"]}
                    valueFormatter={valueFormatter}
                />
            </Card>

            <Card className="mx-auto max-w-md mt-5">
                <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Highest Play on Turns
                </h3>
                <LineChart
                    className="mt-4 h-72"
                    data={maxChartData}
                    index="date"
                    yAxisWidth={65}
                    categories={["Result"]}
                    colors={["indigo"]}
                    valueFormatter={valueFormatter}
                />
            </Card>

            <Card className="mx-auto max-w-md mt-5">
                <p className="text-tremor-default flex items-center justify-between">
                    <span className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
                        Wins over last games
                    </span>
                    <span className="text-tremor-content dark:text-dark-tremor-content">Winrate 99.1%</span>
                </p>
                <Tracker data={gameData} className="mt-2" />
            </Card>

            <Card className="mx-auto max-w-md mt-5">
                <p className="text-tremor-default flex items-center justify-between">
                    <span className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
                        All Time Average
                    </span>
                </p>
                <CategoryBar values={[20, 20, 30, 30, 80]} colors={["rose", "orange", "yellow", "emerald", "green"]} markerValue={62} />
            </Card>

            <div className="flex justify-center mt-6">
                    <Button
                        color={"blue"}
                        onClick={() => setShowLeaderboard(false)}
                        className="m-4"
                    >
                        Back
                    </Button>
                </div>
        </Card>
    );
};

export default Leaderboard;
