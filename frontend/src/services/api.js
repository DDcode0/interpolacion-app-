import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Test de conexión
export const ping = () => api.get('/ping');

// Interpolación
export const interpolate = (points, method, xToEval) =>
  api.post('/interpolate', { points, method, xToEval });
