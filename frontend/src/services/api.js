import axios from 'axios'

// const api = axios.create({
//   baseURL: import.meta.env.DEV
//     ? '/api'                // usa el proxy en desarrollo
//     : 'http://localhost:5000'
// })
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});
// Prueba de conexión
export const ping = () => api.get('/ping')

// Interpolación
export const interpolate = (points, method, xToEval) =>
  api.post('/interpolate', { points, method, xToEval })
