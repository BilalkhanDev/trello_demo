import axios from 'axios';

// Create the Axios instance

const api = axios.create({
  baseURL:  `${import.meta.env.VITE_SERVER_URL}/api`, // Use the REACT_APP_SERVER_URL from .env
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (Optional)
api.interceptors.request.use(
  (config) => {
    // You can manipulate the request before sending it (e.g., add authorization token)
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

// Response Interceptor (Optional)
api.interceptors.response.use(
  (response) => {
    // You can manipulate the response or log it here
    return response;
  },
  (error) => {
    // Handle response errors here
    if (error.response) {
      // If there's a response from the server
      const { message } = error.response.data;
      console.error(`API error: ${message}`);
    } else if (error.request) {
      console.error('No response from server');
    } else {
      console.error('Error setting up request');
    }
    return Promise.reject(error);
  }
);

export default api;
