import router from "./index";
import { useUserStore } from "@/stores/user";
import { ElMessage } from 'element-plus';

// 白名单：不需要登录就可以访问的页面
const whiteList = ['/', '/search', '/playlist/'];

// 需要登录才能访问的页面
const needLoginPages = [
    '/my-playlists',
    // 以后可以添加更多需要登录的页面
    // '/user/profile',
    // '/user/settings',
];

// 路由守卫
router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    // 获取当前路径
    const path = to.path;

    // 检查当前页面是否需要登录
    const needLogin = needLoginPages.some(page => path.startsWith(page));

    if (needLogin) {
        // 需要登录但用户未登录
        if (!userStore.isLoggedIn) {
            ElMessage.warning('请先登录后再访问');
            next('/'); // 跳转到首页
            return;
        }
    }

    // 页面标题（可选）
    if (to.meta.title) {
        document.title = `${to.meta.title} - 网易云音乐`;
    } else {
        document.title = '网易云音乐';
    }

    // 放行
    next();
});

// 路由跳转后的钩子
router.afterEach(() => {
    // 可以做一些后续处理，比如关闭loading等
    console.log('路由跳转完成');
});