const STORAGE_KEY = 'x-api-key';

export const storeApiKey = (apiKey) => {
  localStorage.setItem(STORAGE_KEY, apiKey);
};

export const getApiKey = () => localStorage.getItem(STORAGE_KEY);

export const clearApiKey = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
attach X-API-Key header to all /api/ requests
usage: import axios from 'axios'; setupApiKeyInterceptor(axios);
 */
export const setupApiKeyInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use((config) => {
    const isApiRoute = config.url?.includes('/api/');
    const apiKey = getApiKey();
    if (isApiRoute && apiKey) config.headers['X-API-Key'] = apiKey;
    return config;
  });
};
