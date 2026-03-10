import { hotSongs } from './songs'
import { Playlist } from '@/types/music'
// 推荐歌单
export const recommendPlaylists = [
    {
        id: 'playlist_001',
        name: '华语热歌榜',
        coverImgUrl: 'https://p1.music.126.net/2rux5LnJey75tm9Md-9D-Q==/2890616070443534.jpg?param=200y200',//歌单封面图片URL
        playCount: 1234567,//播放次数
        description: '华语最新热门歌曲，每日更新',
        creator: { nickname: '网易云音乐', avatarUrl: '' }, //创建者信息
        trackCount: 50 //歌曲数量
    },
    {
        id: 'playlist_002',
        name: '经典老歌',
        coverImgUrl: 'https://p1.music.126.net/7RdvZJTDo-dgc_hMz1nhCg==/109951170155163448.jpg?imageView=1&thumbnail=800y800&enlarge=1%7CimageView=1&watermark&type=1&image=b2JqL3c1bkRrTUtRd3JMRGpEekNtOE9tLzU2NTA0NjQ4MzMyL2EwMWIvMjAyNDEwMTUxNDUzOS94NDE4MTczMTY1MzU4OTg0Ni5wbmc=&dx=0&dy=0%7Cwatermark&type=1&image=b2JqL3dvbkRsc0tVd3JMQ2xHakNtOEt4LzI3NjEwNDk3MDYyL2VlOTMvOTIxYS82NjE4LzdhMDc5ZDg0NTYyMDAwZmVkZWJmMjVjYjE4NjhkOWEzLnBuZw==&dx=0&dy=0%7CimageView=1?param=200y200',
        playCount: 987654,
        description: '那些年我们一起听过的歌',
        creator: { nickname: '怀旧金曲', avatarUrl: '' },
        trackCount: 80
    },
    {
        id: 'playlist_003',
        name: '摇滚永不灭',
        coverImgUrl: 'https://p1.music.126.net/JhRdBCXaizwFdeGnyrHx_g==/109951172742652156.jpg?imageView=1&thumbnail=800y800&enlarge=1%7CimageView=1&watermark&type=1&image=b2JqL3dvbkRsc0tVd3JMQ2xHakNtOEt4LzI3NjEwNDk3MDYyL2VlOTMvOTIxYS82NjE4LzdhMDc5ZDg0NTYyMDAwZmVkZWJmMjVjYjE4NjhkOWEzLnBuZw==&dx=0&dy=0%7CimageView=1?param=200y200',
        playCount: 654321,
        description: '摇滚不死，经典永存',
        creator: { nickname: '摇滚天堂', avatarUrl: '' },
        trackCount: 65
    },
    {
        id: 'playlist_004',
        name: '民谣故事',
        coverImgUrl: 'http://p1.music.126.net/WfxODD6hCW210yUs3MmU7g==/5965950092818102.jpg?imageView=1&thumbnail=800y800&enlarge=1%7CimageView=1&watermark&type=1&image=b2JqL3c1bkRrTUtRd3JMRGpEekNtOE9tLzc4MDMzNzc0NTk2LzdkMTYvMjAyNjAyNzEwNDk1Ni94MjE0MTc2OTQ4MjE5NjU4NC5wbmc=&dx=0&dy=0%7Cwatermark&type=1&image=b2JqL3dvbkRsc0tVd3JMQ2xHakNtOEt4LzI3NjEwNDk3MDYyL2VlOTMvOTIxYS82NjE4LzdhMDc5ZDg0NTYyMDAwZmVkZWJmMjVjYjE4NjhkOWEzLnBuZw==&dx=0&dy=0%7CimageView=1?param=200y200',
        playCount: 543210,
        description: '每一个民谣都有一个故事',
        creator: { nickname: '民谣小屋', avatarUrl: '' },
        trackCount: 45
    },
    {
        id: 'playlist_005',
        name: '电音狂欢',
        coverImgUrl: 'https://p1.music.126.net/c1yw55r05CktQg2YRvj5KQ==/109951168930886146.jpg?imageView=1&thumbnail=800y800&enlarge=1%7CimageView=1&watermark&type=1&image=b2JqL3c1bkRrTUtRd3JMRGpEekNtOE9tLzc2MzkxNzc3Nzc5LzBlNWEvMjAyNTEwMTExODU3MzAveDQ1MjE3NjI4NTg2NTAwNjIucG5n&dx=0&dy=0%7Cwatermark&type=1&image=b2JqL3dvbkRsc0tVd3JMQ2xHakNtOEt4LzI3NjEwNDk3MDYyL2VlOTMvOTIxYS82NjE4LzdhMDc5ZDg0NTYyMDAwZmVkZWJmMjVjYjE4NjhkOWEzLnBuZw==&dx=0&dy=0%7CimageView=1?param=200y200',
        playCount: 432109,
        description: '让你的心跳跟着节奏',
        creator: { nickname: '电子音乐', avatarUrl: '' },
        trackCount: 70
    }
]

