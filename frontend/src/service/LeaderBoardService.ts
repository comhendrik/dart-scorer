export type LeaderboardEntry = {
    id: number;
    name: string;
    score: number;
};

class LeaderboardService {
    private baseUrl: string;
    private maxRetries: number;

    constructor(maxRetries: number = 3) {
        this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
        this.maxRetries = maxRetries;
    }

    /**
     * Fetches leaderboard data from the API with retry logic.
     * @returns {Promise<LeaderboardEntry[]>} A promise resolving to the leaderboard data.
     */
    async fetchLeaderboard(): Promise<LeaderboardEntry[]> {
        let attempts = 0;

        while (attempts < this.maxRetries) {
            try {
                const response = await fetch(`${this.baseUrl}/leaderboard`);
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const data: LeaderboardEntry[] = await response.json();
                return data;
            } catch (error) {
                attempts += 1;
                console.warn(`Attempt ${attempts} failed: ${error}`);

                if (attempts >= this.maxRetries) {
                    throw new Error("Failed to fetch leaderboard data after maximum retries.");
                }
            }
        }

        throw new Error("Unexpected error: Retry logic failed."); // Shouldn't reach here
    }
}

export const leaderboardService = new LeaderboardService();

