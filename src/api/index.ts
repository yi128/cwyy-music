// 直接导入mock，完全脱离网络
import mockApi from '@/mock'

// 导出所有mock接口
export const {
    // 音乐
    getSongDetail,
    getSongUrl,
    getLyric,
    searchSongs,

    // 歌单
    getRecommendPlaylists,
    getPlaylistDetail,
    getPlaylistTracks,
    searchPlaylists,

    // 我的歌单
    getCreatedPlaylists,
    getCollectedPlaylists,
    createPlaylist,

    // 首页
    getBanners,
    getNewSongs,
    getHotSongs,

    // 歌手
    getSingers,
    getSingerDetail,
    getSingerSongs
} = mockApi

// 为了兼容性，保留request对象但不用
export const request = null