/**
 * Backend API base URL. For local dev use the backend running on port 5000.
 */
export const API_BASE_URL =
  typeof window !== 'undefined'
    ? (window.__SKOOLWAY_API__ ?? 'http://localhost:5000')
    : 'http://localhost:5000';
