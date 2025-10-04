/**
 * API Client
 *
 * Fetch wrapper with error handling for backend API communication.
 * Supports configurable base URL via environment variable.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Custom API Error class for structured error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API client fetch wrapper with error handling
 *
 * @param endpoint - API endpoint path (e.g., '/api/health')
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns Promise<T> - Parsed JSON response
 * @throws {ApiError} - Network errors, 4xx, 5xx responses
 */
export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    // Handle non-OK responses (4xx, 5xx)
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Failed to parse error response, use default message
      }

      throw new ApiError(errorMessage, response.status, response.statusText);
    }

    // Parse and return JSON response
    return await response.json();
  } catch (error) {
    // Handle network errors (connection refused, timeout, etc.)
    if (error instanceof TypeError) {
      throw new ApiError('Network error - check your connection', 0, 'Network Error');
    }

    // Re-throw ApiError or other errors
    throw error;
  }
}

/**
 * Response type helpers for common API patterns
 */

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
