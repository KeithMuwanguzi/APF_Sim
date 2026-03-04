import axios from 'axios';
import { CMS_BASE_URL } from '../config/api';

// Strapi URL
const STRAPI_URL = `${CMS_BASE_URL}/api`;

const api = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
