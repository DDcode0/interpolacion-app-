import axios from 'axios';

// Ajusta la URL al backend
const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Función ping para probar conexión
export function ping() {
  return api.get('/ping');
}
