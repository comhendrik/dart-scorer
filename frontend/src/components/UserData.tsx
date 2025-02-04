import React, {useEffect, useState} from "react";
import {
    Card,
    Title,
    Text,
    LineChart, Tracker, CategoryBar
} from "@tremor/react";
import {Game, gamesService} from "../service/GamesService";

const Leaderboard = () => {
    const [gameData, setGameData] = useState<{}[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const data = await gamesService.fetchGames(1);
                const newGameData: {}[] = [];
                data.map(game => {
                    if (game.haswon) {
                        newGameData.push({ color: 'emerald', tooltip: 'Win' });
                    } else {
                        newGameData.push({ color: 'rose', tooltip: 'Loss' });
                    }
                });
                console.log(newGameData);
                setGameData(newGameData);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    const valueFormatter = function (number: number) {
        return '' + number;
    };

    const chartdata = [
        {
            date: 1,
            Average: 10.4,
        },
        {
            date: 2,
            Average: 15.8,
        },
        {
            date: 3,
            Average: 20.1,
        },
        {
            date: 4,
            Average: 18.3,
        },
        {
            date: 5,
            Average: 25.6,
        },
        {
            date: 6,
            Average: 30.2,
        },
        {
            date: 7,
            Average: 22.7,
        },
        {
            date: 8,
            Average: 28.5,
        },
        {
            date: 9,
            Average: 19.3,
        },
        {
            date: 10,
            Average: 23.8,
        },
    ];

    const maxChartdata = [
        {
            date: 1,
            Result: 10.4,
        },
        {
            date: 2,
            Result: 30,
        },
        {
            date: 3,
            Result: 40,
        },
        {
            date: 4,
            Result: 50,
        },
        {
            date: 5,
            Result: 180,
        },
        {
            date: 6,
            Result: 100,
        },
        {
            date: 7,
            Result: 100,
        },
        {
            date: 8,
            Result: 120,
        },
    ];


    return (
        <Card className="max-w-lg w-full p-6 shadow-lg bg-white rounded-lg m-5">
            <Title>User Data</Title>
            <Text className="mb-4">Statistics</Text>
            <Card className="mx-auto max-w-md mt-5">
                <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Averages
                    over sets</h3>
                <LineChart
                    className="mt-4 h-72"
                    data={chartdata}
                    index="date"
                    yAxisWidth={65}
                    categories={['Average']}
                    colors={['indigo']}
                    valueFormatter={valueFormatter}
                />
            </Card>

            <Card className="mx-auto max-w-md mt-5">
                <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Highest
                    Play on Turns</h3>
                <LineChart
                    className="mt-4 h-72"
                    data={maxChartdata}
                    index="date"
                    yAxisWidth={65}
                    categories={['Result']}
                    colors={['indigo']}
                    valueFormatter={valueFormatter}
                />
            </Card>

            <Card className="mx-auto max-w-md mt-5">
                <p className="text-tremor-default flex items-center justify-between">
                    <span className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">Wins over last games</span>
                    <span className="text-tremor-content dark:text-dark-tremor-content">Winrate 99.1%</span>
                </p>
                <Tracker data={gameData} className="mt-2"/>
            </Card>
            <Card className="mx-auto max-w-md mt-5">
                <p className="text-tremor-default flex items-center justify-between">
                    <span className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">All Time Average</span>
                </p>
                <CategoryBar
                    values={[20, 20, 30, 30, 80]}
                    colors={['rose', 'orange', 'yellow',  'emerald', 'green']}
                    markerValue={62}
                />
            </Card>

        </Card>
    );
};

export default Leaderboard;