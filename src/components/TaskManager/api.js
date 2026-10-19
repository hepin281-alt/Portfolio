const BASE_URL = 'http://localhost:5001';

// Token Management Helpers
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

// Helper to construct authorization headers
const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Generic response handler with 401 handling
const handleResponse = async (res) => {
  if (res.status === 401) {
    removeToken();
    window.dispatchEvent(new Event('auth:unauthorized'));
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Session expired. Please log in again.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'An error occurred with your request');
  }
  return data;
};

// Auth API Calls
export const registerUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return handleResponse(res);
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await handleResponse(res);
  if (data.token) {
    setToken(data.token);
  }
  return data;
};

export const getProfile = async () => {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: authHeaders()
  });
  return handleResponse(res);
};

// Task CRUD API Calls (Protected with JWT)
export const getTasks = async () => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: authHeaders()
  });
  return handleResponse(res);
};

export const createTask = async (title) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ title })
  });
  return handleResponse(res);
};

export const updateTask = async (id, data) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(res);
};

export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  return handleResponse(res);
};
