/**
 * 格式化时长（秒转 mm:ss）
 * @param seconds 秒数
 * @returns 格式化后的字符串，如 03:45
 */
export const formatTime = (seconds: number) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}
/**
 * 格式化次数(如播放数、分享数)
 * @param count 次数
 * @returns 格式化后的字符串，如 123.5万、1.2亿
 */
export const formatCount = (count: number): string => {
    if (!count) return '0'

    if (count >= 100000000) {
        return (count / 100000000).toFixed(1) + '亿'
    }

    if (count >= 10000) {
        return (count / 10000).toFixed(1) + '万'
    }

    return count.toString()
}
/**
 * 格式化歌手（多个歌手用/连接）
 * @param artists 歌手数组
 * @returns 格式化后的字符串，如 歌手a/歌手b
 */
export const formatArtists = (artists?: { name: string }[]): string => {
    if (!artists || artists.length === 0) return '未知歌手'
    return artists.map(a => a.name).join('/')
}