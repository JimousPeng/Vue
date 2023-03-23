/*
 * @Author: jimouspeng
 * @Date: 2023-03-15 19:29:52
 * @Description: 
 * @FilePath: \vue\vue-three\src\main.ts
 */
import { createApp, h } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'


const app = createApp(App)


app.use(createPinia())
app.use(router)

app.mount('#app')
