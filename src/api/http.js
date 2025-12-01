import axios from 'axios';

// Configure base URL via env: VITE_API_BASE_URL
// If not provided, use relative paths (works with Vite dev proxy)
const baseURL = import.meta.env.VITE_API_BASE_URL ?? '';

const http = axios.create({ baseURL });

// Attach JWT token to Authorization header if present
http.interceptors.request.use((config) => {

  // 🚫 Do NOT attach token for login request
  if (config.url.includes("/auth/login")) return config;

  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// Optional: handle 401 by clearing token (we'll let context handle logout)
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } catch {
        /* ignore */
      }
      const current = window.location?.pathname || '/';
      if (current !== '/login' && current !== '/') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default http;
