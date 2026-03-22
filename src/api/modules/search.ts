// ==================== 搜索相关 ====================
import { request } from '../request';

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