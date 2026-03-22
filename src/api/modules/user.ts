// ==================== 用户相关 ====================
import { request } from '../request';

// 手机号登录
export const loginByPhone = async (phone: string, password: string) => {
    try {
        // 对密码进行编码
        const encodedPassword = encodeURIComponent(password);

        const response = await request.get('/login/cellphone', {
            params: {
                phone,
                password: encodedPassword
            }
        });

        console.log('登录接口原始返回:', response.data);

        if (response.data.code === 200) {
            return {
                code: 200,
                data: {
                    profile: response.data.profile,
                    cookie: response.data.cookie,
                    token: response.data.token
                }
            };
        }

        // 处理风控错误
        if (response.data.code === 8821) {
            return {
                code: 8821,
                message: '需要行为验证码，建议使用二维码登录',
                data: null
            };
        }

        return { code: response.data.code, message: response.data.message || '登录失败', data: null };
    } catch (error) {
        console.error('登录请求失败:', error);
        return { code: 500, message: '网络错误', data: null };
    }
};

// ==================== 二维码登录相关 ====================

// 1. 获取二维码 key
export const getQrCodeKey = async () => {
    try {
        const response = await request.get('/login/qr/key');
        console.log('获取二维码key返回:', response.data);

        if (response.data.code === 200) {
            return {
                code: 200,
                data: response.data.data
            };
        }
        return { code: response.data.code, message: '获取二维码key失败', data: null };
    } catch (error) {
        console.error('获取二维码key失败:', error);
        return { code: 500, message: '网络错误', data: null };
    }
};

// 2.获取二维码图片
export const getQrCodeBase64 = async (key: string) => {
    try {
        const response = await request.get('/login/qr/create', {
            params: { key, qrimg: true }
        });

        if (response.data.code === 200) {
            if (response.data.data?.qrimg) {
                console.log('获取到的二维码图片:', response.data.data.qrimg);
                return {
                    code: 200,
                    data: response.data.data.qrimg
                };
            }
            else if (response.data.qrimg) {
                return {
                    code: 200,
                    data: response.data.qrimg
                };
            }
        }

        // 如果上面都不匹配，直接使用图片URL方式
        const imgUrl = `${BASE_URL}/login/qr/create?key=${key}&qrimg=true`;
        return {
            code: 200,
            data: imgUrl  // 直接返回URL
        };

    } catch (error) {
        console.error('获取二维码图片失败:', error);
        return { code: 500, message: '网络错误', data: null };
    }
};

// 3. 检查扫码状态
export const checkQrStatus = async (key: string) => {
    try {
        const response = await request.get('/login/qr/check', {
            params: { key }
        });

        // 返回码说明：
        // 800: 二维码过期
        // 801: 等待扫码
        // 802: 已扫码，等待确认
        // 803: 登录成功
        return {
            code: response.data.code,
            message: response.data.message,
            cookie: response.data.cookie,
            data: response.data
        };
    } catch (error) {
        console.error('检查扫码状态失败:', error);
        return { code: 500, message: '网络错误', data: null };
    }
};

// 获取登录状态
export const getLoginStatus = async () => {
    try {
        const response = await request.get('/login/status');

        if (response.data?.data?.code === 200) {
            console.log(response.data.data);
            return {
                code: 200,
                data: response.data.data
            };
        }
        return { code: response.data.code, message: '获取登录状态失败', data: null };
    } catch (error) {
        console.error('获取登录状态失败:', error);
        return { code: 500, message: '网络错误', data: null };
    }
};
// 获取用户详情
export const getUserDetail = async (userId: number) => {
    try {
        const response = await request.get('/user/detail', {
            params: { uid: userId }
        });
        console.log('【getUserDetail】返回:', response.data);

        if (response.data.code === 200) {
            return {
                code: 200,
                data: response.data
            };
        }
        return { code: 500, message: '获取用户详情失败', data: null };
    } catch (error) {
        console.error('【getUserDetail】失败:', error);
        return { code: 500, message: '网络错误', data: null };
    }
};
// 获取用户创建的歌单列表

export const getUserCreatedPlaylists = async (uid: number, currentUserId: number) => {
    try {
        const result = await request.get('/user/playlist', {
            params: {
                uid,
                limit: 100  // 获取前100个
            }
        });
        if (result.data.code === 200) {
            // 过滤出用户创建的歌单（创建者ID等于当前用户ID）
            const created = result.data.playlist.filter((playlist: any) =>
                playlist.creator?.userId === currentUserId
            );

            return {
                code: 200,
                data: created,
                total: created.length
            };
        }

        return result;
    } catch (error) {
        console.error('【getUserCreatedPlaylists】失败:', error);
        return { code: 500, message: '网络错误', data: [] };
    }
};

/**
 * 获取用户收藏的歌单列表
 * @param uid 用户ID
 */
export const getUserSubscribedPlaylists = async (uid: number) => {
    try {
        const response = await request.get('/user/playlist', {
            params: {
                uid,
                limit: 100  // 获取前100个
            }
        });

        if (response.data.code === 200) {
            // 过滤出收藏的歌单（不是自己创建的）
            const subscribed = response.data.playlist.filter((p: any) => p.subscribed);
            return {
                code: 200,
                data: subscribed
            };
        }
        return { code: response.data.code, message: '获取失败', data: [] };
    } catch (error) {
        console.error('获取收藏歌单失败:', error);
        return { code: 500, message: '网络错误', data: [] };
    }
};