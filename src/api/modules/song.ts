// ==================== 歌曲相关 ====================
import { request } from '../request';

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

// 获取歌曲播放地址
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