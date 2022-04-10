const axios = require('axios')

const http = axios.create({
    baseURL: 'https://127.0.0.1:2760',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' },
})

http.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        console.log('触发了请求拦截')
        return config
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error)
    }
)

// Add a response interceptor
http.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
    }
)

export default http