// 歌单详情
export const playlistDetails: Record<string, any> = {
    'playlist_001': {
        id: 'playlist_001',
        name: '华语热歌榜',
        coverImgUrl: 'https://p1.music.126.net/2rux5LnJey75tm9Md-9D-Q==/2890616070443534.jpg?param=200y200',
        creator: { nickname: '网易云音乐', avatarUrl: '' },
        description: '华语最新热门歌曲，每日更新',
        trackCount: 50,
        playCount: 1234567,
        shareCount: 12345,
        commentCount: 6789,
        subscribed: false,
        tags: ['华语', '流行', '热歌'],
        tracks: hotSongs.slice(0, 5) // 取前5首
    },
    'playlist_002': {
        id: 'playlist_002',
        name: '经典老歌',
        coverImgUrl: 'https://p1.music.126.net/7RdvZJTDo-dgc_hMz1nhCg==/109951170155163448.jpg?imageView=1&thumbnail=800y800&enlarge=1%7CimageView=1&watermark&type=1&image=b2JqL3c1bkRrTUtRd3JMRGpEekNtOE9tLzU2NTA0NjQ4MzMyL2EwMWIvMjAyNDEwMTUxNDUzOS94NDE4MTczMTY1MzU4OTg0Ni5wbmc=&dx=0&dy=0%7Cwatermark&type=1&image=b2JqL3dvbkRsc0tVd3JMQ2xHakNtOEt4LzI3NjEwNDk3MDYyL2VlOTMvOTIxYS82NjE4LzdhMDc5ZDg0NTYyMDAwZmVkZWJmMjVjYjE4NjhkOWEzLnBuZw==&dx=0&dy=0%7CimageView=1?param=200y200',
        creator: { nickname: '怀旧金曲', avatarUrl: '' },
        description: '那些年我们一起听过的歌',
        trackCount: 80,
        playCount: 987654,
        shareCount: 9876,
        commentCount: 5432,
        subscribed: false,
        tags: ['怀旧', '经典'],
        tracks: hotSongs.slice(1, 6)
    },
    'playlist_003': {
        id: 'playlist_003',
        name: '摇滚永不灭',
        coverImgUrl: 'https://p1.music.126.net/JhRdBCXaizwFdeGnyrHx_g==/109951172742652156.jpg?param=200y200',
        creator: { nickname: '摇滚天堂', avatarUrl: '' },
        description: '摇滚不死，经典永存。收录国内外经典摇滚金曲，让你感受摇滚的魅力。',
        trackCount: 65,
        playCount: 654321,
        shareCount: 5432,
        commentCount: 3210,
        subscribed: false,
        tags: ['摇滚', '经典', '乐队'],
        tracks: [
            hotSongs[2], // 如愿 (王菲)
            hotSongs[0], // 一路生花 (温奕心)
            hotSongs[3], // 爱你 (王心凌)
            hotSongs[4], // 最美的太阳 (张杰)
            hotSongs[1], // 孤勇者 (陈奕迅)
            {
                id: 'rock_001',
                name: '海阔天空',
                singer: [{ id: 'singer_001', name: 'Beyond' }],
                interval: 325,
                album: { id: 'album_001', name: '乐与怒', picUrl: '' }
            },
            {
                id: 'rock_002',
                name: '无地自容',
                singer: [{ id: 'singer_002', name: '黑豹乐队' }],
                interval: 298,
                album: { id: 'album_002', name: '黑豹', picUrl: '' }
            }
        ]
    },
    'playlist_004': {
        id: 'playlist_004',
        name: '民谣故事',
        coverImgUrl: 'http://p1.music.126.net/WfxODD6hCW210yUs3MmU7g==/5965950092818102.jpg?imageView=1&thumbnail=800y800&enlarge=1%7CimageView=1&watermark&type=1&image=b2JqL3c1bkRrTUtRd3JMRGpEekNtOE9tLzc4MDMzNzc0NTk2LzdkMTYvMjAyNjAyNzEwNDk1Ni94MjE0MTc2OTQ4MjE5NjU4NC5wbmc=&dx=0&dy=0%7Cwatermark&type=1&image=b2JqL3dvbkRsc0tVd3JMQ2xHakNtOEt4LzI3NjEwNDk3MDYyL2VlOTMvOTIxYS82NjE4LzdhMDc5ZDg0NTYyMDAwZmVkZWJmMjVjYjE4NjhkOWEzLnBuZw==&dx=0&dy=0%7CimageView=1?param=200y200',
        creator: { nickname: '民谣小屋', avatarUrl: '' },
        description: '每一个民谣都有一个故事，每一个故事都值得倾听。',
        trackCount: 45,
        playCount: 543210,
        shareCount: 4321,
        commentCount: 2109,
        subscribed: false,
        tags: ['民谣', '治愈', '故事'],
        tracks: [
            {
                id: 'folk_001',
                name: '成都',
                singer: [{ id: 'singer_003', name: '赵雷' }],
                interval: 328,
                album: { id: 'album_003', name: '成都', picUrl: '' }
            },
            {
                id: 'folk_002',
                name: '南山南',
                singer: [{ id: 'singer_004', name: '马頔' }],
                interval: 315,
                album: { id: 'album_004', name: '南山南', picUrl: '' }
            },
            {
                id: 'folk_003',
                name: '董小姐',
                singer: [{ id: 'singer_005', name: '宋冬野' }],
                interval: 302,
                album: { id: 'album_005', name: '董小姐', picUrl: '' }
            },
            hotSongs[2], // 如愿
            hotSongs[0], // 一路生花
            {
                id: 'folk_004',
                name: '理想三旬',
                singer: [{ id: 'singer_006', name: '陈鸿宇' }],
                interval: 312,
                album: { id: 'album_006', name: '浓烟下的诗歌电台', picUrl: '' }
            }
        ]
    },
    'playlist_005': {
        id: 'playlist_005',
        name: '电音狂欢',
        coverImgUrl: 'https://p1.music.126.net/c1yw55r05CktQg2YRvj5KQ==/109951168930886146.jpg?param=200y200',
        creator: { nickname: '电子音乐', avatarUrl: '' },
        description: '让你的心跳跟着节奏，感受电子音乐的魅力。',
        trackCount: 70,
        playCount: 432109,
        shareCount: 3210,
        commentCount: 1543,
        subscribed: false,
        tags: ['电音', 'DJ', '舞曲'],
        tracks: [
            {
                id: 'electronic_001',
                name: 'Faded',
                singer: [{ id: 'singer_007', name: 'Alan Walker' }],
                interval: 210,
                album: { id: 'album_007', name: 'Faded', picUrl: '' }
            },
            {
                id: 'electronic_002',
                name: 'The Spectre',
                singer: [{ id: 'singer_007', name: 'Alan Walker' }],
                interval: 195,
                album: { id: 'album_008', name: 'The Spectre', picUrl: '' }
            },
            {
                id: 'electronic_003',
                name: 'Alone',
                singer: [{ id: 'singer_008', name: 'Marshmello' }],
                interval: 185,
                album: { id: 'album_009', name: 'Alone', picUrl: '' }
            },
            hotSongs[1], // 孤勇者
            hotSongs[3], // 爱你
            {
                id: 'electronic_004',
                name: 'Unity',
                singer: [{ id: 'singer_009', name: 'TheFatRat' }],
                interval: 225,
                album: { id: 'album_010', name: 'Unity', picUrl: '' }
            }
        ]
    }
}
// 我创建的歌单
export const createdPlaylists: Playlist[] = [
    {
        id: 'created_1',
        name: '我喜欢的音乐',
        coverImgUrl: 'https://picsum.photos/200/200?random=1',
        playCount: 12345,
        description: '收藏的喜欢的歌曲',
        creator: {
            nickname: '我',
            avatarUrl: ''
        },
        trackCount: 128
    },
    {
        id: 'created_2',
        name: '学习专注',
        coverImgUrl: 'https://picsum.photos/200/200?random=2',
        playCount: 5678,
        description: '适合学习时听的纯音乐',
        creator: {
            nickname: '我',
            avatarUrl: ''
        },
        trackCount: 56
    },
    {
        id: 'created_3',
        name: '运动健身',
        coverImgUrl: 'https://picsum.photos/200/200?random=3',
        playCount: 4321,
        description: '节奏感强的运动音乐',
        creator: {
            nickname: '我',
            avatarUrl: ''
        },
        trackCount: 42
    }
]