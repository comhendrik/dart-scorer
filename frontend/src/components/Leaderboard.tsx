import React, {useEffect, useState} from "react";
import { Card, Title, Text, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from "@tremor/react";
import {LeaderboardEntry, leaderboardService} from "../service/LeaderBoardService";

const Leaderboard = () => {

    // Mock data for the leaderboard
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await leaderboardService.fetchLeaderboard();
                setLeaderboard(data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <Title>Leaderboard</Title>
                <Text className="mb-4">Top Performers</Text>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Rank</TableHeaderCell>
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell>Score</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaderboard.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>{entry.id}</TableCell>
                                <TableCell>{entry.name}</TableCell>
                                <TableCell>{entry.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default Leaderboard;
