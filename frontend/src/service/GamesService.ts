import NotyfService from "./NotyfService";
import { userService } from "./UserService";

export type Game = {
    id: number;
    haswon: boolean;
    user_id: number;
};

class GamesService {
    private maxRetries: number;
    private baseUrl: string;

    constructor(maxRetries: number = 3) {
        this.maxRetries = maxRetries;
        this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
    }

    /**
     * Fetches leaderboard data from the API with retry logic.
     * @returns {Promise<Game[]>} A promise resolving to the leaderboard data.
     */
    async fetchGames(userId: number): Promise<Game[]> {
        let attempts = 0;
        while (attempts < this.maxRetries) {
            try {
                const response = await fetch(`${this.baseUrl}/games?user_id=${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${userService.getToken()}`
                    }
                });
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

    async addGame(haswon: boolean, user_id: number): Promise<boolean> {
        try {
            await this.postWithRetry("/games", { haswon, user_id });
            return true;
        } catch (error) {
            NotyfService.showError("Fehler beim Speichern der Daten");
            return false;
        }
    }
    

    private async postWithRetry<T>(endpoint: string, body: any): Promise<T> {
        let attempts = 0;
        while (attempts < this.maxRetries) {
            try {
                const response = await fetch(`${this.baseUrl}${endpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.error || `HTTP Error: ${response.status}`);
                }

                if (response.status === 204) {
                    return {} as T;
                }

                return await response.json();
            } catch (error) {
                attempts += 1;
                console.warn(`Attempt ${attempts} failed: ${error}`);

                if (attempts >= this.maxRetries) {
                    throw new Error(`Failed after ${this.maxRetries} attempts: ${error}`);
                }
            }
        }
        throw new Error("Unexpected error: Retry logic failed.");
    }
}

export const gamesService = new GamesService();