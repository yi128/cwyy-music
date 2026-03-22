import axios from 'axios';

// API基础地址（根据你的实际服务地址修改）
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// 创建axios实例
export const request = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    withCredentials: true  // 允许携带 Cookie
});

// 响应拦截器：统一处理返回格式
request.interceptors.response.use(
    (response) => {
        return {
            code: 200,
            message: 'success',
            data: response.data,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config: response.config
        };
    },
    (error) => {
        return Promise.reject({
            code: 500,
            message: error.message || '请求失败',
            data: null,
        });
    }
);