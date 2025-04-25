import User from "interfaces/User";

export type AuthResponse = {
    id: number;
    username: string;
    token: string;
};

export type Credentials = {
    username: string;
    password: string;
};

class UserService {
    private maxRetries: number;
    private baseUrl: string;
    private currentUser: User | null;

    constructor(maxRetries: number = 3) {
        this.maxRetries = maxRetries;
        this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3001";
        this.currentUser = null;
    }

    /**
     * Logs in a user and returns a JWT token.
     * @param credentials - The user's login credentials.
     * @returns A promise resolving to the authentication token.
     */
    async login(credentials: Credentials): Promise<AuthResponse> {
        const res = await this.postWithRetry<AuthResponse>("/login", credentials);
        this.currentUser = res;
        return res;
    }

    /**
     * Registers a new user.
     * @param credentials - The user's signup credentials.
     * @returns A promise that resolves when signup is complete.
     */
    async signup(credentials: Credentials): Promise<void> {
        await this.postWithRetry<void>("/register", credentials);
    }

    /**
     * Performs a POST request with retry logic.
     * @param endpoint - The API endpoint.
     * @param body - Request body data.
     * @returns The response data.
     */
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
                    // No content expected (e.g., signup success)
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

    logout(): void {
        this.currentUser = null;
        window.location.reload();
    }

    getToken(): string | undefined {
        return this.currentUser?.token;
    }

    isLoggedIn(): boolean {
        return this.currentUser != null;
    }
}

export const userService = new UserService();
