import { request } from '../request';
import { compressImage } from './utils';
// 获取轮播图
export const getBanners = async () => {
    try {
        const response = await request.get('/banner');
        const banners = (response.data.banners || []).map((item: any) => ({
            ...item,
            imageUrl: compressImage(item.bigImageUrl || item.imageUrl, 800)  // 轮播图压缩到 800宽
        }))
        return {
            code: 200,
            data: banners || []
        };
    } catch (error) {
        return { code: 500, message: '获取轮播图失败', data: [] };
    }
};
// 获取推荐歌单
export const getRecommendPlaylists = async (limit = 6) => {
    try {
        const response = await request.get('/personalized', {
            params: { limit }
        });
        const playlists = response.data.result.map((item: any) => ({
            ...item,
            picUrl: compressImage(item.picUrl, 200)  // 歌单封面压缩到 200x200
        }))
        return {
            code: 200,
            data: playlists || []
        };
    } catch (error) {
        return { code: 500, message: '获取推荐歌单失败', data: [] };
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