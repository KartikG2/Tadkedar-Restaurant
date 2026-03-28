/**
 * Centralized API utility for all backend calls with token-based auth
 * Automatically includes Authorization header with stored admin token
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get authorization headers with admin token from localStorage
 */
export function getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
}

/**
 * Enhanced fetch wrapper for API calls
 * Automatically uses correct backend URL and includes auth token
 */
export async function apiFetch(
    path: string,
    options: RequestInit = {}
): Promise<Response> {
    const url = `${BASE_URL}${path}`;
    
    return fetch(url, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...(options.headers || {}),
        },
    });
}

export default apiFetch;
