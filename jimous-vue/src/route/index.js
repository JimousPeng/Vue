import IndexPage from '../pages/index/index.vue';
import IndexPoster from '../pages/poster/index.vue';

export const routes = [
    {
        path: '/',
        redirect: '/index',
    },
    {
        path: '/index',
        component: IndexPage,
    },
    {
        path: '/poster',
        name: 'poster',
        component: IndexPoster,
    },
];

