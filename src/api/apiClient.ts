import axios, { type AxiosInstance } from 'axios';

// Base URLs de los servicios
const AUTH_BASE_URL = 'https://auth-service-autogiad.onrender.com';
const WORKSHOP_BASE_URL = 'https://workshop-service-autodiag.onrender.com/api/workshops/workshops';

// Cliente para Auth Service
export const authClient = axios.create({
    baseURL: AUTH_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Cliente para Workshop Service
export const workshopClient = axios.create({
    baseURL: WORKSHOP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token a las peticiones
const addAuthInterceptor = (client: AxiosInstance) => {
    client.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                console.log('Adding token to request:', config.url);
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                console.warn('No token found for request:', config.url);
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
};

// Agregar interceptor a ambos clientes
addAuthInterceptor(authClient);
addAuthInterceptor(workshopClient);

// Interceptor para manejar errores globalmente
const addErrorInterceptor = (client: AxiosInstance) => {
    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Token inválido o expirado
                //localStorage.removeItem('token');
                //localStorage.removeItem('role');
                //window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
};

addErrorInterceptor(authClient);
addErrorInterceptor(workshopClient);
