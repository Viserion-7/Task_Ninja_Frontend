import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'http://localhost:8000/api',  // Django backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Login function
const login = async (username, password) => {
    try {
        const response = await axios.post('http://localhost:8000/api/login/', {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Register function
const register = async (username, email, password) => {
    try {
        const response = await axios.post('http://localhost:8000/api/register/', {
            username,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add request interceptor to include auth credentials
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user');
        if (user) {
            // Add auth header with Base64 encoded credentials
            const { username, password } = JSON.parse(user);
            const credentials = btoa(`${username}:${password}`);
            config.headers.Authorization = `Basic ${credentials}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login page on authentication error
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export { api as default, login, register };
