import { createRouter, createWebHashHistory } from 'vue-router'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layout/Layout.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          // 懒加载
          component: () => import('@/views/Home.vue')
        },
        {
          path: 'my-playlists',
          name: 'MyPlaylists',
          component: () => import('@/views/MyPlaylists.vue')
        },
        // 歌单详情页
        {
          path: 'playlist/:playlistId',
          name: 'PlaylistDetail',
          component: () => import('@/views/PlaylistDetail.vue')
        },
        // 搜索结果页
        {
          path: '/search',
          name: 'SearchResult',
          component: () => import('@/views/SearchResult.vue')
        }
      ]
    },
  ]
})
export default router