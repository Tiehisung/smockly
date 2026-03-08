import { auth } from "../configs/firebase";

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

class ApiService {
    private baseURL: string;

    constructor(baseURL: string = import.meta.env.VITE_API_URL) {
        this.baseURL = baseURL;
    }

    private async getHeaders(): Promise<HeadersInit> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseURL}${endpoint}`, { headers });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { data };
        } catch (error: any) {
            return { error: error.message };
        }
    }

    async post<T, D = any>(endpoint: string, body: D): Promise<ApiResponse<T>> {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { data };
        } catch (error: any) {
            return { error: error.message };
        }
    }
}

export const apiService = new ApiService();