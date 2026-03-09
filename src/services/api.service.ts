import { auth } from "../configs/firebase";



interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    errors?: any[];
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

    private handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error || 'Request failed',
                errors: data.errors
            };
        }

        return {
            success: true,
            data: data.data
        };
    };

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseURL}${endpoint}`, { headers });
            return this.handleResponse<T>(response);
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
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
            return this.handleResponse<T>(response);
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async put<T, D = any>(endpoint: string, body: D): Promise<ApiResponse<T>> {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(body),
            });
            return this.handleResponse<T>(response);
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async delete<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers, 
                body: JSON.stringify(body),
            });
            return this.handleResponse<T>(response);
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export const apiService = new ApiService();