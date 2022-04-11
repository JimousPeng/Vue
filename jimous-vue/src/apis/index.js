import http from '@/utils/http.js'

export const uploadImg = (params) => http.post('/upload_img', params)
