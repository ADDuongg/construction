import axios from "axios";
import Cookies from "js-cookie";

const http = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json' ,
        'Accept': 'application/json',
        /* 'Content-Type': 'multipart/form-data' */
        /* 'X-XSRF-TOKEN': csrf_token */
    }
});

http.defaults.withCredentials = true;

http.interceptors.request.use(function (config) {
    const csrf_token = Cookies.get('XSRF-TOKEN');
    config.headers['X-XSRF-TOKEN'] = csrf_token;
    const bearerToken = Cookies.get('access_token');
    if (bearerToken) {
        config.headers.Authorization = `Bearer ${bearerToken}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default http;
