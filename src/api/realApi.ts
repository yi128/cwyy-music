import axios from 'axios';

// API基础地址（根据你的实际服务地址修改）
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// 创建axios实例
const request = axios.create({
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
// ==================== 用户相关 ====================

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

// 2. 生成二维码图片（返回图片URL）
export const getQrCode = (key: string) => {
    const url = `${BASE_URL}/login/qr/create?key=${key}&qrimg=true`;
    return url;
};

// 3.获取二维码图片
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

// 4. 检查扫码状态
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
// ==================== 歌曲相关 ====================

// 获取歌曲详情
export const getSongDetail = async (id: number) => {
    try {
        const response = await request.get('/song/detail', {
            params: { ids: id }
        });
        return {
            code: 200,
            data: response.data.songs[0]
        };
    } catch (error) {
        return { code: 500, message: '获取歌曲失败', data: null };
    }
};

// 获取歌曲播放地址（增强版支持无损音质）
export const getSongUrl = async (id: number, br?: number) => {
    try {
        // br参数：128000(标准), 192000(较高), 320000(极高), 999000(无损)
        const response = await request.get('/song/url/v1', {
            params: {
                id,
                level: br === 999000 ? 'lossless' : 'standard',
                br: br || 320000
            }
        });
        const url = response.data.data[0]?.url;
        return {
            code: 200,
            data: { url }
        };
    } catch (error) {
        return { code: 500, message: '获取播放地址失败', data: { url: '' } };
    }
};

// 获取歌词
export const getLyric = async (id: string) => {
    try {
        const response = await request.get('/lyric', {
            params: { id }
        });
        return {
            code: 200,
            data: response.data
        };
    } catch (error) {
        return { code: 500, message: '获取歌词失败', data: null };
    }
};

// ==================== 歌单相关 ====================

// 获取推荐歌单
export const getRecommendPlaylists = async (limit = 6) => {
    try {
        const response = await request.get('/personalized', {
            params: { limit }
        });
        return {
            code: 200,
            data: response.data.result || []
        };
    } catch (error) {
        return { code: 500, message: '获取推荐歌单失败', data: [] };
    }
};

// 获取歌单详情
export const getPlaylistDetail = async (id: number) => {
    try {
        const response = await request.get('/playlist/detail', {
            params: { id }
        });
        return {
            code: 200,
            data: response.data.playlist
        };
    } catch (error) {
        return { code: 500, message: '获取歌单详情失败', data: null };
    }
};


// ==================== 收藏相关 ====================

/**
 * 收藏歌单
 * @param id 歌单ID
 * @param t 操作类型：1 收藏, 2 取消收藏
 */
export const subscribePlaylist = async (id: number | string, t: 1 | 2 = 1) => {
    try {
        const response = await request.get('/playlist/subscribe', {
            params: {
                id,
                t
            }
        });

        if (response.data.code === 200) {
            return {
                code: 200,
                message: t === 1 ? '收藏成功' : '取消收藏成功',
                data: response.data
            };
        }
        return {
            code: response.data.code,
            message: response.data.message || '操作失败',
            data: null
        };
    } catch (error) {
        console.error('收藏操作失败:', error);
        return { code: 500, message: '网络错误', data: null };
    }
};

/**
 * 收藏歌单（便捷方法）
 * @param id 歌单ID
 */
export const subscribePlaylistById = async (id: number | string) => {
    return subscribePlaylist(id, 1);
};

/**
 * 取消收藏歌单（便捷方法）
 * @param id 歌单ID
 */
export const unsubscribePlaylistById = async (id: number | string) => {
    return subscribePlaylist(id, 2);
};

/**
 * 检查歌单是否已收藏
 * @param id 歌单ID
 * @param cookie 用户cookie（需要登录状态）
 */
export const checkPlaylistSubscribed = async (id: number | string, cookie?: string) => {
    try {
        const config: any = {
            params: { id }
        };

        // 如果有cookie，添加到请求头
        if (cookie) {
            config.headers = { Cookie: cookie };
        }

        const response = await request.get('/playlist/detail', config);

        if (response.data.code === 200) {
            return {
                code: 200,
                data: response.data.playlist.subscribed || false
            };
        }
        return { code: response.data.code, message: '获取失败', data: false };
    } catch (error) {
        console.error('检查收藏状态失败:', error);
        return { code: 500, message: '网络错误', data: false };
    }
};
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
// ==================== 首页相关 ====================

// 获取轮播图
export const getBanners = async () => {
    try {
        const response = await request.get('/banner');
        return {
            code: 200,
            data: response.data.banners || []
        };
    } catch (error) {
        return { code: 500, message: '获取轮播图失败', data: [] };
    }
};

// 获取最新音乐
export const getNewSongs = async (limit = 10) => {
    try {
        const response = await request.get('/personalized/newsong', {
            params: { limit }
        });
        return {
            code: 200,
            data: response.data.result || []
        };
    } catch (error) {
        return { code: 500, message: '获取最新音乐失败', data: [] };
    }
};

// ==================== 搜索相关 ====================

// 搜索
export const search = async (keywords: string, type = 1, limit = 30) => {
    // type: 1 歌曲, 10 专辑, 100 歌手, 1000 歌单, 1004 MV, 1006 歌词, 1009 电台
    try {
        const response = await request.get('/search', {
            params: { keywords, type, limit }
        });
        console.log('搜索响应:', response.data);
        return {
            code: 200,
            data: response.data.result
        };
    } catch (error) {
        return { code: 500, message: '搜索失败', data: null };
    }
};

// 搜索建议（支持多类型）
export const searchSuggest = async (keywords: string) => {
    try {
        const response = await request.get('/search/suggest', {
            params: { keywords }
        });
        return {
            code: 200,
            data: response.data.result
        };
    } catch (error) {
        return { code: 500, message: '获取搜索建议失败', data: null };
    }
};

// ==================== 导出所有接口 ====================
export default {
    loginByPhone,
    getQrCodeKey,
    getQrCode,
    getQrCodeBase64,
    checkQrStatus,
    getLoginStatus,
    getSongDetail,
    getSongUrl,
    getLyric,
    getRecommendPlaylists,
    getPlaylistDetail,
    subscribePlaylist,
    getUserCreatedPlaylists,
    subscribePlaylistById,
    unsubscribePlaylistById,
    checkPlaylistSubscribed,
    getBanners,
    getNewSongs,
    search,
    searchSuggest,
};