import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for automatic token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Don't try to refresh for refresh/logout endpoints or if already retried
        const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh');
        const isLogoutEndpoint = originalRequest.url?.includes('/auth/logout');

        if (isRefreshEndpoint || isLogoutEndpoint || originalRequest._retry) {
            return Promise.reject(error);
        }

        // If 401, try to refresh token once
        if (error.response?.status === 401) {
            originalRequest._retry = true;

            try {
                await api.post('/auth/refresh');
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear any state and do nothing
                // The auth provider will handle redirects
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
