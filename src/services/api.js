import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Django backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Login function
const login = async (username, password) => {
  try {
    // Create Basic Auth header
    const credentials = btoa(`${username}:${password}`);
    const headers = {
      Authorization: `Basic ${credentials}`,
    };

    // Login request
    const response = await axios.post(
      "http://localhost:8000/api/login/",
      {
        username,
        password,
      },
      { headers }
    );

    // Return response with credentials for storage
    return {
      ...response.data,
      password, // Store password for Basic Auth
    };
  } catch (error) {
    throw error;
  }
};

// Register function
const register = async (username, email, password) => {
  try {
    const response = await axios.post("http://localhost:8000/api/register/", {
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
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      const credentials = btoa(`${userData.username}:${userData.password}`);
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
      // Remove invalid credentials and redirect to login
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export { api as default, login, register };
