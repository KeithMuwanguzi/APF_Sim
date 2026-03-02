import axios from 'axios';

const STRAPI_URL = 'http://localhost:1337';
const ADMIN_TOKEN = '0889ca4cdbb55fdeddaa95f0dfca91eb8bb3dc15664b0912f4d1eeb661e9b905391c39fe965054160282519bf8fa7e8570b53b98d4a6f6427e53c7887e63e6f317a8f128fa7c44b33de19ce94db7b2ae72d3d3468fa0ac64e1d35e12d69d56a62cb8c485f4a6df25ba661cf97d7ca070db2e83cf3dcb687b3df73f18f21269ab';

/**
 * Interfaces
 */
export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: any;
}

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  date: string;
  image?: any;
}

const api = axios.create({ 
  baseURL: `${STRAPI_URL}/api`, 
  headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
});

/**
 * HOMEPAGE
 *
 */
export const getHomepage = async () => {
  const res = await api.get('/homepage', {
    params: {
      populate: {
        hero: { populate: '*' },
        stats: { populate: '*' },
        chairMessage: { populate: '*' },
        connectingProfessionals: { populate: '*' },
        partnerlogo: { populate: '*' }
      }
    }
  }); 
  return res.data.data; 
};

export const updateHomepage = async (payload: any) => {
  return api.put('/homepage', { data: payload });
};

/**
 * NEWS
 */
export const getNews = async () => {
  const res = await api.get('/news-items', {
    params: {
      populate: '*',
      sort: 'createdAt:desc'
    }
  });
  return res.data.data;
};

export const createNews = async (payload: any) => {
  return api.post('/news-items', { data: payload });
};

export const updateNews = async (id: number, payload: any) => {
  return api.put(`/news-items/${id}`, { data: payload });
};

export const deleteNews = async (id: number) => {
  return api.delete(`/news-items/${id}`);
};

/**
 * EVENTS
 */
export const getEvents = async () => {
  const res = await api.get('/events', {
    params: {
      populate: '*',
      sort: 'date:asc'
    }
  });
  return res.data.data;
};

export const createEvent = async (payload: any) => {
  return api.post('/events', { data: payload });
};

export const deleteEvent = async (id: number) => {
  return api.delete(`/events/${id}`);
};

export default api;