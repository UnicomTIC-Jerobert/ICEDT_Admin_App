// This is the TypeScript interface for your API's wrapped response
interface ApiResponse<T> {
    result: T;
    isError: boolean;
    error: {
        title: string;
        details: string;
        statusCode: number;
    } | null;
}

// A custom error class for better error handling
export class ApiError extends Error {
    constructor(public title: string, public details: string, public statusCode: number) {
        super(details);
        this.name = 'ApiError';
    }
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const apiClient = {
    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        const data: ApiResponse<T> = await response.json();

        if (!response.ok || data.isError) {
            if (data.error) {
                throw new ApiError(data.error.title, data.error.details, data.error.statusCode);
            }
            throw new Error('An unknown API error occurred.');
        }
        return data.result;
    },
    
    async post<T, TBody>(endpoint: string, body: TBody): Promise<T> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data: ApiResponse<T> = await response.json();

        if (!response.ok || data.isError) {
            if (data.error) {
                throw new ApiError(data.error.title, data.error.details, data.error.statusCode);
            }
            throw new Error('An unknown API error occurred.');
        }
        return data.result;
    },
    
    // You can add put, delete methods here following the same pattern
    async put<TBody>(endpoint: string, body: TBody): Promise<void> {
         const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
         const data: ApiResponse<null> = await response.json(); // PUT/DELETE often have null result
         if (!response.ok || data.isError) {
            if (data.error) {
                throw new ApiError(data.error.title, data.error.details, data.error.statusCode);
            }
            throw new Error('An unknown API error occurred.');
        }
    },

     async delete(endpoint: string): Promise<void> {
        const response = await fetch(`${BASE_URL}${endpoint}`, { method: 'DELETE' });
         const data: ApiResponse<null> = await response.json();
         if (!response.ok || data.isError) {
            if (data.error) {
                throw new ApiError(data.error.title, data.error.details, data.error.statusCode);
            }
            throw new Error('An unknown API error occurred.');
        }
    },
};