// 热门歌曲数据
export const hotSongs = [
    {
        id: '167876',
        name: '晴天',
        singer: [{ id: '6452', name: '周杰伦' }],
        album: {
            id: '15847',
            name: '叶惠美',
            picUrl: 'https://p2.music.126.net/UqT2CS0HhO9I9J-QQkIhVg==/19000128266865535.jpg'
        },
        interval: 282, // 单位：秒
        mvId: '5432107',
        lyric: '[00:00.00]故事的小黄花 从出生那年就飘着...'
    },
    {
        id: '185709',
        name: '七里香',
        singer: [{ id: '6452', name: '周杰伦' }],
        album: {
            id: '16587',
            name: '七里香',
            picUrl: 'https://p2.music.126.net/fjP0QzQzQzQzQzQzQzQzQz==/19000128266865536.jpg'
        },
        interval: 245,
        mvId: '5432110',
        lyric: '[00:00.00]窗外的麻雀 在电线杆上多嘴...'
    },
    {
        id: '5279202',
        name: '夜曲',
        singer: [{ id: '6452', name: '周杰伦' }],
        album: {
            id: '18588',
            name: '11月的萧邦',
            picUrl: 'https://p2.music.126.net/ZzQzQzQzQzQzQzQzQzQzQz==/19000128266865537.jpg'
        },
        interval: 215,
        mvId: '5432115',
        lyric: '[00:00.00]一群嗜血的蚂蚁 被腐肉所吸引...'
    },
    {
        id: '256401',
        name: '后来',
        singer: [{ id: '4678', name: '刘若英' }],
        album: {
            id: '17890',
            name: '我等你',
            picUrl: 'https://p2.music.126.net/pzQzQzQzQzQzQzQzQzQzQz==/19000128266865538.jpg'
        },
        interval: 323,
        lyric: '[00:00.00]后来 我总算学会了 如何去爱...'
    },
    {
        id: '308598',
        name: '童话',
        singer: [{ id: '3890', name: '光良' }],
        album: {
            id: '16789',
            name: '童话',
            picUrl: 'https://p2.music.126.net/qzQzQzQzQzQzQzQzQzQzQz==/19000128266865539.jpg'
        },
        interval: 245,
        lyric: '[00:00.00]忘了有多久 再没听到你...'
    },
    {
        id: '190375',
        name: '江南',
        singer: [{ id: '4567', name: '林俊杰' }],
        album: {
            id: '15678',
            name: '第二天堂',
            picUrl: 'https://p2.music.126.net/rzQzQzQzQzQzQzQzQzQzQz==/19000128266865540.jpg'
        },
        interval: 265,
        mvId: '5432120',
        lyric: '[00:00.00]风到这里就是粘 粘住过客的思念...'
    }
]

// 最新音乐
export const newSongs = [
    {
        id: '20241101',
        name: 'Mojito',
        singer: [{ id: '8901', name: '周杰伦' }],
        album: {
            id: '34567',
            name: 'Mojito',
            picUrl: 'http://p1.music.126.net/d_yieD2xJu5VBydT-5U1ig==/109951167909350869.jpg?param=177y177'
        },
        interval: 185
    },
    {
        id: '20241102',
        name: 'Extral',
        singer: [{ id: '7890', name: 'JENNIE' }, { id: '4320', name: 'Doechii' }],
        album: {
            id: '34569',
            name: 'Extral',
            picUrl: 'http://p2.music.126.net/nJcuanDShJ8b4WUk1c51-w==/109951170708714232.jpg?param=177y177'
        },
        interval: 167
    }
]

// 播放地址映射（使用网易云官方试听地址）
export const songUrls: Record<string, string> = {
    '167876': 'https://www.soundjay.com/button/beep-07.mp3',
    '185709': 'https://www.soundjay.com/button/beep-07.mp3',
    '5279202': 'https://www.soundjay.com/button/beep-07.mp3',
    '256401': 'https://www.soundjay.com/button/beep-07.mp3',
    '308598': 'https://www.soundjay.com/button/beep-07.mp3',
    '190375': 'https://www.soundjay.com/button/beep-07.mp3',
}