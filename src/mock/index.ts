import { delay } from './utils/delay'
import { hotSongs, newSongs, songUrls } from './data/songs'
import { recommendPlaylists, playlistDetails, createdPlaylists } from './data/playlists'
import { banners, singers } from './data/banners'
import type { Playlist } from '@/types/music'

// 统一返回格式
interface MockResponse<T = any> {
    code: number
    message: string
    data: T
    timestamp?: number
}

// 成功响应
const success = <T>(data: T, message = 'success'): MockResponse<T> => ({
    code: 200,
    message,
    data,
    timestamp: Date.now()
})

// 失败响应
const error = (message = 'error', code = 500): MockResponse<null> => ({
    code,
    message,
    data: null,
    timestamp: Date.now()
})

// ==================== 音乐相关 ====================
export const mockApi = {
    // 获取歌曲详情
    async getSongDetail(id: string) {
        await delay()
        const song = hotSongs.find(s => s.id === id) || newSongs.find(s => s.id === id)
        if (song) {
            return success(song)
        }
        return error('歌曲不存在', 404)
    },

    // 获取歌曲播放地址
    async getSongUrl(id: string) {
        await delay()
        const url = songUrls[id]
        if (url) {
            return success({ url, id, br: 128000 })
        }
        // 返回默认试听地址
        return success({
            url: 'https://music.163.com/song/media/outer/url?id=167876.mp3',
            id,
            br: 128000
        })
    },

    // 获取歌词
    async getLyric(id: string) {
        await delay(200)
        const song = hotSongs.find(s => s.id === id)
        if (song?.lyric) {
            return success({ lyric: song.lyric })
        }
        return success({ lyric: '[00:00.00]暂无歌词' })
    },

    // 搜索歌曲
    async searchSongs(keyword: string, page = 1, limit = 20) {
        await delay(400)
        const results = hotSongs.filter(song =>
            song.name.includes(keyword) ||
            song.singer.some(s => s.name.includes(keyword))
        )
        const start = (page - 1) * limit
        const end = start + limit
        return success({
            songs: results.slice(start, end),
            total: results.length,
            page,
            limit
        })
    },

    // ==================== 歌单相关 ====================
    // 获取推荐歌单
    async getRecommendPlaylists(limit = 6) {
        await delay(350)
        return success(recommendPlaylists.slice(0, limit))
    },

    // 获取歌单详情
    async getPlaylistDetail(id: string) {
        await delay(450)
        const detail = playlistDetails[id]
        if (detail) {
            return success(detail)
        }
        return error('歌单不存在', 404)
    },

    // 获取歌单所有歌曲
    async getPlaylistTracks(id: string, limit = 100, offset = 0) {
        await delay(300)
        const detail = playlistDetails[id]
        if (detail) {
            return success({
                tracks: detail.tracks.slice(offset, offset + limit),
                total: detail.tracks.length
            })
        }
        return error('歌单不存在', 404)
    },
    // 搜索歌单
    async searchPlaylists(keyword: string, page = 1, limit = 20) {
        await delay(400)
        // 从 recommendPlaylists 或 playlistDetails 中搜索
        const allPlaylists = Object.values(playlistDetails) // 把对象转成数组
        const results = allPlaylists.filter(playlist =>
            playlist.name.includes(keyword) ||
            (playlist.description && playlist.description.includes(keyword))
        )
        const start = (page - 1) * limit
        const end = start + limit
        return success({
            playlists: results.slice(start, end),
            total: results.length,
            page,
            limit
        })
    },
    // 获取我创建的歌单
    async getCreatedPlaylists() {
        await delay(300)
        return success(createdPlaylists)
    },

    // 获取收藏的歌单
    async getCollectedPlaylists() {
        await delay(300)
        return success(recommendPlaylists)
    },

    // 创建新歌单
    async createPlaylist(name: string, description?: string) {
        await delay(500)
        const newPlaylist: Playlist = {
            id: `created_${Date.now()}`,
            name,
            coverImgUrl: `https://picsum.photos/200/200?random=${Date.now()}`,
            playCount: 0,
            description: description || '新建歌单',
            creator: {
                nickname: '我',
                avatarUrl: ''
            },
            trackCount: 0
        }
        // 这里只是模拟，实际应该在服务器端添加
        return success(newPlaylist)
    },
    // ==================== 首页相关 ====================
    // 获取轮播图
    async getBanners() {
        await delay(200)
        return success(banners)
    },

    // 获取最新音乐
    async getNewSongs(limit = 10) {
        await delay(300)
        return success(newSongs.slice(0, limit))
    },

    // 获取热门歌曲
    async getHotSongs(limit = 10) {
        await delay(300)
        return success(hotSongs.slice(0, limit))
    },

    // ==================== 歌手相关 ====================
    // 获取歌手列表
    async getSingers(limit = 10) {
        await delay(250)
        return success(singers.slice(0, limit))
    },

    // 获取歌手详情
    async getSingerDetail(id: string) {
        await delay(300)
        const singer = singers.find(s => s.id === id)
        if (singer) {
            return success(singer)
        }
        return error('歌手不存在', 404)
    },

    // 获取歌手热门歌曲
    async getSingerSongs(id: string, limit = 10) {
        await delay(350)
        const songs = hotSongs.filter(song =>
            song.singer.some(s => s.id === id)
        )
        return success(songs.slice(0, limit))
    }
}

export default mockApi