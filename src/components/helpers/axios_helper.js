import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config}, (error) => {
    return Promise.reject(error);
});

export const request = api;
export const setAuthHeader = (token) => {
  localStorage.setItem('auth_token', token);
};
export const getAuthToken = () => localStorage.getItem('auth_token');