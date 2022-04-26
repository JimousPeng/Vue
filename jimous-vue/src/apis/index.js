import http from '@/utils/http.js';

export const uploadImg = (params) => http.post('/upload_img', params);

export const getUserInfo = (params) => http.post('/get_info', params);

/** 拉去海报 */
export const loaderPoster = (params) => http.get('/loader_poster', params);
