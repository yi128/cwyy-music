import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSongDetail, getSongUrl } from '@/api/modules/song'
export const usePlayerStore = defineStore('player', () => {
    // ========== state ==========
    const playlist = ref<any[]>([])//播放列表
    const currentIndex = ref(-1)//当前是第几首歌曲
    const playing = ref(false)//播放状态
    const currentTime = ref(0)//当前播放时间
    // 音量系数：0-1.0
    const volume = ref(0.8)//音量
    const muted = ref(false)//是否静音
    const playMode = ref(0) // 0顺序 1单曲 2随机

    // ========== Getters ==========
    // 当前播放歌曲
    const currentSong = computed(() =>
        currentIndex.value >= 0 ? playlist.value[currentIndex.value] : null
    )
    // 歌曲时长
    const duration = computed(() => currentSong.value?.dt / 1000 || 0)
    // 封面图片
    const picUrl = computed(() => currentSong.value?.al?.picUrl || '')
    // 歌曲名称
    const songName = computed(() => currentSong.value?.name || '')
    // 歌手
    const artists = computed(() =>
        currentSong.value?.ar?.map((s: any) => s.name).join('/') || ''
    )
    // 专辑名称
    const albumName = computed(() => currentSong.value?.album?.name || '')

    // ========== Actions ==========
    //播放/暂停
    const togglePlay = () => {
        playing.value = !playing.value
    }
    // 播放指定歌曲
    const playSong = async (id: number, autoPlay = true) => {
        try {
            const res = await getSongDetail(id)
            if (res.code === 200) {
                const song = res.data
                console.log(song)
                // 查找是否已在播放列表
                const index = playlist.value.findIndex((s: any) => s.id === id)
                if (index !== -1) {
                    currentIndex.value = index
                } else {
                    playlist.value.push({ ...song })  // 浅拷贝
                    currentIndex.value = playlist.value.length - 1
                }

                if (autoPlay) {
                    const urlRes = await getSongUrl(id)
                    if (urlRes.code === 200) {
                        console.log('🎵 播放地址:', urlRes.data.url)
                        playing.value = true
                    }
                }
            }
        } catch (error) {
            console.error('播放失败:', error)
        }
    }
    // 播放歌单列表
    const playPlaylist = (songs: any[], startIndex = 0) => {
        //  创建新数组，断开引用
        playlist.value = songs.map(song => ({ ...song }))  // 浅拷贝就够用
        currentIndex.value = startIndex
        playing.value = true
    }
    // 下一首（根据播放模式）
    const playNext = () => {
        if (playlist.value.length === 0) return

        let newIndex: number

        switch (playMode.value) {
            case 0: // 顺序播放
                newIndex = currentIndex.value + 1
                if (newIndex >= playlist.value.length) {
                    newIndex = 0 // 循环到第一首
                }
                break

            case 1: // 单曲循环
                newIndex = currentIndex.value // 还是同一首
                break

            case 2: // 随机播放
                do {
                    newIndex = Math.floor(Math.random() * playlist.value.length)
                } while (newIndex === currentIndex.value && playlist.value.length > 1)
                // 如果只有一首歌，就还是同一首
                break

            default:
                newIndex = currentIndex.value + 1
        }

        currentIndex.value = newIndex
        playing.value = true
    }

    // 上一首
    const playPrev = () => {
        if (playlist.value.length === 0) return

        let newIndex: number

        switch (playMode.value) {
            case 0: // 顺序播放
                newIndex = currentIndex.value - 1
                if (newIndex < 0) {
                    newIndex = playlist.value.length - 1 // 循环到最后一首
                }
                break

            case 1: // 单曲循环
                newIndex = currentIndex.value // 还是同一首
                break

            case 2: // 随机播放
                do {
                    newIndex = Math.floor(Math.random() * playlist.value.length)
                } while (newIndex === currentIndex.value && playlist.value.length > 1)
                break

            default:
                newIndex = currentIndex.value - 1
        }

        currentIndex.value = newIndex
        playing.value = true
    }
    const setCurrentTime = (time: number) => {
        currentTime.value = time
    }
    //调节音量
    const setVolume = (val: number) => {
        volume.value = Math.max(0, Math.min(1, val))
        muted.value = false
    }
    // 切换静音
    const toggleMute = () => {
        muted.value = !muted.value
    }
    // 切换播放模式
    const togglePlayMode = () => {
        playMode.value = (playMode.value + 1) % 3
    }
    // 删除播放列表中的歌曲
    const removeFromPlaylist = (id: string) => {
        const index = playlist.value.findIndex((s: any) => s.id === id)
        if (index === -1) return

        playlist.value.splice(index, 1)

        if (index === currentIndex.value) {
            if (playlist.value.length === 0) {
                currentIndex.value = -1
                playing.value = false
            } else {
                currentIndex.value = Math.min(index, playlist.value.length - 1)
                playing.value = true
            }
        } else if (index < currentIndex.value) {
            currentIndex.value--
        }
    }
    // 清空播放列表
    const clearPlaylist = () => {
        playlist.value = []
        currentIndex.value = -1
        playing.value = false
    }

    return {
        // state
        playlist,
        currentIndex,
        playing,
        currentTime,
        volume,
        muted,
        playMode,

        // getters
        currentSong,
        duration,
        picUrl,
        songName,
        artists,
        albumName,

        // actions
        togglePlay,
        playSong,
        playPlaylist,
        playPrev,
        playNext,
        setCurrentTime,
        setVolume,
        toggleMute,
        togglePlayMode,
        removeFromPlaylist,
        clearPlaylist
    }
})