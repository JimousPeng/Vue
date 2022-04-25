const axios = require('axios');

const http = axios.create({
    baseURL: 'http://127.0.0.1:2766',
    timeout: 30 * 1000,
    headers: { 'X-Custom-Header': 'foobar' },
});

http.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        console.log('触发了请求拦截', config.headers);
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
http.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        if (response.status === 200) {
            return response.data;
        }
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    }
);

export default http;
