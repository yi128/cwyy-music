// 推荐歌单接口
export interface Playlist {
    id: number,
    name: string,
    picUrl?: string,
    playCount: number,
    trackCount: number,
    trackNumberUpdateTime?: number;
    type?: number,
    coverImgUrl: string,
    creator: {
        nickname: string,
        avatarUrl: string,
    }
}
// 歌单详情接口
export interface PlaylistDetail {
    id: number,
    name: string,
    coverImgUrl: string,
    creator: {
        nickname: string,
        avatarUrl: string,
    };
    createTime: number,
    description: string,
    trackCount: number,
    playCount: number,
    shareCount: number,
    tags: string[],
    tracks: {
        id: number,
        name: string,
        singer: {
            id: string,
            name: string
        }[],
        album: {
            id: number,
            name: string,
            picUrl: string
        },
        ar: string[],
        dt: number,
        lyric: string
    }[]
}
// Banner 类型定义（根据API返回结构调整）
export interface Banner {
    bigImageUrl: string;      // 大图URL
    imageUrl: string;         // 普通图URL
    targetId: number;         // 目标ID
    targetType: number;       // 目标类型
    typeTitle: string;        // 标题
    url: string;              // 跳转链接
}
// 歌手类型
export interface Artist {
    albumSize?: number;
    id: number;
    name: string;
    picId?: number;
    picUrl?: string;
    topicPerson: number;
    trans?: string;
    alias?: string[];
}

// 专辑类型
export interface Album {
    alias?: string[];
    artists: Artist[];
    blurPicUrl?: string;
    copyrightId: number;
    gapless: number;
    id: number;
    mark: number;
    name: string;
    onSale: boolean;
    pic: number;
    picId: number;
    picId_str: string;
    picUrl: string;
    publishTime?: number;
    size: number;
    song: Song;
    songs?: Song[];
    status: number;
    subType: string;
    tags?: string[];
    transName?: string;
    type: string;
}

// 歌曲类型
export interface Song {
    id: number;
    name: string;
    artists: Artist[];
    album: Album;
    duration: number;     //返回的是毫秒
    status?: number;
    picUrl: string;
    type: number;
}


// 歌单详情接口
export interface PlaylistDetail {
    id: string;
    name: string;
    coverImgUrl: string;
    creator: {
        nickname: string;
        avatarUrl: string;
    };
    description: string;
    trackCount: number;
    playCount: number;
    shareCount: number;
    commentCount: number;
    subscribed: boolean;
    tags: string[];
}