import axios from 'axios';

// Use Vite environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor
api.interceptors.request.use((config) => {
    let userInfo = null;

    try {
        userInfo = JSON.parse(localStorage.getItem('userInfo'));
    } catch (error) {
        localStorage.removeItem('userInfo');
    }

    if (userInfo?.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    return config;
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('userInfo');

            if (window.location.pathname !== '/login') {
                const redirect = window.location.pathname;
                window.location.href = `/login?redirect=${redirect}`;
            }
        }

        return Promise.reject(error);
    }
);

export default api;