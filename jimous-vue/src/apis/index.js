import http from '@/utils/http.js';

export const uploadImg = (params) => http.post('/upload_img', params);

export const getUserInfo = (params) => http.post('/get_info', params);
