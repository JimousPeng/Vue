const IndexPage = () => import(/* webpackChunkName: "page_index" */ '../pages/index/index.vue')
const IndexPoster = () => import(/* webpackChunkName: "page_index" */ '../pages/poster/index.vue')

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

