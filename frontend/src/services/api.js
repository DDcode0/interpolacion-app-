import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

export const ping = () => api.get('/ping');
