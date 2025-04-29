import React, { useEffect, useState } from "react";
import {
    Card,
    Title,
    Text,
    LineChart,
    Tracker,
    CategoryBar,
    Button
} from "@tremor/react";
import { gamesService } from "../service/GamesService";
import { userService } from "service/UserService";

interface LeaderboardProps {
    setShowLeaderboard: (show: boolean) => {};
}

function Leaderboard({ setShowLeaderboard }: LeaderboardProps) {
    const [gameData, setGameData] = useState<{}[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [maxChartData, setMaxChartData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userID = userService.getUserID();
                if (userID === undefined) throw Error("No logged in user")
                const data = await gamesService.fetchGames(userID);
                const newGameData: {}[] = data.map((game: any) => ({
                    color: game.haswon ? "emerald" : "rose",
                    tooltip: game.haswon ? "Win" : "Loss",
                }));

                const newChartData = data.map((game: any, index: number) => ({
                    date: index + 1,
                    Average: Math.random() * 100, // Replace with real data
                }));

                const newMaxChartData = data.map((game: any, index: number) => ({
                    date: index + 1,
                    Result: Math.random() * 180, // Replace with real data
                }));

                setGameData(newGameData);
                setChartData(newChartData);
                setMaxChartData(newMaxChartData);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    const valueFormatter = (number: number) => `${number}`;

    return (
        <Card className="w-full p-6 shadow-lg bg-white rounded-lg m-5">
            <Title>User Data</Title>
            <Text className="mb-4">Statistics</Text>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                <Card className="w-full">
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

                <Card className="w-full">
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

                <Card className="w-full">
                    <p className="text-tremor-default flex items-center justify-between">
                        <span className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
                            Wins over last games
                        </span>
                        <span className="text-tremor-content dark:text-dark-tremor-content">
                            Winrate 99.1%
                        </span>
                    </p>
                    <Tracker data={gameData} className="mt-2" />
                </Card>

                <Card className="w-full">
                    <p className="text-tremor-default flex items-center justify-between">
                        <span className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
                            All Time Average
                        </span>
                    </p>
                    <CategoryBar
                        values={[20, 20, 30, 30, 80]}
                        colors={["rose", "orange", "yellow", "emerald", "green"]}
                        markerValue={62}
                    />
                </Card>
            </div>

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
}

export default Leaderboard;
