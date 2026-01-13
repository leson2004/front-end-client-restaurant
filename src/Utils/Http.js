import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINT } from '../Config/Client/APIs';

const createHttpInstance = () => {
    const instance = axios.create({
        baseURL: API_ENDPOINT,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const decodedToken = jwtDecode(token);

                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                    const navigate = useNavigate();
                    navigate('/login');
                    return Promise.reject(new Error('Token expired'));
                }

                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return instance;
};

const http = createHttpInstance();

export default http;
