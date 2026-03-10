// 歌曲接口
export interface Song {
    id: string,
    name: string,
    singer: {
        id: string,
        name: string
    }[],
    album: {
        id: string,
        name: string,
        picUrl: string
    },
    interval: number
    mvId?: string,
    lyric?: string
}
// 推荐歌单接口
export interface Playlist {
    id: string,
    name: string,
    coverImgUrl: string,
    playCount: number,
    description: string,
    creator: {
        nickname: string,
        avatarUrl: string,
    },
    trackCount: number
}
// 歌单详情接口
export interface PlaylistDetail {
    id: string,
    name: string,
    coverImgUrl: string,
    creator: {
        nickname: string,
        avatarUrl: string,
    };
    description: string,
    trackCount: number,
    playCount: number,
    shareCount: number,
    commentCount: number,
    subscribed: boolean,
    tags: string[],
    tracks: {
        id: string,
        name: string,
        singer: {
            id: string,
            name: string
        }[],
        album: {
            id: string,
            name: string,
            picUrl: string
        },
        interval: number,
        mvId: string,
        lyric: string
    }[]
}
// 轮播图接口
export interface Banner {
    id: string,
    pic: string,
    title: string,
    url: string
}
