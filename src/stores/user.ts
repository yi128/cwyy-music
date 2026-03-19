// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    loginByPhone,
    subscribePlaylistById,
    unsubscribePlaylistById,
    getUserSubscribedPlaylists,
    checkPlaylistSubscribed
} from '@/api/realApi'

export const useUserStore = defineStore('user', () => {
    // ========== 状态 ==========
    const token = ref('')
    const cookie = ref('')
    const userInfo = ref({
        userId: 0,
        nickname: '',
        avatarUrl: '',
        phone: ''
    })
    const loginHistory = ref<string[]>([]) // 登录历史
    const collectedPlaylistIds = ref<number[]>([]) // 收藏的歌单ID列表
    const collectedPlaylists = ref<any[]>([]) // 收藏的歌单详情

    // ========== 计算属性 ==========
    const isLoggedIn = computed(() => !!token.value && !!cookie.value)

    // ========== 收藏相关方法 ==========

    // 加载收藏的歌单
    const loadCollectedPlaylists = async (uid: number) => {
        try {
            const res = await getUserSubscribedPlaylists(uid)
            if (res.code === 200) {
                collectedPlaylists.value = res.data
                collectedPlaylistIds.value = res.data.map((p: any) => p.id)
                // 保存到 localStorage
                localStorage.setItem('collectedPlaylistIds', JSON.stringify(collectedPlaylistIds.value))
            }
        } catch (error) {
            console.error('加载收藏歌单失败:', error)
        }
    }
    // src/stores/user.ts

    // 收藏歌单
    const subscribePlaylist = async (playlistId: number) => {
        if (!isLoggedIn.value) {
            return { success: false, message: '请先登录' }
        }

        try {
            const res = await subscribePlaylistById(playlistId)
            console.log('收藏API返回:', res)

            if (res.code === 200) {
                // ✅ 更新收藏列表，这会触发 MyPlaylists 中的 watch
                if (!collectedPlaylistIds.value.includes(playlistId)) {
                    collectedPlaylistIds.value = [...collectedPlaylistIds.value, playlistId]
                }
                localStorage.setItem('collectedPlaylistIds', JSON.stringify(collectedPlaylistIds.value))
                return { success: true, message: '收藏成功' }
            }
            return { success: false, message: res.message }
        } catch (error) {
            return { success: false, message: '收藏失败' }
        }
    }

    // 取消收藏
    const unsubscribePlaylist = async (playlistId: number) => {
        if (!isLoggedIn.value) {
            return { success: false, message: '请先登录' }
        }

        try {
            const res = await unsubscribePlaylistById(playlistId)
            if (res.code === 200) {
                // ✅ 更新收藏列表，这会触发 MyPlaylists 中的 watch
                collectedPlaylistIds.value = collectedPlaylistIds.value.filter(id => id !== playlistId)
                localStorage.setItem('collectedPlaylistIds', JSON.stringify(collectedPlaylistIds.value))
                return { success: true, message: '取消收藏成功' }
            }
            return { success: false, message: res.message }
        } catch (error) {
            return { success: false, message: '取消收藏失败' }
        }
    }

    // 检查歌单是否已收藏
    const isPlaylistCollected = (playlistId: number) => {
        return collectedPlaylistIds.value.includes(playlistId)
    }

    // ========== 登录相关方法 ==========

    const loginWithCookie = async (fullCookieString: string) => {
        try {
            console.log('【loginWithCookie】开始');

            cookie.value = fullCookieString;

            const { getLoginStatus } = await import('@/api/realApi');
            const statusRes = await getLoginStatus();
            console.log('【loginWithCookie】状态返回:', statusRes);
            if (statusRes.code === 200 && statusRes.data?.account?.id) {
                const userId = statusRes.data.account.id;
                console.log('【loginWithCookie】获取到 userId:', userId);
                if (statusRes.data?.profile) {
                    const profile = statusRes.data.profile;
                    userInfo.value = {
                        userId: profile.userId,
                        nickname: profile.nickname,
                        avatarUrl: profile.avatarUrl,
                        phone: profile.userName || ''
                    };
                } else {
                    const { getUserDetail } = await import('@/api/realApi');
                    const detailRes = await getUserDetail(userId);
                    if (detailRes.code === 200 && detailRes.data?.profile) {
                        const profile = detailRes.data.profile;
                        userInfo.value = {
                            userId: profile.userId,
                            nickname: profile.nickname,
                            avatarUrl: profile.avatarUrl,
                            phone: profile.userName || ''
                        };
                    }
                }

                token.value = 'cookie_token_' + Date.now();
                localStorage.setItem('token', token.value);
                localStorage.setItem('cookie', fullCookieString);
                localStorage.setItem('userInfo', JSON.stringify(userInfo.value));

                return { success: true, message: '登录成功' };
            }

            return { success: false, message: '获取用户信息失败' };

        } catch (error) {
            return { success: false, message: '登录失败' };
        }
    };
    // 处理二维码登录成功后的回调
    const handleQrLoginSuccess = async (cookieString: string) => {
        try {
            // 保存 cookie
            cookie.value = cookieString;

            // 从 cookie 中解析用户信息
            const { getLoginStatus } = await import('@/api/realApi');
            const statusRes = await getLoginStatus();

            if (statusRes.code === 200 && statusRes.data?.profile) {
                const profile = statusRes.data.profile;
                console.log('【handleQrLoginSuccess】提取到的profile:', profile);
                token.value = 'qr_token_' + Date.now(); // 生成一个本地 token
                userInfo.value = {
                    userId: profile.userId,
                    nickname: profile.nickname,
                    avatarUrl: profile.avatarUrl,
                    phone: profile.phone || ''
                };

                // 保存到 localStorage
                localStorage.setItem('token', token.value);
                localStorage.setItem('cookie', cookieString);
                localStorage.setItem('userInfo', JSON.stringify(userInfo.value));

                // 加载收藏歌单
                await loadCollectedPlaylists(profile.userId);

                return { success: true };
            }
            return { success: false, message: '获取用户信息失败' };
        } catch (error) {
            console.error('二维码登录处理失败:', error);
            return { success: false, message: '登录处理失败' };
        }
    };
    // 真实登录
    const login = async (phone: string, password: string) => {
        try {
            console.log('尝试登录:', phone)

            const res = await loginByPhone(phone, password)
            console.log('登录返回:', res)

            if (res.code === 200 && res.data) {
                const profile = res.data.profile

                // 保存真实的 token 和 cookie
                token.value = res.data.token || ''
                cookie.value = res.data.cookie  // 关键：保存 cookie！

                userInfo.value = {
                    userId: profile.userId,
                    nickname: profile.nickname,
                    avatarUrl: profile.avatarUrl,
                    phone: profile.phone
                }

                // 保存登录历史
                if (!loginHistory.value.includes(phone)) {
                    loginHistory.value.unshift(phone)
                    if (loginHistory.value.length > 5) {
                        loginHistory.value.pop()
                    }
                }

                // 登录成功后加载收藏歌单
                await loadCollectedPlaylists(profile.userId)

                // 保存到 localStorage
                localStorage.setItem('token', token.value)
                localStorage.setItem('cookie', cookie.value)
                localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
                localStorage.setItem('loginHistory', JSON.stringify(loginHistory.value))

                return { success: true, message: '登录成功' }
            }

            return { success: false, message: res.message || '登录失败' }
        } catch (error) {
            console.error('登录异常:', error)
            return { success: false, message: '网络错误' }
        }
    }

    // 登出
    const logout = () => {
        token.value = ''
        cookie.value = ''
        userInfo.value = {
            userId: 0,
            nickname: '',
            avatarUrl: '',
            phone: ''
        }
        collectedPlaylistIds.value = []
        collectedPlaylists.value = []

        // 清除 localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('cookie')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('collectedPlaylistIds')
        // 保留登录历史不清除
    }

    // 从 localStorage 恢复登录状态
    const restoreLogin = () => {
        const savedToken = localStorage.getItem('token')
        const savedCookie = localStorage.getItem('cookie')
        const savedUserInfo = localStorage.getItem('userInfo')
        const savedCollectedIds = localStorage.getItem('collectedPlaylistIds')
        const savedLoginHistory = localStorage.getItem('loginHistory')

        if (savedToken && savedCookie && savedUserInfo) {
            token.value = savedToken
            cookie.value = savedCookie
            userInfo.value = JSON.parse(savedUserInfo)

            if (savedCollectedIds) {
                collectedPlaylistIds.value = JSON.parse(savedCollectedIds)
            }

            if (savedLoginHistory) {
                loginHistory.value = JSON.parse(savedLoginHistory)
            }

            console.log('恢复登录状态成功')
        }
    }

    // 快捷登录（使用历史账号）
    const quickLogin = async (phone: string) => {
        // 使用预设密码，实际项目中可能需要记住密码或单独处理
        return await login(phone, '123456')
    }

    return {
        // 状态
        token,
        cookie,
        userInfo,
        loginHistory,
        collectedPlaylistIds,
        collectedPlaylists,

        // 计算属性
        isLoggedIn,

        // 收藏相关
        subscribePlaylist,
        unsubscribePlaylist,
        isPlaylistCollected,
        loadCollectedPlaylists,

        // 登录相关
        login,
        loginWithCookie,
        handleQrLoginSuccess,
        logout,
        restoreLogin,
        quickLogin
    }
})