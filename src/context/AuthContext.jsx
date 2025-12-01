import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './base';
import http from '../api/http';

// Login path can be configured via env
const LOGIN_PATH = import.meta.env.VITE_LOGIN_PATH || '/api/auth/login';
// Configure payload field names and body type
const EMAIL_FIELD = import.meta.env.VITE_LOGIN_EMAIL_FIELD || 'email';
const PASSWORD_FIELD = import.meta.env.VITE_LOGIN_PASSWORD_FIELD || 'password';
const BODY_TYPE = (import.meta.env.VITE_LOGIN_BODY_TYPE || 'json').toLowerCase();
const WITH_CREDENTIALS = import.meta.env.VITE_HTTP_WITH_CREDENTIALS === 'true';


export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Initialize from localStorage on first load
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch { /* ignore */ }
    }
    setInitializing(false);
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const payload = { [EMAIL_FIELD]: email, [PASSWORD_FIELD]: password };
      let body = payload;
      const config = {};
      if (BODY_TYPE === 'form') {
        body = new URLSearchParams(payload);
        config.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      }
      if (WITH_CREDENTIALS) {
        config.withCredentials = true;
      }

      console.debug('Login request', {
        baseURL: http?.defaults?.baseURL,
        path: LOGIN_PATH,
        bodyType: BODY_TYPE,
        fields: Object.keys(payload),
        withCredentials: !!WITH_CREDENTIALS,
      });

      const res = await http.post(LOGIN_PATH, body, config);

// YOUR TOKEN & USER ARE INSIDE `data.data`
const jwt = res.data?.data?.token;
const userObj = res.data?.data?.user;

if (!jwt) throw new Error("Token missing in response");

// Save token
localStorage.setItem("auth_token", jwt);
setToken(jwt);

// Save user
if (userObj) {
  localStorage.setItem("auth_user", JSON.stringify(userObj));
  setUser(userObj);
}

return { ok: true };
    } catch (err) {
      let message;
      if (err?.code === 'ERR_NETWORK') {
        message = 'Network error: unable to reach API';
      } else {
        message = err?.response?.data?.message || err.message || 'Login failed';
      }
      console.error('Login error', {
        baseURL: http?.defaults?.baseURL,
        path: LOGIN_PATH,
        status: err?.response?.status,
        data: err?.response?.data,
        error: err?.message,
      });
      setAuthError(message);
      return { ok: false, error: message };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: !!token,
    initializing,
    authError,
    authLoading,
    login,
    logout,
  }), [token, user, initializing, authError, authLoading]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

// Moved to a separate file to satisfy fast-refresh lint rules
