export type Game = {
    id: number;
    haswon: boolean;
    user_id: number;
};

class GamesService {
    private baseUrl: string;
    private maxRetries: number;

    constructor(baseUrl: string, maxRetries: number = 3) {
        this.baseUrl = baseUrl;
        this.maxRetries = maxRetries;
    }

    /**
     * Fetches leaderboard data from the API with retry logic.
     * @returns {Promise<Game[]>} A promise resolving to the leaderboard data.
     */
    async fetchGames(userId: number): Promise<Game[]> {
        let attempts = 0;

        while (attempts < this.maxRetries) {
            try {
                const response = await fetch(`${this.baseUrl}/games?user_id=${userId}`);
                console.log(response);
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const data: Game[] = await response.json();
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

export const gamesService = new GamesService("http://localhost:3000",3);