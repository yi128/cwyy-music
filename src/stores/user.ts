import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
    // 状态
    const token = ref('')
    const userInfo = ref({
        userId: '',
        nickname: '',
        avatarUrl: '',
        phone: ''
    })
    const loginHistory = ref<string[]>([]) // 登录历史

    // 计算属性
    const isLoggedIn = computed(() => !!token.value)

    // 登录
    const login = (phone: string, password: string) => {
        // 模拟登录成功
        token.value = 'mock_token_' + Date.now()
        userInfo.value = {
            userId: 'user_' + Date.now(),
            nickname: phone.slice(0, 3) + '****' + phone.slice(-4),
            avatarUrl: 'https://picsum.photos/100/100?random=' + Math.random(),
            phone
        }

        // 保存登录历史
        if (!loginHistory.value.includes(phone)) {
            loginHistory.value.unshift(phone)
            if (loginHistory.value.length > 5) {
                loginHistory.value.pop()
            }
        }
        // 保存到 localStorage
        localStorage.setItem('token', token.value)
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    }

    // 登出
    const logout = () => {
        token.value = ''
        userInfo.value = {
            userId: '',
            nickname: '',
            avatarUrl: '',
            phone: ''
        }
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
    }

    // 从 localStorage 恢复登录状态
    const restoreLogin = () => {
        const savedToken = localStorage.getItem('token')
        const savedUserInfo = localStorage.getItem('userInfo')

        if (savedToken && savedUserInfo) {
            token.value = savedToken
            userInfo.value = JSON.parse(savedUserInfo)
        }
    }

    return {
        token,
        userInfo,
        loginHistory,
        isLoggedIn,
        login,
        logout,
        restoreLogin
    }
})