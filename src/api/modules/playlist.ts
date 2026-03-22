// ==================== 歌单相关 ====================
import { request } from '../request';

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

